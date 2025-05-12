FROM python:3.9-slim

WORKDIR /app

# Copy requirements first for better caching
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy server code and model files
COPY . .

# Make port 5001 available
EXPOSE 5001

# Run the server
CMD ["python", "fixed_pure_parkinson_server.py"]
