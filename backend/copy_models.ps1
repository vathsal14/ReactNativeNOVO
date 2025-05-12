# PowerShell script to copy model files to the backend directory
# Create model directories if they don't exist
New-Item -ItemType Directory -Force -Path ".\model"
New-Item -ItemType Directory -Force -Path ".\alz_model"

# Copy Parkinson's model files
Copy-Item -Path "..\model\Parkinson_Model.pkl" -Destination ".\model\" -Force
Copy-Item -Path "..\model\scaler.pkl" -Destination ".\model\" -Force
Copy-Item -Path "..\model\scaler_y.pkl" -Destination ".\model\" -Force

# Copy Alzheimer's model files
Copy-Item -Path "..\alz_model\model.pkl" -Destination ".\alz_model\" -Force

Write-Host "Model files copied successfully!"
