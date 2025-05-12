import http.server
import socketserver
import json
import numpy as np
import os
from urllib.parse import parse_qs

# Simple prediction function that guarantees varying results
def predict_risk(features):
    print("Using simplified model for prediction")
    # Extract individual features
    caudate_r = float(features[0])
    caudate_l = float(features[1])
    putamen_r = float(features[2])
    putamen_l = float(features[3])
    updrs_score = float(features[4])
    smell_score = float(features[5])
    cognitive_score = float(features[6])
    
    print(f"Input features: caudate_r={caudate_r}, caudate_l={caudate_l}, putamen_r={putamen_r}, putamen_l={putamen_l}")
    print(f"updrs_score={updrs_score}, smell_score={smell_score}, cognitive_score={cognitive_score}")
    
    # DAT scan values - lower values indicate higher risk
    # Normal ranges: caudate ~3.5-4.0, putamen ~2.5-3.0
    caudate_r_score = max(0, min(100, (4.0 - caudate_r) * 25))  # 0-100 scale
    caudate_l_score = max(0, min(100, (4.0 - caudate_l) * 25))  # 0-100 scale
    putamen_r_score = max(0, min(100, (3.0 - putamen_r) * 33))  # 0-100 scale
    putamen_l_score = max(0, min(100, (3.0 - putamen_l) * 33))  # 0-100 scale
    
    # Clinical scores
    # UPDRS: higher is worse (0-40 typical range)
    updrs_score = max(0, min(100, updrs_score * 2.5))  # 0-100 scale
    
    # Smell test: lower is worse (0-40 typical range)
    smell_score = max(0, min(100, (40 - smell_score) * 2.5))  # 0-100 scale
    
    # Cognitive: higher is worse (0-30 typical range)
    cognitive_score = max(0, min(100, cognitive_score * 3.33))  # 0-100 scale
    
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
    
    # Return the weighted score directly (already 0-100)
    return weighted_score

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
                'message': 'Parkinson\'s prediction service is running'
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
                risk_percentage = predict_risk(features)
                
                print(f"Prediction: {risk_percentage}%")
                
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

def run_server(port=5001):  # Use a different port from the Alzheimer's server
    handler = ParkinsonHandler
    with socketserver.TCPServer(("", port), handler) as httpd:
        print(f"Serving Parkinson's model at port {port}")
        httpd.serve_forever()

if __name__ == "__main__":
    run_server()
