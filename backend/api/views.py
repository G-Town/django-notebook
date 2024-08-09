from django.http import JsonResponse
from rest_framework import generics, viewsets
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.contrib.auth.models import User
from .models import Note, Folder, FolderShare, Tag, NoteTag
from .serializers import (
    UserSerializer,
    NoteSerializer,
    TagSerializer,
    NoteTagSerializer,
    FolderSerializer,
    FolderShareSerializer,
)
from pyicloud import PyiCloudService
from pyicloud.exceptions import PyiCloudFailedLoginException
from .models import Note, Folder, Tag
import os

import logging

logger = logging.getLogger(__name__)


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


class RecentNotesView(generics.ListAPIView):
    serializer_class = NoteSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Note.objects.filter(author=self.request.user).order_by("-updated_at")[:3]


########## user ##########
class CreateUserView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]


class UserDetailView(generics.RetrieveAPIView):
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return self.request.user


########## folders ##########
class FolderViewSet(viewsets.ModelViewSet):
    # queryset = Folder.objects.all()
    serializer_class = FolderSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Folder.objects.filter(author=self.request.user)

    def perform_create(self, serializer):
        serializer.save(author=self.request.user)


class FeaturedFoldersView(generics.ListAPIView):
    serializer_class = FolderSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Folder.objects.filter(author=self.request.user).order_by("-id")[:3]


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


# import from icloud
@api_view(["POST"])
@permission_classes([IsAuthenticated])
def import_icloud_notes(request):
    apple_id = os.getenv("IC_APPLEID")
    password = os.getenv("IC_PWD")

    # use this object to store items to return in response for debugging
    debug_info = {}

    try:
        icloud_service = PyiCloudService(apple_id, password)
        if icloud_service.requires_2fa:
            return JsonResponse(
                {"error": "Two-factor authentication required."}, status=401
            )

        notes = icloud_service.notes.notes
        user = request.user

        imported_notes = []
        for icloud_note in notes:
            if (
                # skip note if deleted
                "Deleted" in icloud_note["fields"]
                and icloud_note["fields"]["Deleted"]["value"]
            ):
                continue

            # note_fields = icloud_note["fields"]

            full_content = icloud_note["fields"]["Text"]["string"]

            # Split the full content into title and content by the first newline
            content_split = full_content.split("\n", 1)

            if len(content_split) > 1:
                [title, content] = content_split
            else:
                title = content_split[0]
                content = ""

            debug_info["title"] = title
            debug_info["content"] = content
            
            # Find the first non-empty line for the snippet
            # snippet_lines = [line for line in content_split[1] if line.strip()]
            # snippet = "\n".join(snippet_lines)[:100] if snippet_lines else ""

            # snippet = content.strip()[:100]

            # Link to a specific folder or create a new one
            folder, created = Folder.objects.get_or_create(name="Imported", author=user)

            note = Note(
                title=title,
                content=content,
                # snippet=snippet,
                author=user,
                folder=folder,
            )
            note.save()
            imported_notes.append(note)

        # Return a summary of imported notes
        return JsonResponse(
            {
                "imported_notes_count": len(imported_notes),
                "debug_info": debug_info,
                # "snippet": snippet,
            },
            status=200,
        )

    except PyiCloudFailedLoginException:
        return JsonResponse({"error": "Failed to log in to iCloud."}, status=401)
    except Exception as e:
        return JsonResponse(
            {
                "error": str(e),
                "error_location": f"{e.__traceback__.tb_frame.f_code.co_filename}:{e.__traceback__.tb_lineno}",
                "title": title,
                "debug_info": debug_info,
            },
            status=500,
        )
