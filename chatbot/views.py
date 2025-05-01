from django.shortcuts import render, redirect
from django.http import JsonResponse
from django.contrib.auth import authenticate, login
from .models import FAQ
from rapidfuzz import process
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

        # Use rapidfuzz to find the best match
        match, score, _ = process.extractOne(user_question, questions, score_cutoff=60)

        if match:
            faq = FAQ.objects.get(question=match)
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

        match, score, _ = process.extractOne(user_question, questions, score_cutoff=60)

        if match:
            faq = FAQ.objects.get(question=match)
            answer = faq.answer
        else:
            answer = "Sorry, I don't know the answer to that question yet."


        return JsonResponse({'answer': answer})

    return JsonResponse({'error': 'Invalid request method'}, status=405)

from django.views.decorators.csrf import csrf_exempt
@csrf_exempt
def add_faq_api(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            question = data.get('question', '').strip()
            answer = data.get('answer', '').strip()
            category = data.get('category', 'general').strip()
            extra_data = data.get('extra_data', None)

            if not question or not answer:
                return JsonResponse({'error': 'Both question and answer are required.'}, status=400)

            # Check if question already exists
            if FAQ.objects.filter(question=question).exists():
                return JsonResponse({'error': 'Question already exists.'}, status=409)

            FAQ.objects.create(question=question, answer=answer, category=category, extra_data=extra_data)
            return JsonResponse({'message': 'FAQ added successfully.'}, status=201)

        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid JSON'}, status=400)

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
