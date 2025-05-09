from django.shortcuts import render, redirect
from django.contrib.auth import logout
from django.contrib.auth.decorators import login_required
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
from django.views.decorators.csrf import ensure_csrf_cookie
from django.contrib.auth import authenticate, login, update_session_auth_hash
from django.contrib import messages
from django.views.generic import TemplateView
import json
import re
import time
import torch
from sentence_transformers import SentenceTransformer, util
from django.contrib.auth.models import User
from .models import FAQ, UserSession

# Load SBERT model once
model = SentenceTransformer('all-MiniLM-L6-v2')

class FrontendAppView(TemplateView):
    template_name = 'index.html'

    def get(self, request, *args, **kwargs):
        return render(request, self.template_name)

# ----------------- Chatbot Web View -----------------
@login_required
def chatbot(request):
    answer = ""
    show_spinner = False
    extra_data = None
    user_question = None

    if request.method == "POST":
        user_question = request.POST.get('question', '').strip()
        show_spinner = True
        time.sleep(1)  # simulate delay

        faqs = list(FAQ.objects.all())
        db_questions = [faq.question for faq in faqs]

        # Semantic similarity matching
        db_embeddings = model.encode(db_questions, convert_to_tensor=True)
        user_embedding = model.encode(user_question, convert_to_tensor=True)
        cos_scores = util.pytorch_cos_sim(user_embedding, db_embeddings)[0]

        top_result_idx = torch.argmax(cos_scores).item()
        top_score = cos_scores[top_result_idx].item()

        if top_score > 0.6:  # adjust threshold if needed
            matched_faq = faqs[top_result_idx]
            answer = matched_faq.answer
            extra_data = matched_faq.extra_data
        else:
            answer = "Sorry, I don't know the answer to that question yet."

        show_spinner = False

    # Greeting logic
    greeting = "NOVA"
    if request.user.is_authenticated:
        user_session, _ = UserSession.objects.get_or_create(user=request.user)
        if user_session.first_login:
            greeting = "Hello! What's on your mind?"
            user_session.first_login = False
            user_session.save()
        else:
            greeting = "Welcome back! Never forget who was there for you when no one else was..."

    return render(request, 'chatbot.html', {
        'answer': answer,
        'show_spinner': show_spinner,
        'extra_data': extra_data,
        'user_question': user_question,
        'greeting': greeting,
    })

# ----------------- Logout View -----------------
@login_required
def logout_view(request):
    logout(request)
    return JsonResponse({'message': 'Logged out successfully'}, status=200)

# ----------------- Chatbot API (POST) -----------------
@csrf_exempt
def chatbot_api(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            user_question = data.get('question', '').strip()
        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid JSON'}, status=400)

        faqs = list(FAQ.objects.all())
        db_questions = [faq.question for faq in faqs]

        db_embeddings = model.encode(db_questions, convert_to_tensor=True)
        user_embedding = model.encode(user_question, convert_to_tensor=True)
        cos_scores = util.pytorch_cos_sim(user_embedding, db_embeddings)[0]

        top_result_idx = torch.argmax(cos_scores).item()
        top_score = cos_scores[top_result_idx].item()

        if top_score > 0.6:
            matched_faq = faqs[top_result_idx]
            return JsonResponse({
                'answer': matched_faq.answer,
                'extra_data': matched_faq.extra_data
            })

        return JsonResponse({'answer': "Sorry, I don't know the answer to that question yet."})

    return JsonResponse({'error': 'Invalid request method'}, status=405)

@login_required
def user_info_api(request):
    user = request.user
    return JsonResponse({'username': user.username, 'email': user.email})

# ----------------- Add FAQ via API -----------------
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

            if FAQ.objects.filter(question=question).exists():
                return JsonResponse({'error': 'Question already exists.'}, status=409)

            FAQ.objects.create(question=question, answer=answer, category=category, extra_data=extra_data)
            return JsonResponse({'message': 'FAQ added successfully.'}, status=201)

        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid JSON'}, status=400)

# ----------------- Custom Login View -----------------
def login_view(request):
    if request.method == "POST":
        email = request.POST.get('email')
        password = request.POST.get('password')

        pattern = r'^1DT23CS\d+@dsatm\.edu\.in$'
        if not re.match(pattern, email):
            error_message = "Access denied"
            return render(request, 'index.html', {'error_message': error_message, 'access_denied': True})

        try:
            user_obj = User.objects.get(email=email)
        except User.DoesNotExist:
            try:
                user_obj = User.objects.get(username=email)
            except User.DoesNotExist:
                error_message = "User with this email does not exist."
                return render(request, 'index.html', {'error_message': error_message})

        user = authenticate(request, username=user_obj.username, password=password)
        if user is not None:
            login(request, user)
            # Redirect to chatbot directly, disable password reset redirect
            user_session, created = UserSession.objects.get_or_create(user=user)
            if created:
                user_session.default_password_changed = False
                user_session.save()
            # Remove redirect to password_reset
            return redirect('chatbot')
        else:
            error_message = "Invalid email or password."
            return render(request, 'index.html', {'error_message': error_message})

    return render(request, 'index.html')

# ----------------- CSRF Token View -----------------
@ensure_csrf_cookie
def csrf_token_view(request):
    return JsonResponse({'detail': 'CSRF cookie set'})
