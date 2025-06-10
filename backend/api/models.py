from django.db import models
from django.contrib.auth.models import User


class Tag(models.Model):
    name = models.CharField(max_length=50, unique=True)

    def __str__(self):
        return self.name


class Folder(models.Model):
    name = models.CharField(max_length=50)
    author = models.ForeignKey(User, on_delete=models.CASCADE)
    parent = models.ForeignKey(
        "self", on_delete=models.CASCADE, null=True, blank=True, related_name="children"
    )
    created_at = models.DateTimeField(auto_now_add=True)
    imported_at = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return self.name

    @property
    def is_root(self):
        return self.parent is None


class Note(models.Model):
    title = models.CharField(max_length=100)
    author = models.ForeignKey(User, on_delete=models.CASCADE, related_name="notes")
    content = models.TextField()
    snippet = models.TextField(blank=True, null=True)
    folder = models.ForeignKey(
        Folder, on_delete=models.CASCADE, related_name="notes", null=True, blank=True
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    imported_at = models.DateTimeField(null=True, blank=True)
    tags = models.ManyToManyField(Tag, through="NoteTag")
    is_pinned = models.BooleanField(default=False)

    def save(self, *args, **kwargs):
        self.snippet = self.generate_snippet()
        super().save(*args, **kwargs)

    def generate_snippet(self):
        max_length = 100  # Adjust this value as needed
        content = self.content.strip().split("\n", 1)[0]
        return content if len(content) <= max_length else content[:max_length] + "..."

    def __str__(self):
        return self.title


class NoteTag(models.Model):
    note = models.ForeignKey(Note, on_delete=models.CASCADE)
    tag = models.ForeignKey(Tag, on_delete=models.CASCADE)


# class FolderShare(models.Model):
#     folder = models.ForeignKey(Folder, on_delete=models.CASCADE)
#     shared_with = models.ForeignKey(User, on_delete=models.CASCADE)
#     permission = models.CharField(max_length=50)  # e.g., 'read', 'write'
