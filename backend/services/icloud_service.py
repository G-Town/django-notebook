import os
import sys
import traceback
import logging
from pyicloud import PyiCloudService
from pyicloud.exceptions import (
    PyiCloudFailedLoginException,
    PyiCloudAPIResponseException,
)
from api.models import Note, Folder
from django.db import transaction
import uuid
from django.utils import timezone

# from django.db.models import Q

# Configure logging
logger = logging.getLogger(__name__)


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
        try:
            folders = self.service.notes.folders

            if not folders:
                logger.error("No folders retrieved from iCloud Notes service")
                raise PyiCloudAPIResponseException(
                    reason=f"No folders retrieved from iCloud Notes service.",
                    code="EMPTY_FOLDERS",
                )

            logger.info(f"Retrieved {len(folders)} folders from iCloud")
            return folders

        except Exception as e:
            logger.error("Error retrieving folders", exc_info=True)
            raise

    @transaction.atomic
    def process_folders(self, imported_folders, user):
        import_id = str(uuid.uuid4())
        logger.info(f"Starting folder processing with import ID: {import_id}")
        summary = {
            "totalFolders": 0,
            "newFolders": 0,
            "totalNotes": 0,
            "newNotes": 0,
            "rootFolders": 0,
        }
        try:
            root_folder, created = Folder.objects.get_or_create(
                name="iCloud Import", author=user, imported_at=timezone.now()
            )
            # Set imported_at after creation
            if created:
                root_folder.imported_at = timezone.now()
                root_folder.save()

            logger.debug(f"Root folder {'created' if created else 'retrieved'}")

            # First pass: clean imported folder record data
            cleaned_folders = self.clean_folders(imported_folders)
            logger.info(f"Cleaned {len(cleaned_folders)} folders")

            # Second pass: Create folder objects and build folder map
            folder_map = {}
            for imported_folder in cleaned_folders:
                folder_title = imported_folder["fields"]["title"]
                folder, created = Folder.objects.get_or_create(
                    name=folder_title,
                    author=user,
                )
                # if it was newly created, set imported_at
                if created:
                    folder.imported_at = timezone.now()
                    folder.save() # Save the change to imported_at

                record_name = imported_folder.get("recordName")
                folder_map[record_name] = {
                    "folder": folder,
                    "imported_data": imported_folder,
                }

                summary["totalFolders"] += 1
                if created:
                    summary["newFolders"] += 1
                    logger.debug(f"Created new folder: {folder_title}")

            # Third pass: Set parent relationships using the map
            for record_name, folder_data in folder_map.items():
                folder = folder_data["folder"]
                imported_folder = folder_data["imported_data"]

                parent_record = imported_folder.get("parent", {}).get("recordName")

                if parent_record and parent_record in folder_map:
                    folder.parent = folder_map[parent_record]["folder"]
                else:
                    folder.parent = root_folder
                    summary["rootFolders"] += 1

                folder.save()

                # Process notes for this folder
                notes_count, new_notes_count = self.process_notes(
                    imported_folder, folder, user
                )
                summary["totalNotes"] += notes_count
                summary["newNotes"] += new_notes_count

            logger.info("Import completed successfully", extra={"summary": summary})
            return {
                "importId": import_id,
                "timestamp": timezone.now().isoformat(),
                "summary": summary,
            }

        except Exception as e:
            logger.error(
                "Failed to process folders",
                exc_info=True,
                extra={"import_id": import_id},
            )
            transaction.set_rollback(True)
            raise

    @transaction.atomic
    def process_notes(self, imported_folder, folder, user):
        notes_count = 0
        new_notes_count = 0
        for imported_note in imported_folder.get("notes", []):
            try:
                full_content = imported_note["fields"]["Text"]["string"]
                title, content = self.split_content(full_content)

                note, created = Note.objects.get_or_create(
                    title=title,
                    content=content,
                    author=user,
                    folder=folder,
                )
                notes_count += 1
                if created:
                    new_notes_count += 1
                    note.imported_at = timezone.now()
                    note.save() # Save the change to imported_at

            except Exception as e:
                logger.error(
                    "Error processing note",
                    exc_info=True,
                    extra={
                        "folder": folder.name,
                        "note_title": title if "title" in locals() else "Unknown",
                    },
                )
                transaction.set_rollback(True)
                raise

        return notes_count, new_notes_count

    # @transaction.atomic
    # def process_notes(self, imported_folder, folder, user):
    #     notes_data = []
    #     for note in imported_folder.get("notes", []):
    #         try:
    #             full_content = note["fields"]["Text"]["string"]
    #             title, content = self.split_content(full_content)

    #             existing_note = Note.objects.filter(
    #                 Q(author=user) & (Q(title=title) & Q(folder=folder))
    #             ).first()

    #             if existing_note:
    #                 # TODO: reconcile note updates between this app and icloud notes
    #                 continue

    #             new_note = Note.objects.create(
    #                 title=title,
    #                 content=content,
    #                 author=user,
    #                 folder=folder,
    #             )

    #             serialized_note = NoteSerializer(new_note)
    #             notes_data.append(serialized_note.data)

    #         except Exception as e:
    #             transaction.set_rollback(True)
    #             raise ICloudProcessingError(
    #                 f"Error processing note: {str(e)}", debug_info={"note": str(note)}
    #             )
    #     return notes_data

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
