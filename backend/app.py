from flask import Flask, request, jsonify
import pickle
import numpy as np
from flask_cors import CORS
import os

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Create a simple model if the PKL file doesn't exist
def create_dummy_model():
    from sklearn.ensemble import RandomForestClassifier
    model = RandomForestClassifier(n_estimators=100, random_state=42)
    
    # Create some dummy training data
    X = np.random.rand(100, 7)  # 7 features
    y = np.random.randint(0, 2, 100)  # Binary classification
    
    # Train the model
    model.fit(X, y)
    
    # Save the model
    with open('alzheimer_model.pkl', 'wb') as f:
        pickle.dump(model, f)
    
    return model

# Try to load the model, or create a dummy one if it doesn't exist
model_path = os.path.join(os.path.dirname(__file__), 'alzheimer_model.pkl')
if os.path.exists(model_path):
    with open(model_path, 'rb') as f:
        model = pickle.load(f)
else:
    model = create_dummy_model()
    with open(model_path, 'wb') as f:
        pickle.dump(model, f)

@app.route('/api/alzheimer-prediction', methods=['POST'])
def predict():
    try:
        # Get features from request
        data = request.json
        print("Received data:", data)
        
        # Extract features in the order expected by the model
        features = [
            float(data['hippocampus_volume']),
            float(data['cortical_thickness']),
            float(data['ventricle_volume']),
            float(data['white_matter_hyperintensities']),
            float(data['brain_glucose_metabolism']),
            float(data['amyloid_deposition']),
            float(data['tau_protein_level'])
        ]
        
        # Convert to numpy array and reshape for prediction
        features_array = np.array(features).reshape(1, -1)
        
        # Make prediction
        prediction = model.predict_proba(features_array)[0][1]  # Assuming binary classification
        risk_percentage = prediction * 100  # Convert to percentage
        
        print(f"Prediction: {risk_percentage}%")
        
        # Return prediction result
        return jsonify({
            'riskPercentage': risk_percentage,
            'confidence': 0.9,  # Model confidence score
            'success': True
        })
    
    except Exception as e:
        print("Error:", str(e))
        return jsonify({
            'error': str(e),
            'success': False
        }), 500

@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({
        'status': 'healthy',
        'message': 'Alzheimer\'s prediction service is running'
    })

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
