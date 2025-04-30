from django.shortcuts import render, redirect
from django.http import JsonResponse
from django.contrib.auth import authenticate, login
from .models import FAQ
import difflib
import time
import json

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

def chatbot_api(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            user_question = data.get('question', '')
        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid JSON'}, status=400)

        faqs = FAQ.objects.all()
        questions = [faq.question for faq in faqs]

        best_match = difflib.get_close_matches(user_question, questions, n=1, cutoff=0.5)

        if best_match:
            faq = FAQ.objects.get(question=best_match[0])
            answer = faq.answer
        else:
            answer = "Sorry, I don't know the answer to that question yet."

        return JsonResponse({'answer': answer})

    return JsonResponse({'error': 'Invalid request method'}, status=405)

import re
from django.contrib.auth.models import User

def login_view(request):
    if request.method == "POST":
        email = request.POST.get('email')
        password = request.POST.get('password')

        # Validate email format: 1DT23CS<number>@dsatm.edu.in
        pattern = r'^1DT23CS\d+@dsatm\.edu\.in$'
        if not re.match(pattern, email):
            error_message = "Access denied"
            return render(request, 'login.html', {'error_message': error_message, 'access_denied': True})

        try:
            user_obj = User.objects.get(email=email)
        except User.DoesNotExist:
            # Try to find user by username matching email (in case username is email)
            try:
                user_obj = User.objects.get(username=email)
            except User.DoesNotExist:
                error_message = "User with this email does not exist."
                return render(request, 'login.html', {'error_message': error_message})

        user = authenticate(request, username=user_obj.username, password=password)
        if user is not None:
            login(request, user)
            return redirect('chatbot')
        else:
            error_message = "Invalid email or password."
            return render(request, 'login.html', {'error_message': error_message})
    else:
        return render(request, 'login.html')
