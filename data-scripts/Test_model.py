#!/usr/bin/env python3
"""
This script provides functionality to classify medical articles using a pre-trained model.
"""

import pandas as pd
import torch
from typing import List, Dict, Union
import numpy as np
from tqdm import tqdm
from transformers import AutoModelForSequenceClassification, AutoTokenizer

labels = ["neurological", "hepatorenal", "cardiovascular", "oncological"]

def combine_title_abstract(row):
    """
    Combines title and abstract into a single text for classification
    """
    title = str(row.get('title', '')).strip()
    abstract = str(row.get('abstract', '')).strip()

    # Handle NaN or None values
    if title.lower() in ['nan', 'none', '']:
        title = ''
    if abstract.lower() in ['nan', 'none', '']:
        abstract = ''

    # Combine with special separator
    if title and abstract:
        return f"{title} [SEP] {abstract}"
    elif title:
        return title
    elif abstract:
        return abstract
    else:
        return "No content available"

def classify_medical_article_batch(texts: List[str], tokenizer, model, top_k=3, batch_size=32):
    """
    Classifies multiple medical articles in batches for better performance
    """
    all_results = []

    # Process in batches
    for i in tqdm(range(0, len(texts), batch_size), desc="Classifying articles"):
        batch_texts = texts[i:i+batch_size]

        # Tokenize complete batch
        inputs = tokenizer(
            batch_texts,
            max_length=512,
            padding='max_length',
            truncation=True,
            return_tensors="pt"
        )

        # Batch prediction
        with torch.no_grad():
            outputs = model(**inputs)
            predictions = torch.sigmoid(outputs.logits)  # For multi-label

        # Process each prediction in the batch
        batch_probabilities = predictions.cpu().numpy()

        for prob_array in batch_probabilities:
            # Create list of (label, probability) for each article
            results = []
            for j, prob in enumerate(prob_array):
                if hasattr(model, 'config') and hasattr(model.config, 'id2label'):
                    label = model.config.id2label[j]
                else:
                    label = labels[j]
                results.append((label, float(prob)))

            # Sort by probability and take top_k
            results.sort(key=lambda x: x[1], reverse=True)
            all_results.append(results[:top_k])

    return all_results

def classify_csv(csv_file: str, tokenizer, model, top_k=3, batch_size=32, output_file=None):
    """
    Classifies medical articles from a CSV file

    Args:
        csv_file: Path to the CSV file
        top_k: Number of top categories to return
        batch_size: Batch size for processing
        output_file: File to save results (optional)

    Returns:
        DataFrame with classifications
    """
    print(f"Loading data from {csv_file}...")
    df = pd.read_csv(csv_file, sep=';')

    # Verify that required columns exist
    required_columns = ['title', 'abstract']
    missing_columns = [col for col in required_columns if col not in df.columns]

    if missing_columns:
        raise ValueError(f"Missing columns: {missing_columns}. Available columns: {df.columns.tolist()}")

    print(f"Data loaded: {len(df)} articles found")

    # Combine title and abstract
    print("Combining titles and abstracts...")
    combined_texts = df.apply(combine_title_abstract, axis=1).tolist()

    # Classify all texts
    print("Starting classification...")
    classifications = classify_medical_article_batch(combined_texts, top_k, batch_size, tokenizer, model)

    # Create DataFrame with results
    print("Processing results...")
    expanded_results = []

    for idx, classification in enumerate(classifications):
        row_base = {
            'index': idx,
            'title': df.iloc[idx]['title'],
            'abstract': df.iloc[idx]['abstract'],
            'combined_text': combined_texts[idx][:200] + "..." if len(combined_texts[idx]) > 200 else combined_texts[idx]
        }

        # Add top_k classifications
        for rank, (label, prob) in enumerate(classification, 1):
            row_base[f'top_{rank}_category'] = label
            row_base[f'top_{rank}_probability'] = prob

        expanded_results.append(row_base)

    df_results = pd.DataFrame(expanded_results)

    # Save if output file is specified
    if output_file:
        df_results.to_csv(output_file, index=False)
        print(f"Results saved in: {output_file}")

    return df_results

def show_results(df_results):
    """
    Shows classification results in a readable format
    """
    print("\n=== CLASSIFICATION RESULTS ===")
    print(f"Total articles processed: {len(df_results)}")
    
    # Show first rows
    print("\nFirst 5 classifications:")
    for idx, row in df_results.head().iterrows():
        print(f"\nArticle {idx + 1}:")
        print(f"Title: {row['title'][:100]}...")
        print("Top 3 categories:")
        for i in range(1, 4):
            category = row.get(f'top_{i}_category', 'N/A')
            probability = row.get(f'top_{i}_probability', 0)
            print(f"  {i}. {category}: {probability:.4f}")

def main():
    """
    Main function to execute classification
    """
    # Configuration
    csv_file = 'data/raw/test.csv'  # Change to the correct path of your file
    top_k = 3
    batch_size = 32
    output_file = 'data/processed/classification_results.csv'

    try:
        # Initialize model (make sure labels is defined)
        print("Initializing model...")
        # Initialize model
        model = AutoModelForSequenceClassification.from_pretrained("Hiver77/MDT", 
                                                                    trust_remote_code=True,
                                                                    num_labels=len(labels)
                                                                )
        # Initialize tokenizer (you may need to adjust the model name)
        tokenizer = AutoTokenizer.from_pretrained("Hiver77/MDT")
        
        print("Model and tokenizer initialized successfully!")
        
        
        # Execute classification
        print("Starting classification process...")
        df_results = classify_csv(
            csv_file=csv_file,
            tokenizer=tokenizer,
            model=model,
            top_k=top_k,
            batch_size=batch_size,
            output_file=output_file
        )
        
        # Show results
        show_results(df_results)
        
        print(f"\nProcess completed successfully!")
        print(f"Results saved in: {output_file}")
        
    except Exception as e:
        print(f"Error during execution: {str(e)}")
        raise

if __name__ == "__main__":
    main()
