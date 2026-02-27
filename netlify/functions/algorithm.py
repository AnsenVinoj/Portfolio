import json
import random

ALGORITHMS = [
    {"clue": "I draw a line to split data into two groups. Hint: SVM", "answer": "Support Vector Machine"},
    {"clue": "I make decisions like a flowchart. Hint: Trees", "answer": "Decision Tree"},
    {"clue": "I am inspired by the human brain. Hint: NN", "answer": "Neural Network"},
    {"clue": "I cluster data into K groups. Hint: K-Means", "answer": "K-Means"},
    {"clue": "I combine multiple weak learners to build a strong one. Hint: RF", "answer": "Random Forest"}
]

def handler(event, context):
    algo = random.choice(ALGORITHMS)
    return {
        "statusCode": 200,
        "body": json.dumps({"clue": algo["clue"], "answer": algo["answer"]})
    }
