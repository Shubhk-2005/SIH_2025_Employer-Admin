# app/auth/deps.py

from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

import firebase_admin
from firebase_admin import credentials, auth as firebase_auth

from app.config import settings

# Initialize Firebase Admin SDK once
if not firebase_admin._apps:
    cred = credentials.Certificate(settings.FIREBASE_SERVICE_ACCOUNT_PATH)
    firebase_admin.initialize_app(cred)


# Only accept "Bearer" tokens
security = HTTPBearer(auto_error=True)


class EmployerUser:
    """
    Represents the authenticated employer from Firebase.
    """

    def __init__(self, uid: str, email: str | None):
        self.uid = uid
        self.email = email


async def get_current_employer(
    credentials: HTTPAuthorizationCredentials = Depends(security),
) -> EmployerUser:
    """
    Verify Firebase ID token from Authorization header and return EmployerUser.
    Expects header: Authorization: Bearer <ID_TOKEN>
    """
    if credentials.scheme.lower() != "bearer":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid auth scheme",
        )

    token = credentials.credentials

    try:
        # verify_id_token validates signature, expiry, audience, etc.
        decoded = firebase_auth.verify_id_token(token)
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token",
        )

    uid = decoded.get("uid")
    email = decoded.get("email")

    if not uid:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token payload",
        )

    return EmployerUser(uid=uid, email=email)
# You can now use get_current_employer as a dependency in your FastAPI routes to protect endpoints and access the authenticated employer's info.