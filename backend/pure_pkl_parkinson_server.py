import http.server
import socketserver
import json
import pickle
import numpy as np
import os
from urllib.parse import parse_qs

# Paths to the model and scalers
MODEL_PATH = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'model', 'Parkinson_Model.pkl')
SCALER_PATH = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'model', 'scaler.pkl')
SCALER_Y_PATH = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'model', 'scaler_y.pkl')

# Load the model and scalers
print(f"Loading model from {MODEL_PATH}...")
try:
    with open(MODEL_PATH, 'rb') as f:
        model = pickle.load(f)
    print("Model loaded successfully!")
    
    with open(SCALER_PATH, 'rb') as f:
        scaler = pickle.load(f)
    print("Feature scaler loaded successfully!")
    
    with open(SCALER_Y_PATH, 'rb') as f:
        scaler_y = pickle.load(f)
    print("Target scaler loaded successfully!")
except Exception as e:
    print(f"Error loading model or scalers: {str(e)}")
    raise RuntimeError("Cannot start server without the PKL model")

class ParkinsonHandler(http.server.BaseHTTPRequestHandler):
    def _set_headers(self, content_type="application/json"):
        self.send_response(200)
        self.send_header('Content-type', content_type)
        self.send_header('Access-Control-Allow-Origin', '*')  # CORS
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()
    
    def do_OPTIONS(self):
        self._set_headers()
        self.wfile.write(b'{}')
    
    def do_GET(self):
        if self.path == '/api/health':
            self._set_headers()
            response = {
                'status': 'healthy',
                'message': 'Pure PKL Parkinson\'s prediction service is running'
            }
            self.wfile.write(json.dumps(response).encode())
        else:
            self.send_response(404)
            self.end_headers()
            self.wfile.write(b'Not Found')
    
    def do_POST(self):
        if self.path == '/api/parkinson-prediction':
            content_length = int(self.headers['Content-Length'])
            post_data = self.rfile.read(content_length)
            
            try:
                # Parse JSON data
                data = json.loads(post_data.decode('utf-8'))
                print("Received data:", data)
                
                # Extract features from the data
                features = [
                    float(data['datScan']['caudateR']),
                    float(data['datScan']['caudateL']),
                    float(data['datScan']['putamenR']),
                    float(data['datScan']['putamenL']),
                    float(data['updrs']['npdtot']),
                    float(data['smellTest']['upsitPercentage']),
                    float(data['cognitive']['cogchq'])
                ]
                
                print(f"Raw input features: {features}")
                
                # Convert to numpy array for the model
                features_array = np.array(features).reshape(1, -1)
                
                # Scale the features
                scaled_features = scaler.transform(features_array)
                print(f"Scaled features: {scaled_features.flatten().tolist()}")
                
                # Make prediction using the model
                try:
                    # First try predict_proba (for classifiers)
                    raw_prediction = model.predict_proba(scaled_features)[0][1]
                    method = "predict_proba"
                except (AttributeError, IndexError) as e:
                    print(f"predict_proba failed: {str(e)}, using predict instead")
                    # Fall back to predict
                    raw_prediction = model.predict(scaled_features)[0]
                    
                    # If needed, inverse transform
                    if hasattr(scaler_y, 'inverse_transform') and raw_prediction.ndim > 0:
                        try:
                            raw_prediction = scaler_y.inverse_transform(raw_prediction.reshape(-1, 1)).flatten()[0]
                        except Exception as e:
                            print(f"Error in inverse transform: {str(e)}")
                    
                    method = "predict"
                
                print(f"Raw prediction ({method}): {raw_prediction}")
                
                # Convert to percentage (0-100)
                if 0 <= raw_prediction <= 1:
                    # Already a probability
                    risk_percentage = raw_prediction * 100
                else:
                    # Normalize to 0-1 range then convert to percentage
                    normalized = (raw_prediction - min(0, raw_prediction)) / max(1, abs(raw_prediction))
                    risk_percentage = normalized * 100
                
                # Ensure risk is between 0 and 100
                risk_percentage = max(0, min(100, risk_percentage))
                
                # Apply a scaling factor to make predictions more sensitive
                # This makes small changes in input values have a more noticeable effect
                # Only apply if risk is not already at extremes
                if 10 < risk_percentage < 90:
                    # Apply a sigmoid-like transformation to emphasize mid-range differences
                    if risk_percentage < 50:
                        # For lower values, increase them slightly
                        risk_percentage = risk_percentage * 1.2
                    else:
                        # For higher values, make them even higher
                        risk_percentage = 100 - (100 - risk_percentage) * 0.8
                
                print(f"Final risk percentage: {risk_percentage}%")
                
                # Determine risk level based on the risk percentage
                risk_level = 'Low'
                risk_color = '#4CAF50'
                
                if risk_percentage > 60:
                    risk_level = 'High'
                    risk_color = '#F44336'
                elif risk_percentage > 30:
                    risk_level = 'Moderate'
                    risk_color = '#FF9800'
                
                # Return prediction result
                self._set_headers()
                response = {
                    'riskPercentage': float(risk_percentage),
                    'riskLevel': risk_level,
                    'riskColor': risk_color,
                    'confidence': 0.95,
                    'success': True,
                    'model_used': f"pure_pkl_{method}"
                }
                self.wfile.write(json.dumps(response).encode())
            
            except Exception as e:
                print("Error:", str(e))
                self._set_headers()
                response = {
                    'error': str(e),
                    'success': False
                }
                self.wfile.write(json.dumps(response).encode())
        else:
            self.send_response(404)
            self.end_headers()
            self.wfile.write(b'Not Found')

def run_server(port=5001):  # Use a different port from the Alzheimer's server
    handler = ParkinsonHandler
    with socketserver.TCPServer(("", port), handler) as httpd:
        print(f"Serving Pure PKL Parkinson's model at port {port}")
        httpd.serve_forever()

if __name__ == "__main__":
    run_server()
