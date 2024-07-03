# from django.shortcuts import render
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
class NoteListCreate(generics.ListCreateAPIView):
    queryset = Note.objects.all()  # use all objects for now, since i am the only author
    serializer_class = NoteSerializer
    permission_classes = [IsAuthenticated]

    # use this and similar functions for all views when multiple authors to query
    # def get_queryset(self):
    #     user = self.request.user
    #     return Note.objects.filter(author=user)

    def perform_create(self, serializer):
        if serializer.is_valid():
            serializer.save(author=self.request.user)
        else:
            print(serializer.errors)


class NoteDelete(generics.DestroyAPIView):
    queryset = Note.objects.all()
    permission_classes = [IsAuthenticated]


class NoteUpdate(generics.UpdateAPIView):
    queryset = Note.objects.all()
    serializer_class = NoteSerializer
    permission_classes = [IsAuthenticated]


class NoteDetail(generics.RetrieveAPIView):
    queryset = Note.objects.all()
    serializer_class = NoteSerializer
    permission_classes = [IsAuthenticated]


########## user ##########
class CreateUserView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]


########## folders ##########
class FolderViewSet(viewsets.ModelViewSet):
    queryset = Folder.objects.all()
    serializer_class = FolderSerializer
    permission_classes = [IsAuthenticated]


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
