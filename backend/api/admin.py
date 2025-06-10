from django.contrib import admin
from .models import Folder, Note, Tag, NoteTag
# from django.contrib.auth.admin import UserAdmin

admin.site.register(Folder)
admin.site.register(Note)
admin.site.register(Tag)
admin.site.register(NoteTag)

# Optional: Customize UserAdmin if needed
# class CustomUserAdmin(UserAdmin):
#     pass

# Unregister default User admin and register your custom one
# admin.site.unregister(User)
# admin.site.register(User, CustomUserAdmin)