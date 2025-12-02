from pydantic_settings import BaseSettings
from functools import lru_cache

class Settings(BaseSettings):
    MONGODB_URI: str
    MONGODB_DB: str
    FIREBASE_SERVICE_ACCOUNT_PATH: str
    FIREBASE_ADMIN_SERVICE_ACCOUNT_PATH: str
    
    class Config:
        env_file = ".env"
        extra = "ignore"

@lru_cache()
def get_settings() -> "Settings":
    return Settings()

settings = get_settings()
