# backend/Dockerfile

# Use official Python image as base
FROM python:3.8-slim

# Set working directory
WORKDIR /backend

# Copy the requirements file and install dependencies
COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the Django application code
COPY . /backend

# Expose port 8001 for Django
EXPOSE 8001

# Define environment variable
ENV DJANGO_SETTINGS_MODULE=LumaLab.settings

RUN chmod +x /backend/entrypoint.sh

ENTRYPOINT ["/backend/entrypoint.sh"]
