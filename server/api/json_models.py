import json


def get_all_training_metrics() -> dict:
    """
    Get the training metrics for the model.
    """
    metrics = json.load(open("./data/model_training_data.json"))
    return metrics
