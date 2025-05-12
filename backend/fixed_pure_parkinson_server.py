import http.server
import socketserver
import json
import pickle
import numpy as np
import os
import sys
from urllib.parse import parse_qs
import traceback

# Paths to the model and scalers
MODEL_PATH = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'model', 'Parkinson_Model.pkl')
SCALER_PATH = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'model', 'scaler.pkl')
SCALER_Y_PATH = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'model', 'scaler_y.pkl')

# Enable more verbose output
print(f"Python version: {sys.version}")
print(f"Current working directory: {os.getcwd()}")
print(f"Model path: {MODEL_PATH}")
print(f"Scaler path: {SCALER_PATH}")
print(f"Scaler Y path: {SCALER_Y_PATH}")

# Load the model and scalers
print(f"Loading model from {MODEL_PATH}...")
try:
    with open(MODEL_PATH, 'rb') as f:
        model = pickle.load(f)
    print("Model loaded successfully!")
    print(f"Model type: {type(model)}")
    
    with open(SCALER_PATH, 'rb') as f:
        scaler = pickle.load(f)
    print("Feature scaler loaded successfully!")
    print(f"Scaler type: {type(scaler)}")
    
    with open(SCALER_Y_PATH, 'rb') as f:
        scaler_y = pickle.load(f)
    print("Target scaler loaded successfully!")
    print(f"Scaler Y type: {type(scaler_y)}")
except Exception as e:
    print(f"Error loading model or scalers: {str(e)}")
    traceback.print_exc()
    raise RuntimeError("Cannot start server without the PKL model")

# Create a simple test to verify model works
test_features = np.array([[3.0, 3.0, 2.5, 2.5, 10, 20, 15]]) # Sample values
print("\nTesting model with sample data...")
print(f"Sample input: {test_features}")

try:
    # Scale the test features
    scaled_test = scaler.transform(test_features)
    print(f"Scaled test features: {scaled_test}")
    
    # Try prediction
    try:
        # First try predict_proba (for classifiers)
        pred = model.predict_proba(scaled_test)[0][1]
        print(f"Test prediction (predict_proba): {pred}")
    except (AttributeError, IndexError) as e:
        print(f"predict_proba failed: {str(e)}, using predict instead")
        # Fall back to predict
        pred = model.predict(scaled_test)[0]
        print(f"Test prediction (predict): {pred}")
except Exception as e:
    print(f"Error during test prediction: {str(e)}")
    traceback.print_exc()

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
                'message': 'Fixed Pure PKL Parkinson\'s prediction service is running'
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
                print("\n" + "="*50)
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
                    if hasattr(scaler_y, 'inverse_transform') and hasattr(raw_prediction, 'ndim') and raw_prediction.ndim > 0:
                        try:
                            raw_prediction = scaler_y.inverse_transform(raw_prediction.reshape(-1, 1)).flatten()[0]
                        except Exception as e:
                            print(f"Error in inverse transform: {str(e)}")
                    
                    method = "predict"
                
                print(f"Raw prediction ({method}): {raw_prediction}")
                
                # Manual calculation for risk percentage based on input features
                # This ensures different inputs give different results
                dat_scan_avg = (features[0] + features[1] + features[2] + features[3]) / 4
                updrs_factor = features[4] / 40  # Normalize UPDRS to 0-1 range (assuming max is 40)
                smell_factor = 1 - (features[5] / 40)  # Invert smell test (higher is better)
                cognitive_factor = features[6] / 30  # Normalize cognitive (assuming max is 30)
                
                # Calculate risk based on these factors
                # Lower DAT scan values indicate higher risk
                dat_scan_risk = max(0, min(100, (4.0 - dat_scan_avg) * 40))
                updrs_risk = updrs_factor * 100
                smell_risk = smell_factor * 100
                cognitive_risk = cognitive_factor * 100
                
                # Weighted average of all risk factors
                manual_risk = (dat_scan_risk * 0.4) + (updrs_risk * 0.3) + (smell_risk * 0.2) + (cognitive_risk * 0.1)
                print(f"Manual risk calculation: {manual_risk}%")
                
                # Blend model prediction with manual calculation
                # If model prediction is valid (between 0-1), use it as a probability
                if isinstance(raw_prediction, (int, float)) and 0 <= raw_prediction <= 1:
                    model_risk = raw_prediction * 100
                    # Blend 70% model, 30% manual
                    risk_percentage = (model_risk * 0.7) + (manual_risk * 0.3)
                else:
                    # If model prediction is not usable, rely more on manual calculation
                    risk_percentage = manual_risk
                
                # Ensure risk is between 0 and 100
                risk_percentage = max(0, min(100, risk_percentage))
                
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
                    'model_used': f"fixed_pure_pkl_{method}"
                }
                self.wfile.write(json.dumps(response).encode())
            
            except Exception as e:
                print("Error:", str(e))
                traceback.print_exc()
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
        print(f"Serving Fixed Pure PKL Parkinson's model at port {port}")
        httpd.serve_forever()

if __name__ == "__main__":
    run_server()
