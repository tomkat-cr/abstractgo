import os

from .json_models import get_all_training_metrics


class StaticDashboardMetrics:
    def __init__(self):
        self.debug = os.environ.get("SERVER_DEBUG", "0") == "1"
        self.metrics = get_all_training_metrics()
        self.cm = self.metrics["confusion_matrix"]

    def get_metrics(self):
        return self.metrics

    def get_confusion_matrix(self):
        return self.cm

    def get_precision(self):
        return {label: value for label, value in zip(self.cm.keys(), [
            self.cm[category][0][0] / (self.cm[category][0][0]
                + self.cm[category][0][1])
            for category in self.cm.keys()])}

    def get_recall(self):
        return {label: value for label, value in zip(self.cm.keys(), [
            self.cm[category][0][0] / (self.cm[category][0][0]
                + self.cm[category][1][0])
            for category in self.cm.keys()])}

    def get_f1_score(self):
        results = {}
        for category, matrix in self.cm.items():
            tp = matrix[0][0]
            fp = matrix[0][1]
            fn = matrix[1][0]
            denominator = 2 * tp + fp + fn
            results[category] = (2 * tp) / denominator if denominator > 0 \
                else 0.0
        return results

    def get_accuracy_per_category(self):
        return {label: value for label, value in zip(self.cm.keys(), [
            (self.cm[category][0][0] + self.cm[category][1][1]) / (
                self.cm[category][0][0] + self.cm[category][0][1]
                + self.cm[category][1][0] + self.cm[category][1][1])
            for category in self.cm.keys()])}

    def get_total_articles(self):
        return self.metrics["training_output"]["global_step"]

    def get_processing_speed(self):
        metrics = self.metrics["training_output"]["metrics"]
        return metrics["train_samples_per_second"]

    def get_avg_processing_time(self):
        return self.metrics["training_output"]["metrics"]["train_runtime"]

    def get_last_updated(self):
        return self.metrics["last_updated"]

    def get_data_range(self):
        return self.metrics["data_range"]

    def get_summary(self):
        return self.metrics["summary"]

    def get_training_output(self):
        return self.metrics["training_output"]

    def get_total_predictions(self):
        return sum(
            matrix[0][0] + matrix[0][1] + matrix[1][0] + matrix[1][1]
            for matrix in self.cm.values()
        )

    # ----- Functions for the API endpoints -----

    def get_dashboard_metrics(self):
        """
        Get the dashboard metrics.
        """
        result = {
            "f1_score": self.get_f1_score(),
            "accuracy": self.get_accuracy_per_category(),
            "total_articles": self.get_total_articles(),
            "processing_speed":
                self.get_processing_speed(),
            "precision": self.get_precision(),
            "recall": self.get_recall(),
            "avg_processing_time":
                self.get_avg_processing_time(),
        }
        return result

    def get_dashboard_confusion_matrix(self):
        """
        Get the dashboard confusion matrix.
        """
        result = {
            "matrix": self.cm,
            "categories": list(self.cm.keys()),
            "total_predictions": self.get_total_predictions(),
            "accuracy_per_category": self.get_accuracy_per_category(),
        }
        if self.debug:
            print(">> get_dashboard_confusion_matrix | result:", result)
        return result

    def get_dashboard_performance(self):
        """
        Get the dashboard performance.
        """
        result = []
        total_predictions_all_cats = self.get_total_predictions()

        for category, matrix in self.cm.items():
            tp = matrix[0][0]
            fp = matrix[0][1]
            fn = matrix[1][0]
            tn = matrix[1][1]

            precision_denom = tp + fp
            recall_denom = tp + fn
            f1_denom = 2 * tp + fp + fn
            accuracy_denom = tp + fp + fn + tn

            result.append({
                "category": category,
                "accuracy": (tp + tn) / accuracy_denom if accuracy_denom > 0
                else 0,
                "f1_score": (2 * tp) / f1_denom if f1_denom > 0 else 0,
                "precision": tp / precision_denom if precision_denom > 0
                else 0,
                "recall": tp / recall_denom if recall_denom > 0 else 0,
                "total_predictions": total_predictions_all_cats,
                "correct_predictions": tp,
            })
        return result

    def get_dashboard_distribution(self):
        """
        Get the dashboard distribution.
        """
        result = []
        for category in self.cm.keys():
            result.append({
                "category": category,
                "count": (self.cm[category][0][0] + self.cm[category][0][1] +
                          self.cm[category][1][0] + self.cm[category][1][1]),
                "percentage": (
                    self.cm[category][0][0] + self.cm[category][0][1] +
                    self.cm[category][1][0] + self.cm[category][1][1]
                ) / self.get_total_predictions() * 100,
                "trend": 0,
            })
        return result

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
