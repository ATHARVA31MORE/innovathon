from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import json
import google.generativeai as genai
from test import Predict_Data

app = Flask(__name__)
CORS(app, supports_credentials=True)

UPLOAD_FOLDER = 'uploads'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

# Hardcoded API key
GEMINI = "AIzaSyBk4YM6SeA_5cYjCrJCPIcnUWXX5CAHmMc"
genai.configure(api_key=GEMINI)
model = genai.GenerativeModel("gemini-1.5-pro")

@app.route('/api/upload', methods=['POST'])
def upload_files():
    try:
        if 'file1' not in request.files:
            return jsonify({'error': 'File1 is required'}), 400
        file = request.files['file1']
        if file.filename == '':
            return jsonify({'error': 'No selected file'}), 400
        file_path = os.path.join(app.config['UPLOAD_FOLDER'], file.filename)
        file.save(file_path)
        res = Predict_Data(file_path)
        return jsonify({'message': 'File uploaded successfully', 'file': file.filename, 'data': res}), 200
    except Exception as e:
        return jsonify({'error': 'Internal server error'}), 500

@app.route('/api/airesp', methods=['POST'])
def get_AI():
    try:
        data = request.get_json()
        if not data or 'fraudData' not in data:
            return jsonify({'error': 'Invalid JSON data'}), 400

        fraud_data = data['fraudData']
        transaction_id = fraud_data.get('id')
        transaction_amount = fraud_data.get('amount')

        if transaction_id is None or transaction_amount is None:
            return jsonify({'error': 'Missing transaction data'}), 400

        prompt = f"""
        Analyze this financial transaction (ID: {transaction_id}, Amount: ${transaction_amount}).
        Summarize fraud indicators and risk level in two lines.
        """
        
        response = model.generate_content(prompt)
        if not response or not hasattr(response, 'text') or not response.text:
            return jsonify({'error': 'AI response is empty'}), 500

        ai_text = response.text.split(". ")[:2]  # Extract only the first two sentences
        return jsonify({
            'response': " ".join(ai_text),
            'transaction_id': transaction_id,
            'transaction_amount': transaction_amount
        }), 200

    except Exception as e:
        return jsonify({'error': 'Failed to generate AI content'}), 500

if __name__ == '__main__':
    app.run(port=9002, debug=True)