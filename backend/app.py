from flask import Flask, request, jsonify
from flask_cors import CORS
import firebase_admin
from firebase_admin import credentials, firestore, auth

app = Flask(__name__)
CORS(app)

firebaseConfig = {
  "apiKey": "AIzaSyCFfibXEQLXjR3oRn6O07gMuI_BsNBu8BA",
  "authDomain": "personalbudget-35dfc.firebaseapp.com",
  "projectId": "personalbudget-35dfc",
  "storageBucket": "personalbudget-35dfc.appspot.com",
  "messagingSerId": "945952044041",
  "appId": "1:952044041:web:9d6a31835df791dcfa34d8",
  "measuremen": "G-68GWKNRE1J"
}

cred = credentials.Certificate("secrets/personalbudget-35dfc-firebase-adminsdk-vl9dl-9b6e00d8ac.json")
firebase_admin.initialize_app(cred)

db = firestore.client()

@app.route('/edit_data', methods=['POST'])
def editData():
  id_token = request.headers.get('auth')
  try:
    # Verify the ID token
    decoded_token = auth.verify_id_token(id_token)
    
    # Extract the user ID
    user_id = decoded_token['uid']

    # Get a reference to the 'budget' collection and create a document with the user's ID
    doc_ref = db.collection('budget').document(str(user_id))

    # Set the document with the data
    doc_ref.set(data)

    return {'message': 'Document created successfully'}, 200
  except auth.AuthError as e:
    print(e)
    return {'error': str(e)}, 401

@app.route('/create_data', methods=['POST'])
def createDocument():
  id_token = request.headers.get('auth')
  try:
    # Verify the ID token
    decoded_token = auth.verify_id_token(id_token)
    
    # Extract the user ID
    user_id = decoded_token['uid']

    # Get a reference to the 'budget' collection and create a document with the user's ID
    doc_ref = db.collection('budget').document(str(user_id))

    # Example data to be stored in the document
    data = {
      data: [],
      labels: []
    }

    # Set the document with the data
    doc_ref.set(data)

    return {'message': 'Document created successfully'}, 200
  except auth.AuthError as e:
    print(e)
    return {'error': str(e)}, 401

@app.route('/data', methods=['GET'])
def getData():
  id_token = request.headers.get('auth')
  try:
    # Verify the ID token
    decoded_token = auth.verify_id_token(id_token)
    
    # Extract the user ID
    user_id = decoded_token['uid']

    doc_ref = db.collection('budget').document(str(user_id))

    # Get the document data
    doc_data = doc_ref.get().to_dict()

    print('getting data')
    return {'message': 'data success', 'budgetData' : doc_data}, 200
  except auth.AuthError as e:
    print(e)
    return {'error': str(e)}, 401

@app.route('/signup', methods=['POST'])
def signup():
  signin_data = request.get_json()
  username = signin_data['username']
  password = signin_data['password']
  confirmPassword = signin_data['confirmPassword']
  if password != confirmPassword:
    return jsonify({'error': 'Passwords do not match'}), 400


  return jsonify({'message': 'Form submitted successfully'})


if __name__ == '__main__':
  app.run(debug=True)