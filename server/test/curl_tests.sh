#!/bin/bash
# curl_tests.sh
# 2025-08-23 | CR

if [ -z "${JQ}" ]; then
  JQ="1"
fi

perform_curl() {
  if [ "${JQ}" -eq "1" ]; then
    curl "$@" | jq .
  else
    curl "$@"
  fi
}

echo "Testing predict endpoint..."

echo ""
echo "Root:"
echo ""

perform_curl http://localhost:8000/

echo ""
echo ""
echo "Training Metrics:"
echo ""

perform_curl http://localhost:8000/training_metrics

echo ""
echo ""
echo "Body (JSON):"
echo ""

perform_curl -X POST \
  -H "Content-Type: application/json" \
  -d '{
    "title": "A randomized trial of beta-blockers in heart failure",
    "abstract": "This study evaluates the efficacy of beta-blockers..."
  }' \
  http://localhost:8000/predict

echo ""
echo ""
echo "Example via Nginx proxy:"
echo ""

perform_curl -X POST \
  -H "Content-Type: application/json" \
  -d '{
    "title": "A randomized trial of beta-blockers in heart failure",
    "abstract": "This study evaluates the efficacy of beta-blockers..."
  }' \
  http://localhost:3000/api/predict

echo ""
echo ""
echo "PDF Read:"
echo ""

perform_curl -X POST \
  -H "Content-Type: multipart/form-data" \
  -F "file=@./test/assets/reflection-paper-regulatory-requirements-development-medicinal-products-primary-biliary-cholangitis-pbc-primary-sclerosing-cholangitis-psc_en.pdf" \
  http://localhost:8000/pdfread

echo ""
echo ""
echo "Done!"
echo ""

echo ""
echo ""
echo "Done!"
echo ""
