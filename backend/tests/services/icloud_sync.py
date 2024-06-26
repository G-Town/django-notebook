from pyicloud import PyiCloudService
from pyicloud.exceptions import PyiCloudFailedLoginException


class ICloudSyncService:
    def __init__(self, apple_id, password):
        try:
            self.api = PyiCloudService(apple_id, password)
            if self.api.requires_2fa:
                print("Two-factor authentication required.")
                code = input("Enter the code you received on your devices: ")
                result = self.api.validate_2fa_code(code)
                if not result:
                    print("Failed to verify security code")
                    return
                if not self.api.is_trusted_session:
                    print("Session is not trusted. Requesting trust...")
                    self.api.trust_session()
                    print("Session trusted")
        except PyiCloudFailedLoginException as e:
            print(f"Failed to log in to iCloud: {str(e)}")

    def fetch_notes(self):
        try:
            notes = self.api.notes.records
            # return notes
        except Exception as e:
            print(f"Error fetching notes: {str(e)}")
            return []
        # want note content for notes that are not deleted
        filtered_notes = []
        for note in notes:
            # skip deleted notes
            if "Deleted" in note["fields"] and note["fields"]["Deleted"]["value"]:
                continue
            # Extract title and content
            title = note["fields"]["title"]
            content = note["fields"]["Text"]["string"]
            snippet = note["fields"]["snippet"]
            filtered_notes.append({"title": title, "content": content, "snippet": snippet})

        return filtered_notes
