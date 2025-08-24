import os

from .json_models import get_all_training_metrics


class DynamicDashboardMetrics:
    def __init__(self):
        self.debug = os.environ.get("SERVER_DEBUG", "0") == "1"
        self.metrics = get_all_training_metrics()

    def get_dashboard_analytics(self):
        """
        Get the dashboard analytics.
        """
        result = {
            "daily_classifications": [],
            "accuracy_trend": [],
            "categories_trend": {
                "cardiovascular": [],
                "neurological": [],
                "hepatorenal": [],
                "oncological": [],
            },
            "processing_speed_trend": [],
            "error_rate_trend": [],
        }
        return result

    def get_dashboard_classification_history(self):
        """
        Get the dashboard classification history.
        """
        result = []
        for item in self.metrics["classification_history"]:
            result.append({
                "id": item["id"],
                "title": item["title"],
                "abstract": item["abstract"],
                "category": item["category"],
                "confidence": item["confidence"],
                "date": item["date"],
                "processing_time": item["processing_time"],
                "status": item["status"],
            })
        return result
