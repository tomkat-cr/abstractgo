# Dockerfile for AbstractGo API build
# 2025-08-22 | CR

# Use an official Python runtime as a parent image
FROM python:3.12-slim

# Set the working directory in the container
WORKDIR /code

# Copy the application files and model
COPY server/api /code/api
COPY saved_models /code/saved_models

# Copy the requirements file and install dependencies
COPY server/requirements.txt /code/requirements.txt
RUN cd /code/api && pip install --no-cache-dir --upgrade -r /code/requirements.txt

# Expose the port on which the application will run
EXPOSE 8000

# Command to run the application using uvicorn
CMD ["uvicorn", "api.main:app", "--host", "0.0.0.0", "--port", "8000"]
