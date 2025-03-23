
# Importing flask module in the project is mandatory
# An object of Flask class is our WSGI application.
from flask import Flask, request, jsonify
import os
from test import *
from test import Predict_Data
from os import environ
from google import genai
import json


# Flask constructor takes the name of 
# current module (__name__) as argument.
app = Flask(__name__)

app.config.from_pyfile('settings.py')


# The route() function of the Flask class is a decorator, 
# which tells the application which URL should call 
# the associated function.
UPLOAD_FOLDER = 'uploads'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)  # Create folder if it doesn't exist
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

GEMINI = environ.get('GEMINI')


@app.route('/api/upload', methods=['POST'])
def upload_files():

    try:
        # if 'file1' not in request.files or 'file2' not in request.files or 'file3' not in request.files:
        #     return jsonify({'error': 'All three files are required'}), 400

        files = {
            'file1': request.files['file1'],
            # 'file2': request.files['file2'],
            # 'file3': request.files['file3']
        }

        saved_files = []
        for key, file in files.items():
            if file.filename == '':
                return jsonify({'error': f'{key} is empty'}), 400

            file_path = os.path.join(app.config['UPLOAD_FOLDER'], file.filename)
            file.save(file_path)
            saved_files.append(file.filename)

        #idhar call kar model ko

        print(saved_files[0])

        res = Predict_Data('uploads/'+saved_files[0])

        return jsonify({'message': 'Files uploaded successfully', 'files': saved_files, 'data' : res}), 200

    except Exception as e:
        print(e)
        return jsonify({'error': 'An unexpected error occurred'}), 500


@app.route('/api/airesp', methods=['POST'])
def get_AI():
    data = request.get_json()
    fraud_data = data.get('fraudData')  # Extract the fraudData from request

    if not fraud_data:
        return jsonify({'error': 'fraudData is missing'}), 400

    client = genai.Client(api_key=GEMINI)

    formatted_data = json.dumps(fraud_data, indent=2)  # Convert to JSON string

    response = client.models.generate_content(
        model="gemini-2.0-flash",
        contents=f"Analyze this financial transaction output why it is fraudulant in 50-60 words , also show the data provided to you , always end with The total values of the transactin may not match and hence this data is fraudulent\n{formatted_data}",
    )

    print("AI Response:", response.text)

    return jsonify({'response': response.text}), 200


@app.route('/')
# ‘/’ URL is bound with hello_world() function.
def hello_world():
    return 'Hello World'



@app.route('/api', methods = ['POST', 'GET'])
def default():
    if request.method == 'POST':
        return jsonify({'message' : 'hello'}) 
    return jsonify({'message' : 'oooh'})

# @app.route('/api/Predict_Data')
# def Predict_Data()



# main driver function
if __name__ == '__main__':

    # run() method of Flask class runs the application 
    # on the local development server.
    app.run(port = 9002, debug=True)

