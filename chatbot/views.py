from django.shortcuts import render
from .models import FAQ
import difflib
import time

def chatbot(request):
    answer = ""
    show_spinner = False

    if request.method == "POST":
        user_question = request.POST.get('question')
        show_spinner = True  # Show the spinner

        # Simulating processing delay (for spinner)
        time.sleep(1)

        faqs = FAQ.objects.all()
        questions = [faq.question for faq in faqs]

        # Use difflib to find the best match
        best_match = difflib.get_close_matches(user_question, questions, n=1, cutoff=0.5)

        if best_match:
            faq = FAQ.objects.get(question=best_match[0])
            answer = faq.answer
        else:
            answer = "Sorry, I don't know the answer to that question yet."

        show_spinner = False  # Hide the spinner after getting the answer

    return render(request, 'chatbot.html', {'answer': answer, 'show_spinner': show_spinner})
