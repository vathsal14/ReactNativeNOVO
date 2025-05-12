import http.server
import socketserver
import json
import numpy as np
import os
from urllib.parse import parse_qs

# Simple prediction function that mimics the model
def predict_risk(features):
    print("Using simplified model for prediction")
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
                
                print("Extracted features:", features)
                
                # Make prediction
                risk_percentage = predict_risk(features)
                
                print(f"Prediction: {risk_percentage}%")
                
                # Return prediction result
                self._set_headers()
                response = {
                    'riskPercentage': float(risk_percentage),
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
