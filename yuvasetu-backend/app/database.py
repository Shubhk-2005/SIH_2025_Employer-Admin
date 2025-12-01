# app/database.py
from motor.motor_asyncio import AsyncIOMotorClient
from beanie import init_beanie
from app.config import settings
from app.models.internship import Internship
from app.models.employer_profile import EmployerProfile
from app.models.application import Application
import firebase_admin
from firebase_admin import credentials
import os

client: AsyncIOMotorClient | None = None

async def init_db() -> None:
    global client
    
    # ✅ Initialize BOTH Firebase projects
    if not firebase_admin._apps:
        # Employer Firebase project
        employer_cred = credentials.Certificate(settings.FIREBASE_SERVICE_ACCOUNT_PATH)
        firebase_admin.initialize_app(employer_cred, name='employer')
        
        # Admin Firebase project
        admin_service_account_path = "./yuvasetu-admin-firebase-adminsdk.json"
        if os.path.exists(admin_service_account_path):
            admin_cred = credentials.Certificate(admin_service_account_path)
            firebase_admin.initialize_app(admin_cred, name='admin')
        else:
            print(f"WARNING: Admin Firebase service account not found at {admin_service_account_path}")
    
    # Initialize MongoDB
    client = AsyncIOMotorClient(settings.MONGODB_URI)
    db = client[settings.MONGODB_DB]
    
    await init_beanie(
        database=db,
        document_models=[
            Internship,
            EmployerProfile,
            Application,
        ],
    )

async def close_db() -> None:
    global client
    if client is not None:
        client.close()
        client = None
