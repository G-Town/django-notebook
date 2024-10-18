import os
import sys
import traceback
from pyicloud import PyiCloudService
from pyicloud.exceptions import PyiCloudFailedLoginException
from api.serializers import FolderSerializer, NoteSerializer
from api.models import Note, Folder
from django.db.models import Q
from django.db import transaction


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

    def get_folders(self):
        if not self.service:
            self.connect()
        folders = self.service.notes.folders
        return folders

    @transaction.atomic
    def process_folders(self, imported_folders, user):
        try:
            debug_info = {}
            cleaned_folders = self.clean_folders(imported_folders)

            # First pass: create all folders and map them by icloud record name
            folder_map, map_debug_info = self.create_folder_map(cleaned_folders, user)
            debug_info["map_debug"] = map_debug_info

            # Second pass: set correct parent relationships and process notes
            for imported_folder in cleaned_folders:
                folder_debug_info = {}
                try:
                    folder = folder_map[imported_folder["recordName"]]
                    parent_record = imported_folder.get("parent", {}).get("recordName")

                    if parent_record and parent_record in folder_map:
                        folder.parent = folder_map[parent_record]
                    else:
                        folder.parent = folder_map["Apple Notes Import"]

                    folder.save()

                    # TODO: do something with notes data
                    notes_data = self.process_notes(imported_folder, folder, user)

                except Exception as e:
                    raise ICloudProcessingError(
                        f"Error processing folder: {str(e)}",
                        debug_info=folder_debug_info,
                    )

            # Now with all parent relationships set, serialize all folders for response data
            all_folders = Folder.objects.filter(author=user)
            serialized_folders = FolderSerializer(all_folders, many=True).data

            return serialized_folders, debug_info

        except Exception as e:
            transaction.set_rollback(True)
            error_message = f"Unexpected error in process_folders: {str(e)}"

            raise ICloudProcessingError(error_message, debug_info)

    def create_folder_map(self, cleaned_folders, user):
        root_folder, _ = Folder.objects.get_or_create(
            name="Apple Notes Import", author=user
        )
        folder_map = {root_folder.name: root_folder}
        map_debug_info = {}
        for imported_folder in cleaned_folders:
            try:
                folder, _ = Folder.objects.get_or_create(
                    name=imported_folder["fields"]["title"],
                    author=user,
                )
                folder_map[imported_folder["recordName"]] = folder

            except Exception as e:
                raise ICloudProcessingError(
                    f"Error creating folder: {str(e)}",
                    debug_info={"imported_folder": str(imported_folder)},
                )

        return folder_map, map_debug_info

    @transaction.atomic
    def process_notes(self, imported_folder, folder, user):
        notes_data = []
        for note in imported_folder.get("notes", []):
            try:
                full_content = note["fields"]["Text"]["string"]
                title, content = self.split_content(full_content)

                existing_note = Note.objects.filter(
                    Q(author=user) & (Q(title=title) & Q(folder=folder))
                ).first()

                if existing_note:
                    # TODO: reconcile note updates between this app and icloud notes
                    continue

                new_note = Note.objects.create(
                    title=title,
                    content=content,
                    author=user,
                    folder=folder,
                )

                serialized_note = NoteSerializer(new_note)
                notes_data.append(serialized_note.data)

            except Exception as e:
                transaction.set_rollback(True)
                raise ICloudProcessingError(
                    f"Error processing note: {str(e)}", debug_info={"note": str(note)}
                )
        return notes_data

    @staticmethod
    def clean_folders(imported_folders):
        cleaned_folders = []
        for folder in imported_folders:
            if folder["fields"]["title"] == "Recently Deleted":
                continue

            cleaned_notes = []
            for note in folder.get("notes", []):
                if not note["fields"].get("Deleted", {}).get("value", False):
                    cleaned_notes.append(note)

            cleaned_folder = folder.copy()
            cleaned_folder["notes"] = cleaned_notes
            cleaned_folders.append(cleaned_folder)

        return cleaned_folders

    @staticmethod
    def split_content(full_content):
        content_split = full_content.split("\n", 1)
        if len(content_split) > 1:
            return content_split[0], content_split[1]
        return content_split[0], ""


class ICloudProcessingError(Exception):
    def __init__(self, message, debug_info=None):
        super().__init__(message)
        self.debug_info = debug_info
        self.traceback = "".join(traceback.format_exception(*sys.exc_info()))
