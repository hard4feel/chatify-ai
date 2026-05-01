import os
from flask import Flask, request, jsonify
from flask_cors import CORS
from groq import Groq

app = Flask(__name__)
CORS(app)

client = Groq(api_key=os.environ.get("GROQ_API_KEY"))

@app.route('/api/chat', methods=['POST'])
def chat():
    data = request.json
    user_msg = data.get('message')
    if not user_msg:
        return jsonify({'error': 'empty'}), 400
    completion = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[{"role": "user", "content": user_msg}],
    )
    return jsonify({'reply': completion.choices[0].message.content})

if __name__ == '__main__':
    app.run(port=5000)