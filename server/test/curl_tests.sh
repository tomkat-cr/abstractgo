#!/bin/bash
# curl_tests.sh
# 2025-08-23 | CR

TITLE="A randomized trial of beta-blockers in heart failure"
ABSTRACT="This study evaluates the efficacy of beta-blockers..."
PDF_FILE="./test/assets/reflection-paper-regulatory-requirements-development-medicinal-products-primary-biliary-cholangitis-pbc-primary-sclerosing-cholangitis-psc_en.pdf"

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

echo "Testing AbstractGo API endpoints..."

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
echo "Now testing the Predict (directly to API 8000):"
echo "Title: ${TITLE}"
echo "Abstract: ${ABSTRACT}"
echo ""

perform_curl -X POST \
  -H "Content-Type: application/json" \
  -d "{
    \"title\": \"${TITLE}\",
    \"abstract\": \"${ABSTRACT}\"
  }" \
  http://localhost:8000/predict

echo ""
echo ""
echo "Now testing the Predict (via Nginx proxy 3000):"
echo "Title: ${TITLE}"
echo "Abstract: ${ABSTRACT}"
echo ""

perform_curl -X POST \
  -H "Content-Type: application/json" \
  -d "{
    \"title\": \"${TITLE}\",
    \"abstract\": \"${ABSTRACT}\"
  }" \
  http://localhost:3000/api/predict

echo ""
echo ""
echo "Now testing the PDF Read:"
echo "File: ${PDF_FILE}"
echo ""

perform_curl -X POST \
  -H "Content-Type: multipart/form-data" \
  -F "file=@${PDF_FILE}" \
  http://localhost:8000/pdfread

echo ""
echo ""
echo "The expected result should be:"
echo "Title: 'Reflection paper on regulatory requirements for the development of medicinal products for primary biliary cholangitis (PBC) and primary sclerosing cholangitis (PSC)'"
echo "Abstract: 'This reflection paper outlines the European regulatory position on the clinical development of medicinal products for primary biliary cholangitis (PBC) and primary sclerosing cholangitis (PSC), covering scope, legal basis, study design, endpoints, intercurrent events, real-world evidence, pediatric considerations, and safety, with emphasis on disease-modifying approaches and symptomatic treatment of cholestatic pruritus.'"

echo ""
echo "Now testing the Dashboard Metrics:"
echo ""

perform_curl http://localhost:8000/dashboard/metrics

echo ""
echo ""
echo "Now testing the Dashboard Confusion Matrix:"
echo ""

perform_curl http://localhost:8000/dashboard/confusion-matrix

echo ""
echo ""
echo "Now testing the Dashboard Performance:"
echo ""

perform_curl http://localhost:8000/dashboard/performance

echo ""
echo ""
echo "Now testing the Dashboard Distribution:"
echo ""

perform_curl http://localhost:8000/dashboard/distribution

echo ""
echo ""
echo "Now testing the Dashboard Analytics:"
echo ""

perform_curl http://localhost:8000/dashboard/analytics

echo ""
echo ""
echo "Now testing the Dashboard Classification History:"
echo ""

perform_curl http://localhost:8000/dashboard/classification-history

echo ""
echo ""
echo "Done!"
echo ""
