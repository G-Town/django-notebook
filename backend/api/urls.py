from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    NoteViewSet,
    CreateUserView,
    FolderViewSet,
    FolderShareViewSet,
    TagViewSet,
    NoteTagViewSet,
)

router = DefaultRouter()
router.register(r"notes", NoteViewSet, basename="note")
router.register(r"folders", FolderViewSet, basename="folder")
router.register(r"folder-shares", FolderShareViewSet, basename="folder-share")
router.register(r"tags", TagViewSet, basename="tag")
router.register(r"note-tags", NoteTagViewSet, basename="note-tag")

urlpatterns = [
    path("", include(router.urls)),
    path("create-user/", CreateUserView.as_view(), name="create-user"),
]
