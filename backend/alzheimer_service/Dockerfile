FROM python:3.9-slim

WORKDIR /app

# Copy requirements first for better caching
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy server code and model files
COPY enhanced_alzheimer_server.py .
COPY alz_model/ ./alz_model/

# Make port 5000 available
EXPOSE 5000

# Run the server
CMD ["python", "enhanced_alzheimer_server.py"]
