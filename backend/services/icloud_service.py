import os
from api.models import Note, Folder
from pyicloud import PyiCloudService
from pyicloud.exceptions import PyiCloudFailedLoginException


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
        for icloud_note in notes:
            if (
                "Deleted" in icloud_note["fields"]
                and icloud_note["fields"]["Deleted"]["value"]
            ):
                continue

            full_content = icloud_note["fields"]["Text"]["string"]
            title, content = self.split_content(full_content)

            folder, _ = Folder.objects.get_or_create(name="Imported", author=user)

            note = Note(
                title=title,
                content=content,
                author=user,
                folder=folder,
            )
            note.save()
            imported_notes.append(note)

        return imported_notes

    @staticmethod
    def split_content(full_content):
        content_split = full_content.split("\n", 1)
        if len(content_split) > 1:
            return content_split[0], content_split[1]
        return content_split[0], ""
