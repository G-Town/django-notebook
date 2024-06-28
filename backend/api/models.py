from django.db import models
from django.contrib.auth.models import User

class Note(models.Model):
    title = models.CharField(max_length=100)
    content = models.TextField()
    snippet = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    author = models.ForeignKey(User, on_delete=models.CASCADE, related_name="notes")

    def save(self, *args, **kwargs):
        self.snippet = self.generate_snippet()
        super().save(*args, **kwargs)

    def generate_snippet(self):
        max_length = 100  # Adjust this value as needed
        content = self.content.split('\n', 1)[0]
        return content if len(content) <= max_length else content[:max_length] + '...'

    def __str__(self):
        return self.title