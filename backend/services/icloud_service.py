import os
from pyicloud import PyiCloudService
from pyicloud.exceptions import PyiCloudFailedLoginException
from api.serializers import FolderSerializer, NoteSerializer
from api.models import Note, Folder
from django.db.models import Q


class ICloudService:
    def __init__(self):
        self.apple_id = os.getenv("IC_APPLEID")
        self.password = os.getenv("IC_PWD")
        self.service = None

    def connect(self):
        try:
            self.service = PyiCloudService(self.apple_id, self.password)
            if self.service.requires_2fa:
                raise Exception("Two-factor authentication required.")
            return True
        except PyiCloudFailedLoginException:
            raise Exception("Failed to log in to iCloud.")

    def get_notes_and_folders(self):
        if not self.service:
            self.connect()

        notes = self.service.notes.notes
        folders = self.service.notes.folders
        folder_names = [folder["fields"]["title"] for folder in folders]

        return notes, folder_names

    def process_notes(self, notes, user):
        imported_notes = []
        notes_data = []

        folder, _ = Folder.objects.get_or_create(name="Apple Notes Import", author=user)

        for icloud_note in notes:
            if (
                "Deleted" in icloud_note["fields"]
                and icloud_note["fields"]["Deleted"]["value"]
            ):
                continue

            full_content = icloud_note["fields"]["Text"]["string"]
            title, content = self.split_content(full_content)

            # check if the note already exists
            existing_note = Note.objects.filter(
                Q(author=user) & (Q(title=title) & Q(folder=folder))
            ).first()

            # if the note already exists, keep this version
            # TODO: implement some way of reconciling note updates between
            # this app and icloud notes
            # if existing_note:
            #     continue

            note = Note(
                title=title,
                content=content,
                author=user,
                folder=folder,
            )
            note.save()
            imported_notes.append(note)

        # serialize note and folder data
        note_serializer = NoteSerializer(imported_notes, many=True)
        notes_data = note_serializer.data
        folder_serializer = FolderSerializer(folder)
        folder_data = folder_serializer.data

        return notes_data, folder_data

    @staticmethod
    def split_content(full_content):
        content_split = full_content.split("\n", 1)
        if len(content_split) > 1:
            return content_split[0], content_split[1]
        return content_split[0], ""
