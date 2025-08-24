from .json_models import get_all_training_metrics


class DashboardMetrics:
    def __init__(self):
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
        return {label: value for label, value in zip(self.cm.keys(), [
            2 * self.cm[category][0][0] / (2 * self.cm[category][0][0] +
                self.cm[category][0][1] + self.cm[category][1][0] +
                self.cm[category][1][1])
            for category in self.cm.keys()])}

    def get_accuracy(self):
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
        return self.metrics["training_output"]["metrics"]["train_runtime"]

    def get_data_range(self):
        return self.metrics["training_output"]["metrics"]["train_runtime"]

    def get_summary(self):
        return self.metrics["summary"]

    def get_training_output(self):
        return self.metrics["training_output"]

    def get_total_predictions(self):
        total_predictions = 0
        for category in self.cm.keys():
            total_predictions += self.cm[category][0][0] + self.cm[category][0][1] + \
                self.cm[category][1][0] + self.cm[category][1][1]
        return total_predictions

    def get_accuracy_per_category(self):
        return {label: value for label, value in zip(self.cm.keys(), [
            (self.cm[category][0][0] + self.cm[category][1][1])
            / self.get_total_predictions()
            for category in self.cm.keys()])}

    # ----- Functions for the API endpoints -----

    def get_dashboard_metrics(self):
        """
        Get the dashboard metrics.
        """
        result = {
            "f1_score": self.get_f1_score(),
            "accuracy": self.get_accuracy(), 
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
            "categories": self.cm.keys(),
            "total_predictions": self.get_total_predictions(),
            "accuracy_per_category": self.get_accuracy_per_category(),
        }
        return result

    def get_dashboard_performance(self):
        """
        Get the dashboard performance.
        """
        result = []
        for category in self.cm.keys():
            result.append({
                "category": category,
                "accuracy": self.get_accuracy_per_category()[category],
                "f1_score": self.get_f1_score()[category],
                "precision": self.get_precision()[category],
                "recall": self.get_recall()[category],
                "total_predictions": self.get_total_predictions(),
                "correct_predictions": self.cm[category][0][0],
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
        return {"status": "ok"}

    def get_dashboard_classification_history(self):
        """
        Get the dashboard classification history.
        """
        return {"status": "ok"}
