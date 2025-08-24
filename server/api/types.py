from pydantic import BaseModel


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
    training_loss: float | None
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
