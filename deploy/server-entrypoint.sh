#!/bin/bash
# server-entrypoint.sh
# 2025-08-22 | CR

cd /code/api
pip install --upgrade pip
pip install --no-cache-dir --upgrade -r /code/requirements.txt

cd /code
uvicorn api.main:app --host 0.0.0.0 --port 8000 --reload --reload-dir /code --env-file /code/.env
