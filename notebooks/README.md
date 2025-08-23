# Medical Article Classification Project

This project provides a machine learning solution for classifying medical articles into different categories using transformer-based models. The system consists of two main components: a training module and a testing module.

## 📖 Usage

### Training Model

The training process involves preparing and training a transformer model on medical article data.

#### Step 1: Prepare Training Data

Ensure your training data is in the correct format:
- CSV file with columns: `title`, `abstract`, `label`
- Labels should be one of: `neurological`, `hepatorenal`, `cardiovascular`, `oncological`

- preprocessing: Basic dataset cleaning was performed, including removing special characters and converting everything to lowercase.

#### Step 2: Run Training

the model was trained by distilling a larger model called BioBert. For this case, techniques were used that allowed us to avoid the following:

Overfitting
Catastrophic Forgetting
For this, the model was adjusted with fine-tuning techniques such as (PEFT), and in particular LoRA (Low-Rank Adaptation), since LoRA works by freezing all the weights of the pre-trained model and adding small "adapter" matrices of low rank in certain layers (usually the attention layers). Only the parameters of these adapter matrices are trained, which are a tiny fraction of the total (often <1%).

Parameters used:
r=16, # Rank of adaptation matrices
lora_alpha=32, # Scaling factor
lora_dropout=0.1,
bias="none",
task_type=TaskType.SEQ_CLS # Specify task type

This configuration (r=16, alpha=32, dropout=0.1) allowed finding a sufficient point to leverage BioBert's complex medical pattern capabilities and regularization that prevents overfitting on small datasets.
Result: 90% accuracy and ROC-AUC of 0.923 using only 0.3% extra parameters.

The model was trained for 10 epochs.

#### Step 3: Metrics Training

Since this challenge focuses on multi-label classification (multiple labels per text), the following metrics were implemented:

Accuracy: To calculate the percentage of correct labels
F1-Micro: Global average, gives more weight to frequent classes
F1-Macro: Average per class, treats all equally
ROC-AUC Macro: Measures how well it separates positives from negatives per class

Since in the medical environment a balance with F1-macro is needed, it ensures not to ignore rare diseases, while AUC tells you how reliable the model is at discriminating.

### Testing Model

the model was trained with some separately created data, obtaining output similar to this:

--- Article 5 ---
Title: guillain-barre syndrome pathways in leukemia
Abstract: Hypothesis: statins improves stroke outcomes via migraine pathways. Methods: cross-sectional trial with 285 adult population, measuring astrocytoma an...
Classifications:
  1. neurological: 0.9393 (78.9%)
  2. oncological: 0.1215 (12.2%)
  3. hepatorenal: 0.1122 (11.2%)
