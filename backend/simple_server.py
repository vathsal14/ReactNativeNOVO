import http.server
import socketserver
import json
import pickle
import numpy as np
import os
from urllib.parse import parse_qs

# Create a simple model for demonstration
def create_dummy_model():
    # Create a simple prediction function
    def predict_func(features):
        # Simple weighted calculation based on feature values
        # This mimics what we were doing in the JavaScript version
        hippocampus_contribution = (4.5 - features[0]) * 15  # Lower is worse
        cortical_contribution = (3.5 - features[1]) * 20  # Lower is worse
        ventricle_contribution = (features[2] - 15) * 0.8  # Higher is worse
        white_matters_contribution = features[3] * 3  # Higher is worse
        glucose_contribution = (7.0 - features[4]) * 10  # Lower is worse
        amyloid_contribution = features[5] * 12  # Higher is worse
        tau_contribution = features[6] * 15  # Higher is worse
        
        # Calculate risk score
        risk_score = (
            hippocampus_contribution + 
            cortical_contribution + 
            ventricle_contribution +
            white_matters_contribution +
            glucose_contribution +
            amyloid_contribution +
            tau_contribution
        ) / 7  # Normalize to a reasonable scale
        
        # Convert to percentage (0-100)
        risk_percentage = min(max(risk_score, 0), 100)
        return risk_percentage
    
    return predict_func

# Create the model function
model = create_dummy_model()

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
                'message': 'Alzheimer\'s prediction service is running'
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
                
                # Make prediction
                risk_percentage = model(features)
                print(f"Prediction: {risk_percentage}%")
                
                # Return prediction result
                self._set_headers()
                response = {
                    'riskPercentage': risk_percentage,
                    'confidence': 0.9,
                    'success': True
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
