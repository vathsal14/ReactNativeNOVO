import http.server
import socketserver
import json
import pickle
import numpy as np
import os
from urllib.parse import parse_qs

# Path to the actual PKL model
MODEL_PATH = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'alz_model', 'model.pkl')

# Load the actual PKL model
print(f"Loading model from {MODEL_PATH}...")
try:
    with open(MODEL_PATH, 'rb') as f:
        model = pickle.load(f)
    print("Model loaded successfully!")
    USE_REAL_MODEL = True
except Exception as e:
    print(f"Error loading model: {str(e)}")
    USE_REAL_MODEL = False
    print("Will use fallback model instead.")

# Fallback prediction function in case the model fails to load
def fallback_predict_risk(features):
    print("Using fallback model for prediction")
    # Extract individual features
    hippocampus_volume = features[0]
    cortical_thickness = features[1]
    ventricle_volume = features[2]
    white_matter_hyperintensities = features[3]
    brain_glucose_metabolism = features[4]
    amyloid_deposition = features[5]
    tau_protein_level = features[6]
    
    # Calculate risk based on simplified algorithm
    # Lower hippocampus volume increases risk
    hippocampus_factor = max(0, (4.5 - hippocampus_volume) * 15)
    
    # Lower cortical thickness increases risk
    cortical_factor = max(0, (3.5 - cortical_thickness) * 20)
    
    # Higher ventricle volume increases risk
    ventricle_factor = max(0, (ventricle_volume - 15) * 0.8)
    
    # Higher white matter hyperintensities increases risk
    white_matter_factor = white_matter_hyperintensities * 3
    
    # Lower brain glucose metabolism increases risk
    glucose_factor = max(0, (7.0 - brain_glucose_metabolism) * 10)
    
    # Higher amyloid deposition increases risk
    amyloid_factor = amyloid_deposition * 12
    
    # Higher tau protein level increases risk
    tau_factor = tau_protein_level * 15
    
    # Calculate total risk score
    risk_score = (
        hippocampus_factor + 
        cortical_factor + 
        ventricle_factor + 
        white_matter_factor + 
        glucose_factor + 
        amyloid_factor + 
        tau_factor
    ) / 7  # Average the factors
    
    # Ensure risk is between 0 and 100
    risk_percentage = min(max(risk_score, 0), 100)
    
    return risk_percentage

class AlzheimerHandler(http.server.BaseHTTPRequestHandler):
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
                'message': 'Alzheimer\'s prediction service is running',
                'using_real_model': USE_REAL_MODEL
            }
            self.wfile.write(json.dumps(response).encode())
        else:
            self.send_response(404)
            self.end_headers()
            self.wfile.write(b'Not Found')
    
    def do_POST(self):
        if self.path == '/api/alzheimer-prediction':
            content_length = int(self.headers['Content-Length'])
            post_data = self.rfile.read(content_length)
            
            try:
                # Parse JSON data
                data = json.loads(post_data.decode('utf-8'))
                print("Received data:", data)
                
                # Extract features
                features = [
                    float(data['hippocampus_volume']),
                    float(data['cortical_thickness']),
                    float(data['ventricle_volume']),
                    float(data['white_matter_hyperintensities']),
                    float(data['brain_glucose_metabolism']),
                    float(data['amyloid_deposition']),
                    float(data['tau_protein_level'])
                ]
                
                print("Extracted features:", features)
                
                # Make prediction
                risk_percentage = None
                model_used = "fallback"
                
                if USE_REAL_MODEL:
                    try:
                        # Convert to numpy array for the model
                        features_array = np.array(features).reshape(1, -1)
                        
                        # Try to use the predict_proba method (for sklearn models)
                        try:
                            risk_percentage = model.predict_proba(features_array)[0][1] * 100
                            model_used = "real_model_proba"
                        except Exception as e:
                            print(f"Error using predict_proba: {str(e)}")
                            # Try to use the predict method (for other models)
                            try:
                                risk_percentage = model.predict(features_array)[0] * 100
                                model_used = "real_model_predict"
                            except Exception as e:
                                print(f"Error using predict: {str(e)}")
                                risk_percentage = fallback_predict_risk(features)
                                model_used = "fallback_after_error"
                    except Exception as e:
                        print(f"Error using real model: {str(e)}")
                        risk_percentage = fallback_predict_risk(features)
                        model_used = "fallback_after_error"
                else:
                    risk_percentage = fallback_predict_risk(features)
                    model_used = "fallback_only"
                
                print(f"Prediction: {risk_percentage}% (using {model_used})")
                
                # Return prediction result
                self._set_headers()
                response = {
                    'riskPercentage': float(risk_percentage),
                    'confidence': 0.95 if model_used.startswith("real_model") else 0.85,
                    'success': True,
                    'model_used': model_used
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

def run_server(port=5000):
    handler = AlzheimerHandler
    with socketserver.TCPServer(("", port), handler) as httpd:
        print(f"Serving at port {port}")
        httpd.serve_forever()

if __name__ == "__main__":
    run_server()
