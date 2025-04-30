from django.urls import path
from . import views

urlpatterns = [
    path('', views.login_view, name='login'),
    path('api/chatbot/', views.chatbot_api, name='chatbot_api'),
    path('chatbot/', views.chatbot, name='chatbot'),
]
