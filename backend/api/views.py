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
from services.icloud_service import ICloudService
# from pyicloud import PyiCloudService
# from pyicloud.exceptions import PyiCloudFailedLoginException
from .models import Note, Folder, Tag
# import os

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


########## import from icloud ##########
# function based view
# consider implementing class based views for interacting with multiple other apps
@api_view(["POST"])
@permission_classes([IsAuthenticated])
def import_icloud_notes(request):
    icloud_service = ICloudService()
    
    try:
        icloud_service.connect()
        notes, folder_names = icloud_service.get_notes_and_folders()
        
        imported_notes, imported_folder = icloud_service.process_notes(notes, request.user)
        
        return JsonResponse({
            "imported_notes_count": len(imported_notes),
            "imported_notes": imported_notes,
            "imported_folder": imported_folder,
        }, status=200)
    
    except Exception as e:
        return JsonResponse({
            "error": str(e),
            "error_location": f"{e.__traceback__.tb_frame.f_code.co_filename}:{e.__traceback__.tb_lineno}",
        }, status=500)

# @api_view(["POST"])
# @permission_classes([IsAuthenticated])
# def import_icloud_notes(request):
#     apple_id = os.getenv("IC_APPLEID")
#     password = os.getenv("IC_PWD")

#     # use this object to store items to return in response for debugging
#     debug_info = {}

#     try:
#         icloud_service = PyiCloudService(apple_id, password)
#         if icloud_service.requires_2fa:
#             return JsonResponse(
#                 {"error": "Two-factor authentication required."}, status=401
#             )

#         notes = icloud_service.notes.notes
#         folders = icloud_service.notes.folders
#         if not folders:
#             debug_info["folder_status"] = "no folders fetched"
#         folder_names = []
#         for folder in folders:
#             folder_names.append(folder["fields"]["title"])
#         user = request.user

#         imported_notes = []
#         imported_notes_data = []
#         imported_folders_data = []

#         for icloud_note in notes:
#             if (
#                 "Deleted" in icloud_note["fields"]
#                 and icloud_note["fields"]["Deleted"]["value"]
#             ):
#                 continue

#             # note_fields = icloud_note["fields"]
#             full_content = icloud_note["fields"]["Text"]["string"]
#             content_split = full_content.split("\n", 1)

#             if len(content_split) > 1:
#                 [title, content] = content_split
#             else:
#                 title = content_split[0]
#                 content = ""

#             # check if note already exists
#             existing_note = Note.objects.filter(
#                 Q(author=user) & (Q(title=title) | Q(content=content))
#             ).first()

#             # if existing_note:
#             #     # Update existing note if it's been modified
#             #     if icloud_note:

#             # Link to a specific folder or create a new one
#             folder, created = Folder.objects.get_or_create(name="Imported", author=user)

#             note = Note(
#                 title=title,
#                 content=content,
#                 author=user,
#                 folder=folder,
#             )
#             note.save()
#             imported_notes.append(note)

#             # Add the note data to return list
#             imported_notes_data.append(
#                 {
#                     "id": note.id,
#                     "title": note.title,
#                     "content": note.content,
#                     "folder_id": note.folder.id,
#                     "folder_name": note.folder.name,
#                     "created_at": note.created_at.isoformat(),
#                     "updated_at": note.updated_at.isoformat(),
#                 }
#             )

#         return JsonResponse(
#             {
#                 "imported_notes_count": len(imported_notes),
#                 # "imported_notes": imported_notes_data,
#                 "imported_folders": folder_names,
#                 "debug_info": debug_info,
#             },
#             status=200,
#         )

#     except PyiCloudFailedLoginException:
#         return JsonResponse({"error": "Failed to log in to iCloud."}, status=401)
#     except Exception as e:
#         return JsonResponse(
#             {
#                 "error": str(e),
#                 "error_location": f"{e.__traceback__.tb_frame.f_code.co_filename}:{e.__traceback__.tb_lineno}",
#                 "title": title,
#                 "debug_info": debug_info,
#             },
#             status=500,
#         )
