from .dashboard_metrics import BaseDashboardMetrics


class DashboardMetricsFromDb(BaseDashboardMetrics):
    def __init__(self):
        super().__init__()

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
        return [
            {
                "id": item["id"],
                "title": item["title"],
                "abstract": item["abstract"],
                "category": item["category"],
                "confidence": item["confidence"],
                "date": item["date"],
                "processing_time": item["processing_time"],
                "status": item["status"],
            }
            for item in self.metrics["classification_history"]
        ]
