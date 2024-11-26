import json
from flask import Flask, request, jsonify
import boto3

# Initialize Flask app
app = Flask(__name__)

# Initialize AWS Comprehend
comprehend = boto3.client('comprehend', region_name='us-east-1')

# In-memory store for feedback (use a database for production)
feedback_data = []

@app.route('/api/feedback', methods=['POST'])
def submit_feedback():
    data = request.get_json()
    feedback = data.get('feedback')

    if not feedback:
        return jsonify({'error': 'Feedback is required'}), 400

    # Sentiment analysis with AWS Comprehend
    try:
        response = comprehend.batch_detect_sentiment(
            TextList=[feedback],
            LanguageCode='en'
        )
        sentiment = response['ResultList'][0]['Sentiment']
        feedback_data.append({'feedback': feedback, 'sentiment': sentiment})
        return jsonify({'message': 'Feedback received successfully'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/sentiments', methods=['GET'])
def get_sentiments():
    return jsonify(feedback_data), 200

if __name__ == '__main__':
    app.run(debug=True)
