import unittest
from dotenv import load_dotenv
import os

from pyicloud import PyiCloudService

load_dotenv()

class TestPyiCloudService(unittest.TestCase):
    def setUp(self):
        # Initialize the PyiCloudService with your credentials
        self.apple_id = os.getenv("IC_APPLEID")
        self.password = os.getenv("IC_PWD")
        self.service = PyiCloudService(self.apple_id, self.password)

    def test_webservices(self):
        # Print the available web services
        print("Available web services:")
        for key, service in self.service._webservices.items():
            print(f"- {key}:")
            for sub_key, value in service.items():
                print(f"  {sub_key}: {value}")
        self.assertTrue(isinstance(self.service._webservices, dict))

if __name__ == '__main__':
    unittest.main()