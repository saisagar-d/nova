from django.db import models

class FAQ(models.Model):
    question = models.CharField(max_length=255)
    answer = models.TextField()
    category = models.CharField(max_length=50, default='general')
    extra_data = models.JSONField(blank=True, null=True)  # Built-in JSONField for SQLite and others

    def __str__(self):
        return self.question

