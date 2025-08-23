#!/bin/bash
# curl_tests.sh
# 2025-08-23 | CR

echo "Testing predict endpoint..."

echo ""
echo "Body (JSON):"
echo ""

curl -X POST \
  -H "Content-Type: application/json" \
  -d '{
    "title": "A randomized trial of beta-blockers in heart failure",
    "abstract": "This study evaluates the efficacy of beta-blockers..."
  }' \
  http://localhost:8000/predict

echo ""
echo "Example via Nginx proxy:"
echo ""

curl -X POST \
  -H "Content-Type: application/json" \
  -d '{
    "title": "A randomized trial of beta-blockers in heart failure",
    "abstract": "This study evaluates the efficacy of beta-blockers..."
  }' \
  http://localhost:3000/api/predict


echo ""
echo "Metrics:"
echo ""

curl http://localhost:8000/training_metrics

echo ""
echo "Done!"
echo ""


