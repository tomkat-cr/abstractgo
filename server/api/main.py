from fastapi import FastAPI
from pydantic import BaseModel

# import joblib   # O from transformers import pipeline
# import numpy as np

# Cargar el modelo en el arranque de la aplicación
# NOTA: Adaptar la carga según el modelo final (joblib o transformers)
# model = joblib.load("saved_models/baseline_model.joblib")
from transformers import pipeline


# Iniciar la aplicación FastAPI
app = FastAPI(title="Biomedical Article Classifier API")

classifier = pipeline("text-classification",
                      model="saved_models/biobert-lora/",
                      tokenizer="dmis-lab/biobert-v1.1",
                      return_all_scores=True)


# Definir el modelo de datos para la solicitud (request)
class Article(BaseModel):
    title: str
    abstract: str


# Definir el modelo de datos para la respuesta (response)
class Prediction(BaseModel):
    label: str
    score: float


@app.post("/predict", response_model=list[Prediction])
def predict(article: Article):
    """
    Recibe un título y un abstract y devuelve las predicciones de categoría.
    """
    text = article.title + " " + article.abstract

    # Realizar la predicción
    # predictions = model.predict_proba([text]) # Para el modelo base
    predictions = classifier(text)  # Para el modelo transformers

    # Formatear la respuesta
    # response = # Para el modelo base
    response = [{"label": pred['label'], "score": pred['score']}
                for pred in predictions]  # Para el modelo transformers

    return response


@app.get("/")
def read_root():
    return {"message": "Welcome to the Biomedical Classifier API"}
