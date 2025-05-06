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
            # Redirect to password reset if first login or default password not changed or password is default
            user_session, created = UserSession.objects.get_or_create(user=user)
            # If user session was just created, set default_password_changed to False
            if created:
                user_session.default_password_changed = False
                user_session.save()
            if user_session.first_login or not user_session.default_password_changed or password == 'defaultpassword123':
                return redirect('password_reset')
            return redirect('chatbot')
        else:
            error_message = "Invalid email or password."
            return render(request, 'index.html', {'error_message': error_message})

    return render(request, 'index.html')

# New imports for email verification
from django.core.mail import send_mail
from django.utils.crypto import get_random_string
from django.views.decorators.http import require_POST
from django.views.decorators.csrf import csrf_exempt

# In-memory store for verification codes (for demo purposes, use persistent store in production)
verification_codes = {}

@require_POST
@csrf_exempt
def send_verification_email(request):
    email = request.POST.get('email')
    if not email:
        return JsonResponse({'error': 'Email is required'}, status=400)
    code = get_random_string(length=6, allowed_chars='0123456789')
    verification_codes[email] = code
    send_mail(
        'Password Reset Verification Code',
        f'Your verification code is: {code}',
        'no-reply@example.com',
        [email],
        fail_silently=False,
    )
    return JsonResponse({'message': 'Verification code sent'})

@require_POST
@csrf_exempt
def verify_code(request):
    email = request.POST.get('email')
    code = request.POST.get('code')
    if not email or not code:
        return JsonResponse({'error': 'Email and code are required'}, status=400)
    valid_code = verification_codes.get(email)
    if valid_code == code:
        return JsonResponse({'message': 'Verification successful'})
    else:
        return JsonResponse({'error': 'Invalid verification code'}, status=400)

@login_required
def password_reset_view(request):
    if request.method == 'POST':
        new_password = request.POST.get('new_password')
        confirm_password = request.POST.get('confirm_password')

        if not new_password or not confirm_password:
            messages.error(request, "Please fill out all fields.")
            return render(request, 'password_reset.html')

        if new_password != confirm_password:
            messages.error(request, "Passwords do not match.")
            return render(request, 'password_reset.html')

        # Check if verification code is provided and valid
        verification_code = request.POST.get('verification_code')
        user_email = request.user.email
        valid_code = verification_codes.get(user_email)
        if not verification_code or verification_code != valid_code:
            messages.error(request, "Invalid or missing verification code.")
            return render(request, 'password_reset.html')

        user = request.user
        user.set_password(new_password)
        user.save()

        # Update session to prevent logout
        update_session_auth_hash(request, user)

        # Update first_login and default_password_changed flags
        user_session, _ = UserSession.objects.get_or_create(user=user)
        user_session.first_login = False
        user_session.default_password_changed = True
        user_session.save()

        # Remove used verification code
        if user_email in verification_codes:
            del verification_codes[user_email]

        messages.success(request, "Password changed successfully.")
        return redirect('chatbot')

    # Render password reset page with verification code input field
    return render(request, 'password_reset.html', {'require_verification': True})

@login_required
def password_reset_view(request):
    if request.method == 'POST':
        new_password = request.POST.get('new_password')
        confirm_password = request.POST.get('confirm_password')

        if not new_password or not confirm_password:
            messages.error(request, "Please fill out all fields.")
            return render(request, 'password_reset.html')

        if new_password != confirm_password:
            messages.error(request, "Passwords do not match.")
            return render(request, 'password_reset.html')

        user = request.user
        user.set_password(new_password)
        user.save()

        # Update session to prevent logout
        update_session_auth_hash(request, user)

        # Update first_login flag
        user_session, _ = UserSession.objects.get_or_create(user=user)
        user_session.first_login = False
        user_session.save()

        messages.success(request, "Password changed successfully.")
        return redirect('chatbot')

    return render(request, 'password_reset.html')

# ----------------- CSRF Token View -----------------
@ensure_csrf_cookie
def csrf_token_view(request):
    return JsonResponse({'detail': 'CSRF cookie set'})

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
            # Redirect to password reset if first login
            user_session, _ = UserSession.objects.get_or_create(user=user)
            if user_session.first_login:
                return redirect('password_reset')
            return redirect('chatbot')
        else:
            error_message = "Invalid email or password."
            return render(request, 'index.html', {'error_message': error_message})

    return render(request, 'index.html')

@login_required
def password_reset_view(request):
    if request.method == 'POST':
        new_password = request.POST.get('new_password')
        confirm_password = request.POST.get('confirm_password')

        if not new_password or not confirm_password:
            messages.error(request, "Please fill out all fields.")
            return render(request, 'password_reset.html')

        if new_password != confirm_password:
            messages.error(request, "Passwords do not match.")
            return render(request, 'password_reset.html')

        user = request.user
        user.set_password(new_password)
        user.save()

        # Update session to prevent logout
        update_session_auth_hash(request, user)

        # Update first_login flag
        user_session, _ = UserSession.objects.get_or_create(user=user)
        user_session.first_login = False
        user_session.save()

        messages.success(request, "Password changed successfully.")
        return redirect('chatbot')

    return render(request, 'password_reset.html')

# ----------------- CSRF Token View -----------------
@ensure_csrf_cookie
def csrf_token_view(request):
    return JsonResponse({'detail': 'CSRF cookie set'})

@login_required
def logout_view(request):
    logout(request)
    return redirect('login')
