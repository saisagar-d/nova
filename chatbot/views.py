from django.shortcuts import render, redirect
from django.http import JsonResponse
from django.contrib.auth import authenticate, login
from django.contrib.auth.decorators import login_required
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.models import User

from .models import FAQ, UserSession

from rapidfuzz import process, fuzz
import json
import time
import re

# ----------------------------
# LOGIN VIEW
# ----------------------------
def login_view(request):
    if request.method == "POST":
        email = request.POST.get('email')
        password = request.POST.get('password')

        pattern = r'^1DT23CS\d+@dsatm\.edu\.in$'
        if not re.match(pattern, email):
            return render(request, 'login.html', {
                'error_message': "Access denied",
                'access_denied': True
            })

        try:
            user_obj = User.objects.get(email=email)
        except User.DoesNotExist:
            try:
                user_obj = User.objects.get(username=email)
            except User.DoesNotExist:
                return render(request, 'login.html', {
                    'error_message': "User with this email does not exist."
                })

        user = authenticate(request, username=user_obj.username, password=password)
        if user:
            login(request, user)
            return redirect('chatbot')
        else:
            return render(request, 'login.html', {
                'error_message': "Invalid email or password."
            })

    return render(request, 'login.html')


# ----------------------------
# CHATBOT VIEW (GET + POST)
# ----------------------------
@login_required
def chatbot(request):
    answer = ""
    show_spinner = False
    extra_data = None
    user_question = None

    if request.method == "POST":
        user_question = request.POST.get('question', '').strip()
        show_spinner = True
        time.sleep(1)  # simulate loading delay

        faqs = list(FAQ.objects.all())
        faq_map = {faq.question.strip().lower(): faq for faq in faqs}
        questions = list(faq_map.keys())
        input_question = user_question.lower()

        # First try with partial_ratio (handles partial & typo)
        match_result = process.extractOne(
            input_question, questions, scorer=fuzz.partial_ratio, score_cutoff=70
        )

        # Optional fallback with token_sort_ratio
        if not match_result:
            match_result = process.extractOne(
                input_question, questions, scorer=fuzz.token_sort_ratio, score_cutoff=75
            )

        if match_result:
            matched_question = match_result[0]
            matched_faq = faq_map[matched_question]
            answer = matched_faq.answer
            extra_data = matched_faq.extra_data
        else:
            answer = "Sorry, I don't know the answer to that question yet."
            extra_data = None

        show_spinner = False

    # Greeting logic
    greeting = "Welcome!"
    if request.user.is_authenticated:
        user_session, created = UserSession.objects.get_or_create(user=request.user)
        if user_session.first_login:
            greeting = "Hello! What's on your mind?"
            user_session.first_login = False
            user_session.save()
        else:
            greeting = "Welcome back! What would you like help with today?"

    return render(request, 'chatbot.html', {
        'answer': answer,
        'show_spinner': show_spinner,
        'extra_data': extra_data,
        'user_question': user_question,
        'greeting': greeting,
    })


# ----------------------------
# CHATBOT API (JSON POST)
# ----------------------------
@csrf_exempt
def chatbot_api(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            user_question = data.get('question', '').strip().lower()
        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid JSON'}, status=400)

        faqs = list(FAQ.objects.all())
        faq_map = {faq.question.strip().lower(): faq for faq in faqs}
        questions = list(faq_map.keys())

        # Try matching
        match_result = process.extractOne(
            user_question, questions, scorer=fuzz.partial_ratio, score_cutoff=70
        )

        if not match_result:
            match_result = process.extractOne(
                user_question, questions, scorer=fuzz.token_sort_ratio, score_cutoff=75
            )

        if match_result:
            matched_question = match_result[0]
            matched_faq = faq_map[matched_question]
            return JsonResponse({
                'answer': matched_faq.answer,
                'extra_data': matched_faq.extra_data
            })

        return JsonResponse({'answer': "Sorry, I don't know the answer to that question yet."})

    return JsonResponse({'error': 'Invalid request method'}, status=405)


# ----------------------------
# ADD FAQ API (JSON POST)
# ----------------------------
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

            if FAQ.objects.filter(question__iexact=question).exists():
                return JsonResponse({'error': 'Question already exists.'}, status=409)

            FAQ.objects.create(
                question=question,
                answer=answer,
                category=category,
                extra_data=extra_data
            )

            return JsonResponse({'message': 'FAQ added successfully.'}, status=201)

        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid JSON'}, status=400)

    return JsonResponse({'error': 'Invalid request method'}, status=405)
