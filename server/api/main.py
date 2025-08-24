import os
import base64
import json
from typing import Optional

from fastapi import FastAPI, HTTPException, Body
from fastapi import UploadFile, File
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware

from .ai_models import AIModels
from .ml_models import MLModels
from .json_models import get_all_training_metrics
from .types import Metrics, Prediction, Article
from .utilities import (
    SERVER_DEBUG as DEBUG,
    remove_temp_file,
    get_temp_random_file_path
)
from .dashboard_metrics import DashboardMetrics


PDFREAD_USE_URL = os.environ.get("PDFREAD_USE_URL", "0") == "1"


# Initialize the FastAPI application
app = FastAPI(title="Biomedical Article Classifier API")

CORS_ORIGIN = os.environ.get("CORS_ORIGIN", "http://localhost:3000")
app.add_middleware(
    CORSMiddleware,
    allow_origins=[CORS_ORIGIN],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


ml_model = MLModels()

ai_model_params = {}
ai_model = AIModels(params=ai_model_params)


@app.get("/")
def read_root():
    return {"message": "Welcome to AbstractGo: the Biomedical Classifier API"}


@app.get("/training_metrics", response_model=Metrics)
def training_metrics():
    """
    Get the training metrics for the model.
    """
    metrics = get_all_training_metrics()
    return metrics


@app.post("/predict", response_model=list[Prediction])
def predict(
    article: Article | None = Body(default=None),
):
    """
    Predict categories for a biomedical article.

    Accepts a JSON body with `title` and `abstract`.

    Returns a JSON object with the predicted category and confidence.
    """

    # if classifier is None:
    if ml_model.model is None:
        raise HTTPException(status_code=500, detail="Model not loaded")

    # Resolve title and abstract from inputs
    resolved_title = article.title.strip()
    resolved_abstract = article.abstract.strip()

    if DEBUG:
        print("Article: ", article)
        print(f"Resolved title: {resolved_title}")
        print(f"Resolved abstract: {resolved_abstract}")

    # Validate we have the necessary text
    if not resolved_title and not resolved_abstract:
        raise HTTPException(
            status_code=400,
            detail="No input provided. Send JSON with title/abstract or"
                   " upload a text file via multipart/form-data.",
        )

    # Perform prediction
    text = (resolved_title or "") + " " + (resolved_abstract or "")
    predictions = ml_model.predict_infer(text)

    return predictions["predicted_labels"]


@app.post("/pdfread", response_model=Article)
def pdfread(
    file: UploadFile = File(...),
) -> dict[str, str]:
    """
    Read a PDF file and extract the title and abstract.

    Accepts:
    - Multipart form-data with `file` (.pdf)

    Returns a JSON object with the title and abstract.

    Example:
    curl -X POST -F "file=@/path/to/your.pdf" http://localhost:8000/pdfread
    """
    if file is None:
        raise HTTPException(
            status_code=400,
            detail="No file provided"
        )

    # Try to read from uploaded file (supports .txt/plain text and PDF)
    try:
        raw_bytes = file.file.read()
    except Exception as e:
        raise HTTPException(
            status_code=400,
            detail=f"Error reading file: {e}"
        )
    finally:
        try:
            file.file.close()
        except Exception:
            pass

    file_name = file.filename

    if PDFREAD_USE_URL:
        temp_file_path = get_temp_random_file_path(file_name)
        # Get only the filename from the temp file path
        temp_file_name = os.path.basename(temp_file_path)
        with open(temp_file_path, 'wb') as f:
            f.write(raw_bytes)
        temp_url = f"{os.environ.get('APP_DOMAIN_NAME')}"
        temp_url += "/" \
            if not os.environ.get('APP_DOMAIN_NAME').endswith("/") \
            else ""
        temp_url += "get_assets/" + temp_file_name
        attachments = [
            {
                "file_name": temp_file_name,
                "url": temp_url
            }
        ]
    else:
        temp_url = None

        # Content must be in base64 format for OpenAI
        content = base64.b64encode(raw_bytes).decode("utf-8")

        if file_name and file_name.endswith(".pdf"):
            attachment = f"data:application/pdf;base64,{content}"
        elif file_name and (file_name.endswith(".txt") or
                            file_name.endswith(".csv")):
            attachment = f"data:text/plain;base64,{content}"
        elif file_name and file_name.endswith(".docx"):
            attachment = (
                "data:application/vnd.openxmlformats"
                "-officedocument.wordprocessingml.document;"
                f"base64,{content}")
        elif file_name and file_name.endswith(".doc"):
            attachment = f"data:application/msword;base64,{content}"
        elif file_name and file_name.endswith(".rtf"):
            attachment = f"data:text/rtf;base64,{content}"
        else:
            print(f"Unsupported file type: {file_name}")
            raise HTTPException(
                status_code=400,
                detail=f"Unsupported file type: {file_name}"
            )
        attachments = [
            {
                "file_name": file_name,
                "url": None,
                "file_data": attachment,
            }
        ]

    if DEBUG:
        print(f"File name: {file_name}")
        print(f"File temp url: {temp_url}")
        print(f"File attachments: {attachments}")

    system_prompt = """
    You are a helpful assistant that can read and understand text, PDF,
    and other files.
    You are given a file and you need to extract the title and abstract.
    Figure out the language of the file and use the correct language for the
    title and abstract.
    Figure out the best way to extract the title and abstract from the file.
    Return the title and abstract in the following JSON format:
    {{
        "title": "Title of the article",
        "abstract": "Abstract of the article"
    }}
    """

    user_prompt = """
    Give me the title and abstract of the file
    """

    ai_model_response = ai_model.infer(
        system=system_prompt,
        query=user_prompt,
        attachments=attachments
    )

    if DEBUG:
        print("AI model response: ", ai_model_response)

    if ai_model_response.get("text") and \
       isinstance(ai_model_response["text"], str):
        try:
            ai_model_response["text"] = json.loads(ai_model_response["text"])
        except Exception as e:
            raise HTTPException(
                status_code=500,
                detail="Error parsing AI model response: " +
                ai_model_response["text"] +
                " | " + str(e)
            )

    response = {
        "title": ai_model_response["text"].get("title", ""),
        "abstract": ai_model_response["text"].get("abstract", "")
    }

    if DEBUG:
        print("pdfread() - AI model response: ", ai_model_response)
        print("pdfread() - Response: ", response)

    if PDFREAD_USE_URL:
        remove_temp_file(temp_file_path)

    return response


@app.get("/ai_model_params")
def ai_model_params():
    """
    Get the parameters for the AI model.
    """
    return ai_model.model


@app.get("/get_assets/{filename}", response_model=None)
def get_assets(
    filename: str,
) -> Optional[FileResponse]:
    """
    Get temp file from local filesystem
    Args:
        filename (str, optional): The filename
            (bucket_name, separator and key). Defaults to None.
    Returns:
        Response | FileResponse | StreamingResponse: The object as streaming
            response or error response.
    """
    if DEBUG:
        print(f"get_assets() - filename: {filename}")

    file_path = os.path.join('/tmp', os.path.basename(filename))
    if DEBUG:
        print(f"get_assets() - file_path: {file_path}")

    if not os.path.exists(file_path):
        if DEBUG:
            print(f"get_assets() - file not found: {file_path}")
        raise HTTPException(
            status_code=404,
            detail=f"File not found: {file_path}"
        )
    return FileResponse(file_path)


@app.get("/health")
def health():
    """
    Health check endpoint.
    """
    return {"status": "ok"}


@app.get("/dashboard/metrics")
def dashboard_metrics():
    """
    Dashboard metrics endpoint.
    """
    return DashboardMetrics().get_dashboard_metrics()


@app.get("/dashboard/confusion-matrix")
def dashboard_confusion_matrix():
    """
    Dashboard confusion matrix endpoint.
    """
    return DashboardMetrics().get_dashboard_confusion_matrix()


@app.get("/dashboard/performance")
def dashboard_performance():
    """
    Dashboard performance endpoint.
    """
    return DashboardMetrics().get_dashboard_performance()


@app.get("/dashboard/distribution")
def dashboard_distribution():
    """
    Dashboard distribution endpoint.
    """
    return DashboardMetrics().get_dashboard_distribution()


@app.get("/dashboard/analytics")
def dashboard_analytics():
    """
    Dashboard analytics endpoint.
    """
    return DashboardMetrics().get_dashboard_analytics()


@app.get("/dashboard/classification-history")
def dashboard_classification_history():
    """
    Dashboard classification history endpoint.
    """
    return DashboardMetrics().get_dashboard_classification_history()
