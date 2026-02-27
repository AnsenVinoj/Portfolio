import json
import random

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

def handler(event, context):
    return {
        "statusCode": 200,
        "body": json.dumps({"fact": random.choice(FACTS)})
    }
