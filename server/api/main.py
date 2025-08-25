import os
from typing import Optional

from fastapi import FastAPI, HTTPException, Body
from fastapi import UploadFile, File
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware

from .ai_models import AIModels
from .ml_models import MLModels
from .types import Metrics, Prediction, Article
from .dashboard_metrics import StaticDashboardMetrics
from .dashboard_metrics_from_db import DashboardMetricsFromDb
from .endpoint_methods import (
    read_root_tool,
    training_metrics_tool,
    predict_tool,
    pdfread_tool,
    ai_model_params_tool,
    get_assets_tool,
    health_tool,
    dashboard_metrics_tool,
    dashboard_confusion_matrix_tool,
    dashboard_performance_tool,
    dashboard_distribution_tool,
    dashboard_analytics_tool,
    dashboard_classification_history_tool,
)

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

dashboard_metrics_handler = StaticDashboardMetrics()
dashboard_metrics_from_db_handler = DashboardMetricsFromDb()


@app.get("/")
def read_root() -> dict[str, str]:
    return read_root_tool()


@app.get("/training_metrics", response_model=Metrics)
def training_metrics() -> dict[str, str]:
    """
    Get the training metrics for the model.
    """
    return training_metrics_tool()


@app.post("/predict", response_model=list[Prediction])
def predict(
    article: Article | None = Body(default=None),
) -> dict[str, str]:
    """
    Predict categories for a biomedical article.

    Accepts a JSON body with `title` and `abstract`.

    Returns a JSON object with the predicted category and confidence.
    """
    result = predict_tool(article)
    if result.get("error"):
        raise HTTPException(
            status_code=result.get("status_code", 500),
            detail=result.get("error_message", "Internal server error [010]")
        )
    return result.get("resultset")


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

    result = pdfread_tool(raw_bytes, file_name)
    if result.get("error"):
        raise HTTPException(
            status_code=result.get("status_code", 500),
            detail=result.get("error_message", "Internal server error [011]")
        )
    return result.get("resultset")


@app.get("/ai_model_params")
def ai_model_params():
    """
    Get the parameters for the AI model.
    """
    return ai_model_params_tool()


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
    result = get_assets_tool(filename)
    if result.get("error"):
        raise HTTPException(
            status_code=result.get("status_code", 500),
            detail=result.get("error_message", "Internal server error [012]")
        )
    return FileResponse(result.get("file_path"))


@app.get("/health")
def health():
    """
    Health check endpoint.
    """
    return health_tool()


@app.get("/dashboard/metrics")
def dashboard_metrics():
    """
    Dashboard metrics endpoint.
    """
    return dashboard_metrics_tool()


@app.get("/dashboard/confusion-matrix")
def dashboard_confusion_matrix():
    """
    Dashboard confusion matrix endpoint.
    """
    return dashboard_confusion_matrix_tool()


@app.get("/dashboard/performance")
def dashboard_performance():
    """
    Dashboard performance endpoint.
    """
    return dashboard_performance_tool()


@app.get("/dashboard/distribution")
def dashboard_distribution():
    """
    Dashboard distribution endpoint.
    """
    return dashboard_distribution_tool()


@app.get("/dashboard/analytics")
def dashboard_analytics():
    """
    Dashboard analytics endpoint.
    """
    return dashboard_analytics_tool()


@app.get("/dashboard/classification-history")
def dashboard_classification_history():
    """
    Dashboard classification history endpoint.
    """
    return dashboard_classification_history_tool()
