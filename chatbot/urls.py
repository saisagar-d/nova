from django.urls import path
from . import views
from .views import add_faq_api

from django.urls import re_path

urlpatterns = [
    path('', views.FrontendAppView.as_view(), name='home'),
    path('login/', views.login_view, name='login'),
    path('api/chatbot/', views.chatbot_api, name='chatbot_api'),
    path('chatbot/', views.chatbot, name='chatbot'),
    # path('chatbot/', views.chatbot_view, name='chatbot'),
    path('api/add-faq/', add_faq_api, name='add_faq_api'),
    path('api/csrf/', views.csrf_token_view, name='csrf_token'),
    path('api/user-info/', views.user_info_api, name='user_info_api'),
    # Password reset URL is commented out to disable password reset functionality
    # path('password-reset/', views.password_reset_view, name='password_reset'),
    path('logout/', views.logout_view, name='logout'),

    # Catch-all pattern to serve React frontend for unmatched routes
    re_path(r'^(?:.*)/?$', views.FrontendAppView.as_view(), name='react-catchall'),
]
