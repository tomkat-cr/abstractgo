from fastapi import FastAPI, HTTPException
from pydantic import BaseModel

# import joblib   # O from transformers import pipeline
# import numpy as np

# Load model at startup
# NOTE: Adapt the loading according to the final model (joblib or transformers)
# model = joblib.load("saved_models/baseline_model.joblib")
from transformers import pipeline


# Initialize the FastAPI application
app = FastAPI(title="Biomedical Article Classifier API")

try:
    classifier = pipeline("text-classification",
                          model="saved_models/biobert-lora/",
                          tokenizer="dmis-lab/biobert-v1.1",
                          return_all_scores=True)
except Exception as e:
    print(f"Error loading the model: {e}")


# Define the request model
class Article(BaseModel):
    title: str
    abstract: str


# Define the response model
class Prediction(BaseModel):
    label: str
    score: float


@app.post("/predict", response_model=list[Prediction])
def predict(article: Article):
    """
    Receives a title and an abstract and returns the category predictions.
    """
    text = article.title + " " + article.abstract

    if classifier is None:
        raise HTTPException(status_code=500, detail="Model not loaded")

    # Perform prediction
    # predictions = model.predict_proba([text]) # For the baseline model
    predictions = classifier(text)  # For the transformers model

    # Format response
    # response = # For the baseline model
    response = [{"label": pred['label'], "score": pred['score']}
                for pred in predictions]  # For the transformers model

    return response


@app.get("/")
def read_root():
    return {"message": "Welcome to the Biomedical Classifier API"}
