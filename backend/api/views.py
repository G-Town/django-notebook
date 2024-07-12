from django.contrib.auth.models import User
from rest_framework import generics, viewsets
from .serializers import (
    UserSerializer,
    NoteSerializer,
    TagSerializer,
    NoteTagSerializer,
    FolderSerializer,
    FolderShareSerializer,
)
from rest_framework.permissions import IsAuthenticated, AllowAny
from .models import Note, Folder, FolderShare, Tag, NoteTag


########## notes ##########
class NoteViewSet(viewsets.ModelViewSet):
    serializer_class = NoteSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        folder_id = self.request.query_params.get("folder", None)
        queryset = (
            Note.objects.filter(author=user)
            # performs a SQL join between the Note and Folder tables
            # and fetches related Folder objects in the same query
            .select_related("folder")
            # fetches all Tag objects related to the Note objects in a separate query
            .prefetch_related("tags")
        )
        if folder_id:
            return queryset.filter(folder_id=folder_id)
        return queryset

    def perform_create(self, serializer):
        serializer.save(author=self.request.user)


########## user ##########
class CreateUserView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]


########## folders ##########
class FolderViewSet(viewsets.ModelViewSet):
    # queryset = Folder.objects.all()
    serializer_class = FolderSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Folder.objects.filter(author=self.request.user)

    def perform_create(self, serializer):
        serializer.save(author=self.request.user)


class FolderShareViewSet(viewsets.ModelViewSet):
    queryset = FolderShare.objects.all()
    serializer_class = FolderShareSerializer
    permission_classes = [IsAuthenticated]


########## tags ##########
class TagViewSet(viewsets.ModelViewSet):
    queryset = Tag.objects.all()
    serializer_class = TagSerializer
    permission_classes = [IsAuthenticated]


class NoteTagViewSet(viewsets.ModelViewSet):
    queryset = NoteTag.objects.all()
    serializer_class = NoteTagSerializer
    permission_classes = [IsAuthenticated]
