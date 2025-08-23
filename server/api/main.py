import json
from fastapi import FastAPI, HTTPException, Body
# from fastapi import UploadFile, File, Form
from pydantic import BaseModel

# from .ai_models import AIModels
from .ml_models import MLModels


# Define the request model
class Article(BaseModel):
    title: str
    abstract: str


# Define the prediction response model
class Prediction(BaseModel):
    label: str
    score: float

# Define the metrics response model


class TrainingMetric(BaseModel):
    epoch: int
    training_loss: float
    validation_loss: float
    accuracy: float
    f1_micro: float
    f1_macro: float
    roc_auc_macro: float


class TrainingSummary(BaseModel):
    best_epoch: int
    best_accuracy: float
    best_f1_macro: float
    best_roc_auc_macro: float
    final_training_loss: float
    final_validation_loss: float


class TrainingOutput(BaseModel):
    global_step: int
    training_loss: float
    metrics: dict


class Metrics(BaseModel):
    training_metrics: list[TrainingMetric]
    summary: TrainingSummary
    training_output: TrainingOutput


# Initialize the FastAPI application
app = FastAPI(title="Biomedical Article Classifier API")

ml_model = MLModels()
ml_model.load_model()


# @app.get("/training_metrics", response_model=Metrics)
@app.get("/training_metrics")
def training_metrics():
    """
    Get the training metrics for the model.
    """
    metrics = json.load(open("./data/model_training_data.json"))
    return metrics


@app.post("/predict", response_model=list[Prediction])
def predict(
    # JSON body (optional)
    article: Article | None = Body(default=None),
    # # Multipart form-data (optional)
    # file: UploadFile | None = File(default=None),
    # title: str | None = Form(default=None),
    # abstract: str | None = Form(default=None),
):
    """
    Predict categories for a biomedical article.

    Accepts either:
    - JSON body with `title` and `abstract` (backwards compatible), or
    - multipart/form-data with optional `file` (.txt) and/or `title`,
    `abstract` fields.

    If a file is provided, it should be a plain text file.
    If `title`/`abstract` are not provided alongside the file, the first
    line will be treated as the title and the remaining lines as the abstract.
    """

    # if classifier is None:
    if ml_model.model is None:
        raise HTTPException(status_code=500, detail="Model not loaded")

    # Resolve title and abstract from inputs
    resolved_title = None
    resolved_abstract = None

    # Prefer explicit form fields when present
    # if title:
    #     resolved_title = title.strip()
    # if abstract:
    #     resolved_abstract = abstract.strip()

    print("Article: ", article)
    # print(f"Resolved title: {resolved_title}")
    # print(f"Resolved abstract: {resolved_abstract}")

    # If still missing, try to read from uploaded file
    # (supports .txt/plain text)
    content = None
    # if file is not None and (resolved_title is None or
    #                          resolved_abstract is None):
    #     try:
    #         raw_bytes = file.file.read()
    #         content = raw_bytes.decode("utf-8", errors="ignore").strip()
    #     finally:
    #         try:
    #             file.file.close()
    #         except Exception:
    #             pass

    if content:
        lines = content.splitlines()
        if resolved_title is None:
            resolved_title = lines[0].strip() if lines else ""
        if resolved_abstract is None:
            resolved_abstract = "\n".join(lines[1:]).strip() \
                if len(lines) > 1 else ""

    # Finally, fallback to JSON body if still missing
    if (resolved_title is None or resolved_abstract is None) \
       and article is not None:
        if resolved_title is None:
            resolved_title = article.title.strip()
        if resolved_abstract is None:
            resolved_abstract = article.abstract.strip()

    print("Resolved title # 2: ", resolved_title)
    print("Resolved abstract # 2: ", resolved_abstract)

    # Validate we have the necessary text
    if not resolved_title and not resolved_abstract:
        raise HTTPException(
            status_code=400,
            detail="No input provided. Send JSON with title/abstract or"
                   " upload a text file via multipart/form-data.",
        )

    text = (resolved_title or "") + " " + (resolved_abstract or "")

    # Perform prediction
    # predictions = model.predict_proba([text]) # For the baseline model
    # predictions = classifier(text)  # For the transformers model
    predictions = ml_model.predict_infer(text)

    # Format response
    # response = # For the baseline model
    # response = [{"label": pred["label"], "score": pred["score"]}
    #             for pred in predictions]

    response = predictions["predicted_labels"]

    return response


# @app.post("/llm/infer")
# def llm_infer(req: InferRequest):
#     """
#     Provider-agnostic LLM inference using AIModels.
#     - req.params must include at least: provider ("openai"|"ai_ml_api"),
#       model
#     - Supports either req.prompt or req.messages (OpenAI chat format)
#     """
#     try:
#         llm = AIModels(req.params)

#         msgs: Optional[List[Dict[str, str]]] = None
#         if req.messages is not None:
#             msgs = [{"role": m.role, "content": m.content} for m in
#                     req.messages]

#         result = llm.infer(
#             prompt=req.prompt,
#             messages=msgs,
#             system=req.system,
#             tools=req.tools,
#             tool_choice=req.tool_choice,
#             extra=req.extra,
#         )
#         return result
#     except ValueError as ve:
#         raise HTTPException(status_code=400, detail=str(ve))
#     except RuntimeError as re:
#         # Downstream LLM/provider error
#         raise HTTPException(status_code=502, detail=str(re))
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=f"Unexpected error: {e}")


@app.get("/")
def read_root():
    return {"message": "Welcome to the Biomedical Classifier API"}
