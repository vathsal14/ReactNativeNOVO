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
    
    USE_REAL_MODEL = True
except Exception as e:
    print(f"Error loading model or scalers: {str(e)}")
    USE_REAL_MODEL = False
    print("Will use fallback model instead.")

# Fallback prediction function in case the model fails to load
def fallback_predict_risk(features):
    print("Using fallback model for prediction")
    # Extract individual features
    caudate_r = features[0]
    caudate_l = features[1]
    putamen_r = features[2]
    putamen_l = features[3]
    updrs_score = features[4]
    smell_score = features[5]
    cognitive_score = features[6]
    
    print(f"Input features: caudate_r={caudate_r}, caudate_l={caudate_l}, putamen_r={putamen_r}, putamen_l={putamen_l}")
    print(f"updrs_score={updrs_score}, smell_score={smell_score}, cognitive_score={cognitive_score}")
    
    # DAT scan values - lower values indicate higher risk
    # Normal ranges: caudate ~3.5-4.0, putamen ~2.5-3.0
    caudate_r_score = max(0, min(100, (4.0 - caudate_r) * 40))  # 0-100 scale
    caudate_l_score = max(0, min(100, (4.0 - caudate_l) * 40))  # 0-100 scale
    putamen_r_score = max(0, min(100, (3.0 - putamen_r) * 50))  # 0-100 scale
    putamen_l_score = max(0, min(100, (3.0 - putamen_l) * 50))  # 0-100 scale
    
    # Clinical scores
    # UPDRS: higher is worse (0-40 typical range)
    updrs_score = max(0, min(100, updrs_score * 3.0))  # 0-100 scale
    
    # Smell test: lower is worse (0-40 typical range)
    smell_score = max(0, min(100, (40 - smell_score) * 3.0))  # 0-100 scale
    
    # Cognitive: higher is worse (0-30 typical range)
    cognitive_score = max(0, min(100, cognitive_score * 4.0))  # 0-100 scale
    
    # Calculate weighted average (weights should sum to 1)
    weighted_score = (
        caudate_r_score * 0.15 +
        caudate_l_score * 0.15 +
        putamen_r_score * 0.15 +
        putamen_l_score * 0.15 +
        updrs_score * 0.15 +
        smell_score * 0.15 +
        cognitive_score * 0.10
    )
    
    print(f"Component scores: caudate_r={caudate_r_score}, caudate_l={caudate_l_score}")
    print(f"putamen_r={putamen_r_score}, putamen_l={putamen_l_score}")
    print(f"updrs={updrs_score}, smell={smell_score}, cognitive={cognitive_score}")
    print(f"Final weighted score: {weighted_score}")
    
    # Amplify the risk to make it more sensitive (optional)
    amplified_risk = min(100, weighted_score * 1.2)
    
    print(f"Final amplified risk: {amplified_risk}%")
    return amplified_risk

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
                'message': 'Parkinson\'s prediction service is running',
                'using_real_model': USE_REAL_MODEL
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
                
                print("Extracted features:", features)
                
                # Make prediction
                risk_percentage = None
                model_used = "fallback"
                
                if USE_REAL_MODEL:
                    try:
                        # Convert to numpy array for the model
                        features_array = np.array(features).reshape(1, -1)
                        
                        # Scale the features
                        scaled_features = scaler.transform(features_array)
                        
                        # Try to use the predict_proba method (for classifiers)
                        try:
                            prediction_proba = model.predict_proba(scaled_features)[0][1]
                            # Amplify the prediction to make it more sensitive to changes
                            risk_percentage = min(100, float(prediction_proba) * 150)
                            model_used = "real_model_proba"
                            print(f"Used predict_proba, raw value: {prediction_proba}, amplified: {risk_percentage}")
                        except (AttributeError, IndexError) as e:
                            print(f"predict_proba failed: {str(e)}, trying predict")
                            # If not a classifier or other issue, use regular predict
                            prediction = model.predict(scaled_features)[0]
                            
                            # Inverse transform to get the original scale if needed
                            if hasattr(scaler_y, 'inverse_transform'):
                                try:
                                    prediction = scaler_y.inverse_transform(prediction.reshape(-1, 1)).flatten()[0]
                                    print(f"Applied inverse transform, new value: {prediction}")
                                except Exception as e:
                                    print(f"Error in inverse transform: {str(e)}")
                            
                            # Ensure prediction is between 0 and 1 for percentage conversion
                            if prediction > 1 or prediction < 0:
                                # If prediction is not already a probability, normalize it
                                print(f"Raw prediction value: {prediction}, normalizing...")
                                # Simple normalization for demo purposes
                                prediction = min(max(prediction / 10, 0), 1)
                                print(f"Normalized to: {prediction}")
                            
                            # Amplify the prediction to make it more sensitive to changes
                            risk_percentage = min(100, float(prediction) * 150)
                            model_used = "real_model_predict"
                            print(f"Used predict, raw value: {prediction}, amplified: {risk_percentage}")
                    except Exception as e:
                        print(f"Error using real model: {str(e)}")
                        risk_percentage = fallback_predict_risk(features)
                        model_used = "fallback_after_error"
                else:
                    risk_percentage = fallback_predict_risk(features)
                    model_used = "fallback_only"
                
                print(f"Prediction: {risk_percentage}% (using {model_used})")
                
                # Determine risk level based on the risk percentage
                risk_level = 'Low'
                risk_color = '#4CAF50'
                
                if risk_percentage > 40:
                    risk_level = 'High'
                    risk_color = '#F44336'
                elif risk_percentage > 20:
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

def run_server(port=5001):  # Use a different port from the Alzheimer's server
    handler = ParkinsonHandler
    with socketserver.TCPServer(("", port), handler) as httpd:
        print(f"Serving Parkinson's model at port {port}")
        httpd.serve_forever()

if __name__ == "__main__":
    run_server()
