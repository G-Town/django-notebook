from services.icloud_sync import ICloudSyncService
from dotenv import load_dotenv
import os


load_dotenv()

def test_icloud_sync():
    apple_id = os.getenv("IC_APPLEID")
    password = os.getenv("IC_PWD")
    icloud_service = ICloudSyncService(apple_id, password)
    notes = icloud_service.fetch_notes()
    for note in notes:
        print(note["title"])
        print(note["snippet"])


if __name__ == "__main__":
    test_icloud_sync()
