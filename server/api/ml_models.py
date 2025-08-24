import os

from transformers import AutoModelForSequenceClassification, AutoTokenizer
import torch

from .utilities import get_non_empty_value


class MLModels:
    def __init__(self):
        self.tokenizer = None
        self.model = None
        self.labels = ["neurological", "hepatorenal", "cardiovascular",
                       "oncological"]
        self.debug = os.environ.get("SERVER_DEBUG", "0") == "1"
        self.params = {
            "BASE_MODEL_NAME": get_non_empty_value("BASE_MODEL_NAME",
                                                   "dmis-lab/biobert-v1.1"),
            "CLOUD_MODEL_NAME": get_non_empty_value("CLOUD_MODEL_NAME",
                                                    "Hiver77/MDT"),
            "USE_LOCAL_MODEL": get_non_empty_value(
                "USE_LOCAL_MODEL", "0") == "1",
            "LOCAL_MODEL_PATH": get_non_empty_value("LOCAL_MODEL_PATH",
                                                    "/code/saved_models"),
            "LOCAL_MODEL_TOKENIZER_PATH": get_non_empty_value(
                "LOCAL_MODEL_TOKENIZER_PATH",
                "/code/saved_models")
        }

        if self.debug:
            print(f"MLModels: {self.params}")

        # Load the model
        self.load_model()

    def load_model(self):
        if self.params["USE_LOCAL_MODEL"]:
            # Load model from local path
            try:
                self.tokenizer = AutoTokenizer.from_pretrained(
                    self.params["BASE_MODEL_NAME"])
                self.model = \
                    AutoModelForSequenceClassification.from_pretrained(
                        self.params["LOCAL_MODEL_PATH"],
                        num_labels=len(self.labels))
                print("Local model loaded successfully")
            except Exception as e:
                print(f"Error loading the local model: {e}")
        else:
            # Load model directly from Hugging Face
            try:
                self.tokenizer = AutoTokenizer.from_pretrained(
                    self.params["BASE_MODEL_NAME"])
                self.model = \
                    AutoModelForSequenceClassification.from_pretrained(
                        self.params["CLOUD_MODEL_NAME"],
                        num_labels=len(self.labels))
                print("HF model loaded successfully")
            except Exception as e:
                print(f"Error loading the HF model: {e}")

    def predict_infer(self, text):

        print('>> predict_infer | Text:', text)

        # Tokenize the input text
        inputs = self.tokenizer(text, return_tensors="pt")
        print('>> predict_infer | Inputs:', inputs)

        # Get model predictions
        with torch.no_grad():
            outputs = self.model(**inputs)
        print('>> predict_infer | Outputs:', outputs)

        # Apply softmax to get probabilities
        predictions = torch.softmax(outputs.logits, dim=-1)
        print('>> predict_infer | Predictions:', predictions)

        # Get the predicted class
        predicted_class = torch.argmax(predictions, dim=-1)
        print('>> predict_infer | Predicted class:', predicted_class)

        # Get the predicted label
        predicted_label = self.labels[predicted_class.item()]
        print('>> predict_infer | Predicted label (the best):',
              predicted_label)

        # Get all predicted labels
        predicted_labels = []
        predictions_list = predictions.tolist()[0]
        for i in range(len(predictions_list)):
            predicted_labels.append({
                "label": self.labels[i],
                "score": predictions_list[i]
            })

        print('>> predict_infer | Predicted labels (all):', predicted_labels)

        response = {
            "predicted_label": predicted_label,
            "predicted_labels": predicted_labels,
            "predictions": predictions_list
        }

        return response
