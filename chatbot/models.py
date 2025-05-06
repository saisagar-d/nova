from django.db import models
from django.contrib.auth.models import User

class FAQ(models.Model):
    question = models.CharField(max_length=255)
    answer = models.TextField()
    category = models.CharField(max_length=50, default='general')
    extra_data = models.JSONField(blank=True, null=True)  # Built-in JSONField for SQLite and others
    message_type = models.CharField(max_length=50, blank=True, null=True)

    def __str__(self):
        return self.question

class UserSession(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    first_login = models.BooleanField(default=True)
    default_password_changed = models.BooleanField(default=False)

    def __str__(self):
        return f"Session for {self.user.username}"

