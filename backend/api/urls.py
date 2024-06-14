from django.urls import path
from . import views

urlpatterns = [
    path("notes/", views.NoteListCreate.as_view(), name="note-list"),
    path("notes/delete/<int:pk>/", views.NoteDelete.as_view(), name="note-delete"),
    path("notes/update/<int:pk>/", views.NoteUpdate.as_view(), name="note-update"),
    path("notes/<int:pk>/", views.NoteDetail.as_view(), name="note-detail"),
]
