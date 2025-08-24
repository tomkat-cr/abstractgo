import json
import os


def get_all_training_metrics() -> dict:
    """
    Get the training metrics for the model.
    """
    dir_path = os.path.dirname(os.path.realpath(__file__))
    file_path = os.path.join(dir_path, "..", "data", "model_training_data.json")
    if not os.path.exists(file_path):
        raise FileNotFoundError(f"File not found: {file_path}")
    with open(file_path) as f:
        return json.load(f)
