@echo off
echo Installing required Python packages...
pip install -r requirements.txt
echo Starting Alzheimer's prediction server...
python app.py
