import requests

# Your local or deployed Django endpoint
url = "http://127.0.0.1:8000/api/add-faq/"

# List of FAQs to upload
data = [
    {
        "question": "Are laptops allowed in class?",
        "answer": "Yes, if permitted by the faculty."
    },
    {
        "question": "Where can I check the academic calendar?",
        "answer": "It is available on the college website under 'Resources'."
    }
]

# Send each FAQ as a separate POST request
for faq in data:
    response = requests.post(url, json=faq)
    print(f"Uploading FAQ: {faq['question']}")
    print("Status Code:", response.status_code)
    try:
        print("Response:", response.json())
    except Exception as e:
        print("Response content could not be decoded as JSON:", response.text)
