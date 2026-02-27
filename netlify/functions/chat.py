import json
import os
from google import genai

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

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
client = None
if GEMINI_API_KEY:
    try:
        client = genai.Client(api_key=GEMINI_API_KEY)
    except Exception as e:
        print(f"Initialization Error: {e}")

def handler(event, context):
    if event.get("httpMethod") != "POST":
        return {
            "statusCode": 405,
            "body": json.dumps({"error": "Method Not Allowed"})
        }

    try:
        body = json.loads(event.get("body", "{}"))
        user_msg = body.get("message", "")
    except Exception:
        return {
            "statusCode": 400,
            "body": json.dumps({"error": "Invalid JSON"})
        }

    if not client:
        return {
            "statusCode": 200,
            "body": json.dumps({"response": "I'm currently offline, but Ansen is a great ML Engineer! Try checking his projects."})
        }

    try:
        response = client.models.generate_content(
            model='gemini-flash-latest',
            contents=f"{ANSEN_CONTEXT}\n\nUser: {user_msg}\nAssistant:"
        )
        return {
            "statusCode": 200,
            "body": json.dumps({"response": response.text.strip()})
        }
    except Exception as e:
        print(f"API Error: {e}")
        return {
            "statusCode": 500,
            "body": json.dumps({"response": "I'm having trouble connecting to my brain right now. Please try again later!"})
        }
