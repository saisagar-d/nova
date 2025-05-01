from django.urls import path
from . import views
from .views import add_faq_api

urlpatterns = [
    path('', views.login_view, name='login'),
    path('api/chatbot/', views.chatbot_api, name='chatbot_api'),
    path('chatbot/', views.chatbot, name='chatbot'),
    path('api/add-faq/', add_faq_api, name='add_faq_api'),
]
