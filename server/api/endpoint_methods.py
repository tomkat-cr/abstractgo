import os
import base64
import json
from typing import Union


from .ai_models import AIModels
from .ml_models import MLModels
from .json_models import get_all_training_metrics
from .types import Article
from .utilities import (
    SERVER_DEBUG as DEBUG,
    remove_temp_file,
    get_temp_random_file_path,
    get_standard_response
)
from .dashboard_metrics import StaticDashboardMetrics
from .dashboard_metrics_from_db import DashboardMetricsFromDb


PDFREAD_USE_URL = os.environ.get("PDFREAD_USE_URL", "0") == "1"

ml_model = MLModels()

ai_model_params = {}
ai_model = AIModels(params=ai_model_params)

dashboard_metrics_handler = StaticDashboardMetrics()
dashboard_metrics_from_db_handler = DashboardMetricsFromDb()


def read_root_tool() -> dict[str, str]:
    return {"message": "Welcome to AbstractGo: the Biomedical Classifier API"}


def training_metrics_tool() -> dict[str, str]:
    """
    Get the training metrics for the model.
    """
    metrics = get_all_training_metrics()
    return metrics


def predict_tool(article: Article) -> dict[str, str]:
    """
    Predict categories for a biomedical article.

    Accepts a JSON body with `title` and `abstract`.

    Returns a JSON object with the predicted category and confidence.
    """

    if ml_model.model is None:
        return get_standard_response(
            error=True,
            status_code=500,
            error_message="Model not loaded"
        )

    # Resolve title and abstract from inputs
    resolved_title = article.title.strip()
    resolved_abstract = article.abstract.strip()

    if DEBUG:
        print("Article: ", article)
        print(f"Resolved title: {resolved_title}")
        print(f"Resolved abstract: {resolved_abstract}")

    # Validate we have the necessary text
    if not resolved_title and not resolved_abstract:
        return get_standard_response(
            error=True,
            status_code=400,
            error_message="No input provided. Send JSON with title/abstract or"
                          " upload a text file via multipart/form-data.",
        )

    # Perform prediction
    text = (resolved_title or "") + " " + (resolved_abstract or "")
    predictions = ml_model.predict_infer(text)

    return get_standard_response(
        resultset=predictions["predicted_labels"]
    )


def pdfread_tool(
    raw_bytes: Union[bytes, str],
    file_name: str,
) -> dict[str, str]:
    """
    Read a PDF file and extract the title and abstract.
    Args:
        raw_bytes (bytes | str): The raw bytes of the file.
        file_name (str): The name of the file.

    Returns a JSON object with the title and abstract.
    """

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
            return get_standard_response(
                error=True,
                status_code=500,
                error_message=f"Unsupported file type: {file_name}"
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
            return get_standard_response(
                error=True,
                status_code=500,
                error_message="Error parsing AI model response: " +
                ai_model_response["text"] +
                " | " + str(e)
            )

    response = get_standard_response(
        error=False,
        status_code=200,
        resultset={
            "title": ai_model_response["text"].get("title", ""),
            "abstract": ai_model_response["text"].get("abstract", "")
        }
    )

    if DEBUG:
        print("pdfread() - AI model response: ", ai_model_response)
        print("pdfread() - Response: ", response)

    if PDFREAD_USE_URL:
        remove_temp_file(temp_file_path)

    return response


def ai_model_params_tool() -> dict[str, str]:
    """
    Get the parameters for the AI model.
    """
    return ai_model.model


def get_assets_tool(filename: str) -> dict[str, str]:
    """
    Get temp file from local filesystem
    Args:
        filename (str, optional): The filename
    Returns:
        str: The object as URL
    """
    if DEBUG:
        print(f"get_assets() - filename: {filename}")

    file_path = os.path.join('/tmp', os.path.basename(filename))
    if DEBUG:
        print(f"get_assets() - file_path: {file_path}")

    if not os.path.exists(file_path):
        if DEBUG:
            print(f"get_assets() - file not found: {file_path}")
        return get_standard_response(
            error=True,
            status_code=404,
            error_message=f"File not found: {file_path}"
        )
    return get_standard_response(
        file_path=file_path
    )


def health_tool() -> dict[str, str]:
    """
    Health check endpoint.
    """
    return {"status": "ok"}


def dashboard_metrics_tool() -> dict[str, str]:
    """
    Dashboard metrics endpoint.
    """
    return dashboard_metrics_handler.get_dashboard_metrics()


def dashboard_confusion_matrix_tool() -> dict[str, str]:
    """
    Dashboard confusion matrix endpoint.
    """
    return dashboard_metrics_handler.get_dashboard_confusion_matrix()


def dashboard_performance_tool() -> dict[str, str]:
    """
    Dashboard performance endpoint.
    """
    return dashboard_metrics_handler.get_dashboard_performance()


def dashboard_distribution_tool() -> dict[str, str]:
    """
    Dashboard distribution endpoint.
    """
    return dashboard_metrics_handler.get_dashboard_distribution()


def dashboard_analytics_tool() -> dict[str, str]:
    """
    Dashboard analytics endpoint.
    """
    return dashboard_metrics_from_db_handler \
        .get_dashboard_analytics()


def dashboard_classification_history_tool() -> dict[str, str]:
    """
    Dashboard classification history endpoint.
    """
    return dashboard_metrics_from_db_handler \
        .get_dashboard_classification_history()


def authentication_tool(api_key: str) -> dict[str, str]:
    """
    Authenticate the user.
    """
    if api_key != os.environ.get("API_KEY"):
        return get_standard_response(
            error=True,
            status_code=401,
            error_message="Invalid API key"
        )
    return get_standard_response(
        resultset={"authenticated": True}
    )
