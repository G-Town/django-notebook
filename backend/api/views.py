from django.http import JsonResponse
from rest_framework import generics, viewsets
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.contrib.auth.models import User
from .models import (
    Note, Folder,
    # FolderShare,
    Tag, NoteTag
)
from .serializers import (
    UserSerializer,
    NoteSerializer,
    TagSerializer,
    NoteTagSerializer,
    FolderSerializer,
    # FolderShareSerializer,
)
from services.icloud_service import ICloudService

# from pyicloud import PyiCloudService
# from pyicloud.exceptions import PyiCloudFailedLoginException
from .models import Note, Folder, Tag

# import os

import logging

logger = logging.getLogger(__name__)


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


########## notes ##########
class NoteViewSet(viewsets.ModelViewSet):
    serializer_class = NoteSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        folder_id = self.request.query_params.get("folder", None)
        note_id = self.request.query_params.get("id", None)

        queryset = (
            Note.objects.filter(author=user)
            # performs a SQL join between the Note and Folder tables, fetches related Folder objects
            .select_related("folder")
            # fetches all Tag objects related to the Note objects in a separate query
            .prefetch_related("tags")
        )

        if folder_id:
            return queryset.filter(folder_id=folder_id)
        if note_id:
            return queryset.filter(id=note_id)
        return queryset

    def perform_create(self, serializer):
        serializer.save(author=self.request.user)

    # def retrieve(self, requeust, *args, **kwargs):
    #     instance = self.get_object()
    #     serializer = self.get_serializer(instance)
    #     return Response(serializer.data)


class RecentNotesView(generics.ListAPIView):
    serializer_class = NoteSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Note.objects.filter(author=self.request.user).order_by("-updated_at")[:3]


class PinnedNotesView(generics.ListAPIView):
    serializer_class = NoteSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Note.objects.filter(author=self.request.user, is_pinned=True).order_by(
            "-updated_at"
        )


class ActivityView(generics.ListAPIView):

    serializer_class = NoteSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # For 'activity', returning recently updated notes is a common approach.
        # Adjust as needed if 'activity' encompasses more (e.g., new folders, etc.).
        return Note.objects.filter(author=self.request.user).order_by("-updated_at")[
            :10
        ]  # Get top 10 most recent activities


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
        # To select new folders and folders with new notes:
        # 1. Order by folder's own 'updated_at' (captures newly created and recently modified folders).
        # 2. To account for "folders with new notes", we can annotate the folder with the
        #    max updated_at of its notes and then order by that.
        from django.db.models import Max
        user = self.request.user
        
        return Folder.objects.filter(author=user).annotate(
            last_note_update=Max('notes__updated_at') # Get the latest update time of any note in the folder
        ).order_by(
            '-created_at', # Prioritize newly created folders
            '-last_note_update', # Then prioritize folders with recently updated notes
            # '-updated_at' # Fallback to folder's own update time
        ).distinct()[:5] # Get top 5 featured folders


# class FolderShareViewSet(viewsets.ModelViewSet):
#     queryset = FolderShare.objects.all()
#     serializer_class = FolderShareSerializer
#     permission_classes = [IsAuthenticated]


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
# consider implementing class based views for importing from multiple other notes apps
@api_view(["POST"])
@permission_classes([IsAuthenticated])
def import_icloud_notes(request):
    icloud_service = ICloudService()
    try:
        icloud_service.connect()
        imported_folders = icloud_service.get_folders()
        # folders_data, debug_info = icloud_service.process_folders(imported_folders, request.user)
        import_result = icloud_service.process_folders(imported_folders, request.user)

        # return JsonResponse(
        #     {
        #         "imported_folders_count": len(folders_data),
        #         # "root_folder": root_folder,
        #         "imported_folders": folders_data,
        #         "debug_info": debug_info
        #     },
        #     status=200,
        # )
        return JsonResponse(import_result, status=200)

    except Exception as e:
        return JsonResponse(
            {
                "status": "error",
                "message": str(e),
                # "traceback": e.traceback,
                "error_location": f"{e.__traceback__.tb_frame.f_code.co_filename}:{e.__traceback__.tb_lineno}",
                # "debug_info": e.debug_info,
            },
            status=500,
        )
