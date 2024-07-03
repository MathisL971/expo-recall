from flask import Flask, request, jsonify
from transformers import pipeline
from huggingface_hub import login
import os

app = Flask(__name__)

# huggingface_token = os.getenv("HUGGINGFACE_API_KEY")
# login(huggingface_token)

# # Load the model
# generator = pipeline('text-generation', model="meta-llama/Meta-Llama-3-8B-Instruct", token=huggingface_token)

@app.route('/prompt', methods=['POST'])
def prompt():
    data = request.json
    user_prompt = data.get('prompt')
    
    # Generate a response from the model
    # result = generator(user_prompt, max_length=150, num_return_sequences=1)
    
    # return jsonify(result[0]['generated_text'])

@app.route('/test', methods=['GET'])
def test():
    return jsonify({"message": "API is working!"})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001, debug=True)

