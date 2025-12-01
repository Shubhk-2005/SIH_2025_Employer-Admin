from typing import Annotated
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer
from fastapi.security.http import HTTPAuthorizationCredentials
from pydantic import BaseModel
import firebase_admin
from firebase_admin import auth as firebase_auth

security = HTTPBearer()

class EmployerUser(BaseModel):
    uid: str
    email: str

async def get_current_employer(
    credentials: Annotated[HTTPAuthorizationCredentials, Depends(security)]
) -> EmployerUser:
    """
    Dependency to extract & verify the Firebase ID token from the Authorization header.
    Returns an EmployerUser if valid, raises 401 otherwise.
    """
    token = credentials.credentials
    
    try:
        # ✅ Get the EMPLOYER Firebase app
        try:
            employer_app = firebase_admin.get_app('employer')
        except ValueError:
            # Fallback to default app if named app doesn't exist
            employer_app = firebase_admin.get_app()
        
        # ✅ Verify token using EMPLOYER Firebase app
        decoded = firebase_auth.verify_id_token(token, app=employer_app)
        
        uid = decoded.get("uid")
        email = decoded.get("email", "")
        
        if not uid:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid token: missing UID"
            )
        
        return EmployerUser(uid=uid, email=email)
    
    except firebase_admin.exceptions.FirebaseError as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Token verification failed: {str(e)}"
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Authentication error: {str(e)}"
        )
