import os
import random
from flask import Flask, render_template, request, jsonify
from flask_cors import CORS
from google import genai
from dotenv import load_dotenv

# Load variables from .env
load_dotenv()

app = Flask(__name__)
CORS(app)

# --- Configuration ---
# The new SDK automatically looks for GEMINI_API_KEY in environment variables
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

try:
    if GEMINI_API_KEY:
        # Initialize the new 2025/2026 Client
        client = genai.Client(api_key=GEMINI_API_KEY)
        print("✅ Gemini AI Client Connected")
    else:
        client = None
        print("⚠️ Warning: GEMINI_API_KEY not found. Running in offline mode.")
except Exception as e:
    client = None
    print(f"❌ Initialization Error: {e}")

ANSEN_CONTEXT = """
You are Ansen Vinoj's Portfolio AI Assistant. You are friendly, professional, and slightly witty.
Your goal is to answer questions about Ansen Vinoj, his projects, skills, and experience.

Ansen Vinoj Information:
- Role: AI Engineer, ML Engineer, and Data Scientist.
- Education: Final-year B.Tech in Artificial Intelligence and Data Science at Jyothi Engineering College, Cheruthuruthy (Graduating 2025).
- Location: Kerala, India.

Technical Skills:
- Programming: Python, JavaScript, C, Dart (Flutter).
- Data Science/ML: scikit-learn, Pandas, NumPy, Deep Learning, OpenCV, Random Forest (his favorite algorithm).
- Web Development: React, Flask, Node.js, HTML5, CSS3.
- Databases: MySQL, MongoDB.
- IoT: Arduino sensor integration (NPK, pH, environmental).

Key Projects:
1. IoT Crop Recommendation System: Real-time recommendation using NPK/pH sensors and Random Forest. Published in IEEE NetACT 2025.
2. Air Quality Monitoring System: Real-time pollution tracking with visualization.
3. Face Recognition from CCTV: Computer vision system using OpenCV and Deep Learning.
4. Netflix Clone: Built using React.

Experience:
- Cyber Security Intern at Kerala Police Academy (2024): Worked on threat analysis and vulnerability assessment.
- Flutter Development Intern at ICT Academy (2024): Built cross-platform mobile apps.

Certifications:
- IEEE NetACT 2025 Publication.
- NPTEL: Data Science for Engineers, Automation in Production Systems, Wheeled Mobile Robots.
- ICT Kerala Academy: Flutter App Development.
- NASA Space App Challenge Participant.

Keep your responses concise (under 3-4 sentences), helpful, and always refer to Ansen as "Ansen" or "my creator". If you don't know something specific about him, provide a polite response based on what you know.
"""

# --- 1. Random AI Facts ---
FACTS = [
    "The term 'Artificial Intelligence' was first coined in 1956.",
    "Eliza, the first chatbot, was created in 1966.",
    "Machine Learning algorithms can identify deepfakes with up to 99% accuracy.",
    "AI generated art won a state fair competition in 2022.",
    "Self-driving cars use deep learning to interpret sensor data.",
    "An AI defeated a human world champion in Go back in 2016.",
    "GPT-4 was trained on approximately 45TB of text data.",
    "Random Forest — Ansen's favorite algorithm — was invented in 2001."
]

# --- 2. Guess the Algorithm Game ---
ALGORITHMS = [
    {"clue": "I draw a line to split data into two groups. Hint: SVM", "answer": "Support Vector Machine"},
    {"clue": "I make decisions like a flowchart. Hint: Trees", "answer": "Decision Tree"},
    {"clue": "I am inspired by the human brain. Hint: NN", "answer": "Neural Network"},
    {"clue": "I cluster data into K groups. Hint: K-Means", "answer": "K-Means"},
    {"clue": "I combine multiple weak learners to build a strong one. Hint: RF", "answer": "Random Forest"}
]

# --- Chat Logic ---
def chatbot_response(message):
    if not client:
        return "I'm currently offline, but Ansen is a great ML Engineer! Try checking his projects."

    try:
        response = client.models.generate_content(
            model='gemini-flash-latest',
            contents=f"{ANSEN_CONTEXT}\n\nUser: {message}\nAssistant:"
        )
        return response.text.strip()
    except Exception as e:
        print(f"API Error: {e}")
        return "I'm having trouble connecting to my brain right now. Please try again later!"

# --- Routes ---
@app.route("/")
def home():
    return render_template("index.html")

@app.route("/api/chat", methods=["POST"])
def chat():
    data = request.get_json()
    user_msg = data.get("message", "")
    return jsonify({"response": chatbot_response(user_msg)})

@app.route("/api/fact", methods=["GET"])
def get_fact():
    return jsonify({"fact": random.choice(FACTS)})

@app.route("/api/algorithm", methods=["GET"])
def get_algorithm():
    algo = random.choice(ALGORITHMS)
    return jsonify({"clue": algo["clue"], "answer": algo["answer"]})

if __name__ == "__main__":
    app.run(debug=True, port=5001)