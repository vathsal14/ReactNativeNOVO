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
    print("Will use enhanced fallback model instead.")

# Enhanced fallback prediction function with more sensitivity to input changes
def enhanced_fallback_predict_risk(features):
    print("Using enhanced fallback model for prediction")
    # Extract individual features
    hippocampus_volume = features[0]
    cortical_thickness = features[1]
    ventricle_volume = features[2]
    white_matter_hyperintensities = features[3]
    brain_glucose_metabolism = features[4]
    amyloid_deposition = features[5]
    tau_protein_level = features[6]
    
    print(f"Input features: hippocampus={hippocampus_volume}, cortical={cortical_thickness}, ventricle={ventricle_volume}")
    print(f"white_matter={white_matter_hyperintensities}, glucose={brain_glucose_metabolism}")
    print(f"amyloid={amyloid_deposition}, tau={tau_protein_level}")
    
    # Calculate risk based on enhanced algorithm with higher sensitivity
    # Hippocampus volume: normal ~4.0-4.5 cm³, lower is worse
    hippocampus_factor = max(0, min(100, (4.5 - hippocampus_volume) * 35))  # 0-100 scale
    
    # Cortical thickness: normal ~3.0-3.5 mm, lower is worse
    cortical_factor = max(0, min(100, (3.5 - cortical_thickness) * 45))  # 0-100 scale
    
    # Ventricle volume: normal ~15-25 cm³, higher is worse
    ventricle_factor = max(0, min(100, (ventricle_volume - 15) * 4))  # 0-100 scale
    
    # White matter hyperintensities: normal ~0-2, higher is worse
    wm_factor = max(0, min(100, white_matter_hyperintensities * 15))  # 0-100 scale
    
    # Brain glucose metabolism: normal ~6.0-7.0 SUV, lower is worse
    glucose_factor = max(0, min(100, (7.0 - brain_glucose_metabolism) * 30))  # 0-100 scale
    
    # Amyloid deposition: normal ~0-0.8 SUVR, higher is worse
    amyloid_factor = max(0, min(100, amyloid_deposition * 60))  # 0-100 scale
    
    # Tau protein level: normal ~0.8-1.2 SUVR, higher is worse
    tau_factor = max(0, min(100, tau_protein_level * 50))  # 0-100 scale
    
    # Calculate weighted average (weights should sum to 1)
    weighted_score = (
        hippocampus_factor * 0.20 +
        cortical_factor * 0.15 +
        ventricle_factor * 0.10 +
        wm_factor * 0.10 +
        glucose_factor * 0.15 +
        amyloid_factor * 0.15 +
        tau_factor * 0.15
    )
    
    print(f"Component scores: hippocampus={hippocampus_factor}, cortical={cortical_factor}")
    print(f"ventricle={ventricle_factor}, wm={wm_factor}")
    print(f"glucose={glucose_factor}, amyloid={amyloid_factor}, tau={tau_factor}")
    print(f"Final weighted score: {weighted_score}")
    
    # Amplify the risk to make it more sensitive (optional)
    # This makes small changes in input values have a more noticeable effect
    amplified_risk = min(100, weighted_score * 1.3)
    
    print(f"Final amplified risk: {amplified_risk}%")
    return amplified_risk

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
                'message': 'Enhanced Alzheimer\'s prediction service is running',
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
                            prediction_proba = model.predict_proba(features_array)[0][1]
                            # Amplify the prediction to make it more sensitive to changes
                            risk_percentage = min(100, float(prediction_proba) * 150)
                            model_used = "real_model_proba"
                        except (AttributeError, IndexError):
                            # If not a classifier or other issue, use regular predict
                            prediction = model.predict(features_array)[0]
                            
                            # Ensure prediction is between 0 and 1 for percentage conversion
                            if prediction > 1 or prediction < 0:
                                # If prediction is not already a probability, normalize it
                                print(f"Raw prediction value: {prediction}, normalizing...")
                                # Simple normalization for demo purposes
                                prediction = min(max(prediction / 10, 0), 1)
                            
                            # Amplify the prediction to make it more sensitive to changes
                            risk_percentage = min(100, float(prediction) * 150)
                            model_used = "real_model_predict"
                    except Exception as e:
                        print(f"Error using real model: {str(e)}")
                        risk_percentage = enhanced_fallback_predict_risk(features)
                        model_used = "fallback_after_error"
                else:
                    risk_percentage = enhanced_fallback_predict_risk(features)
                    model_used = "enhanced_fallback"
                
                print(f"Prediction: {risk_percentage}% (using {model_used})")
                
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
        print(f"Serving Enhanced Alzheimer's model at port {port}")
        httpd.serve_forever()

if __name__ == "__main__":
    run_server()
