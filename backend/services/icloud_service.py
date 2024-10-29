import os
import sys
import traceback
from pyicloud import PyiCloudService
from pyicloud.exceptions import PyiCloudFailedLoginException
from api.serializers import FolderSerializer, NoteSerializer
from api.models import Note, Folder
from django.db.models import Q
from django.db import transaction
import uuid
from django.utils import timezone


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
            import_id = str(uuid.uuid4())
            summary = {
                "totalFolders": 0,
                "newFolders": 0,
                "totalNotes": 0,
                "newNotes": 0,
                "rootFolders": 0,
            }
            # Create root import folder
            root_folder, _ = Folder.objects.get_or_create(
                name="Apple Notes Import", author=user
            )
            # Create folder map keyed by import recordName
            folder_map = {}
            # use root import folder for default parent
            # folder_map = {root_folder.name: {"folder": root_folder}}
            cleaned_folders = self.clean_folders(imported_folders)

            # First pass: Create folder objects and build the map
            for imported_folder in cleaned_folders:
                record_name = imported_folder.get("recordName")
                folder_title = imported_folder["fields"]["title"]

                folder, created = Folder.objects.get_or_create(
                    name=folder_title, author=user
                )

                folder_map[record_name] = {
                    "folder": folder,
                    "imported_data": imported_folder,
                }

                summary["totalFolders"] += 1
                if created:
                    summary["newFolders"] += 1

            # Second pass: Set parent relationships using the map
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

            # for imported_folder in cleaned_folders:
            #     folder, created = Folder.objects.get_or_create(
            #         name=imported_folder["fields"]["title"], author=user
            #     )
            #     summary["totalFolders"] += 1
            #     if created:
            #         summary["newFolders"] += 1

            #     parent_record = imported_folder.get("parent", {}).get("recordName")
            #     if parent_record:
            #         parent_folder = Folder.objects.filter(
            #             name=imported_folders[parent_record]["fields"]["title"],
            #             author=user,
            #         ).first()
            #         folder.parent = parent_folder or root_folder
            #     else:
            #         folder.parent = root_folder
            #         summary["rootFolders"] += 1

            #     folder.save()

            #     notes_count, new_notes_count = self.process_notes(
            #         imported_folder, folder, user
            #     )
            #     summary["totalNotes"] += notes_count
            #     summary["newNotes"] += new_notes_count

            response = {
                # "status": "success",
                # "message": "Import completed successfully.",
                "importId": import_id,
                "timestamp": timezone.now().isoformat(),
                "summary": summary,
                # "nextSteps": {
                #     "action": "Fetch folder structure",
                #     "endpoint": "/api/folders/structure",
                # },
            }

            return response

        except Exception as e:
            transaction.set_rollback(True)
            error_message = f"Unexpected error in process_folders: {str(e)}"
            raise ICloudProcessingError(
                error_message, debug_info={"traceback": traceback.format_exc()}
            )

    # @transaction.atomic
    # def process_folders(self, imported_folders, user):
    #     try:
    #         debug_info = {}
    #         cleaned_folders = self.clean_folders(imported_folders)
    #         folder_map = {}
    #         serialized_folders = []
    #         response_data = []
    #         # Creact root import folder
    #         root_folder, _ = Folder.objects.get_or_create(
    #             name="Apple Notes Import", author=user
    #         )
    #         folder_map[root_folder.name] = {
    #             "db_object": root_folder,
    #             "serialized": FolderSerializer(root_folder).data,
    #             "children": [],
    #         }

    #         # First pass: create all folders and map them by icloud record name
    #         # folder_map, map_debug_info = self.create_folder_map(cleaned_folders, user)
    #         # debug_info["map_debug"] = map_debug_info
    #         for imported_folder in cleaned_folders:
    #             folder, created = Folder.objects.get_or_create(
    #                 name=imported_folder["fields"]["title"], author=user
    #             )
    #             serialized_folder = FolderSerializer(folder).data
    #             folder_map[imported_folder["recordName"]] = {
    #                 "db_object": folder,
    #                 "serialized": serialized_folder,
    #                 "children": [],
    #             }

    #         # Second pass: set correct parent relationships and process notes
    #         for imported_folder in cleaned_folders:
    #             folder_debug_info = {}
    #             try:
    #                 folder_data = folder_map[imported_folder["recordName"]]
    #                 parent_record = imported_folder.get("parent", {}).get("recordName")

    #                 if parent_record and parent_record in folder_map:
    #                     # folder.parent = folder_map[parent_record]
    #                     parent_data = folder_map[parent_record]
    #                     folder_data["db_object"].parent = parent_data["db_object"]
    #                     parent_data["children"].append(folder_data["serialized"]["id"])
    #                 else:
    #                     # folder.parent = folder_map["Apple Notes Import"]
    #                     folder_data["db_object"].parent = root_folder
    #                     folder_map[root_folder.name]["children"].append(
    #                         folder_data["serialized"]["id"]
    #                     )

    #                 folder_data["db_object"].save()
    #                 # folder.save()

    #                 # TODO: do something with notes data
    #                 notes_data = self.process_notes(imported_folder, folder, user)

    #                 # Add the serialized folder data to the response list
    #                 # folder_data["serialized"]["children"] = folder_data["children"]
    #                 # serialized_folders.append(folder_data["serialized"])

    #             except Exception as e:
    #                 raise ICloudProcessingError(
    #                     f"Error processing folder: {str(e)}",
    #                     debug_info=folder_debug_info,
    #                 )

    #         # Now with all parent relationships set, serialize all folders for response data
    #         # all_folders = Folder.objects.filter(author=user)
    #         # serialized_folders = FolderSerializer(all_folders, many=True).data

    #         # Build final response data
    #         # for folder_data in folder_map.values():
    #         #     folder_data["serialized"]["children"] = folder_data["children"]
    #         #     serialized_folders.append(folder_data["serialized"])

    #         return serialized_folders, debug_info

    #     except Exception as e:
    #         transaction.set_rollback(True)
    #         error_message = f"Unexpected error in process_folders: {str(e)}"

    #         raise ICloudProcessingError(error_message, debug_info)

    # def create_folder_map(self, cleaned_folders, user):
    #     root_folder, _ = Folder.objects.get_or_create(
    #         name="Apple Notes Import", author=user
    #     )
    #     folder_map = {root_folder.name: root_folder}
    #     map_debug_info = {}
    #     for imported_folder in cleaned_folders:
    #         try:
    #             folder, _ = Folder.objects.get_or_create(
    #                 name=imported_folder["fields"]["title"],
    #                 author=user,
    #             )
    #             folder_map[imported_folder["recordName"]] = folder

    #         except Exception as e:
    #             raise ICloudProcessingError(
    #                 f"Error creating folder: {str(e)}",
    #                 debug_info={"imported_folder": str(imported_folder)},
    #             )

    #     return folder_map, map_debug_info

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

            except Exception as e:
                # Log the error but continue processing other notes
                # print(f"Error processing note: {str(e)}")
                raise ICloudProcessingError(
                    f"Error processing note: {str(e)}", debug_info={"note": str(note)}
                )

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


class ICloudProcessingError(Exception):
    def __init__(self, message, debug_info=None):
        super().__init__(message)
        self.debug_info = debug_info
        self.traceback = "".join(traceback.format_exception(*sys.exc_info()))
