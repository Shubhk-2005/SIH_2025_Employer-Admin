from typing import List
from datetime import datetime
from fastapi import APIRouter, HTTPException, Header
from pydantic import BaseModel
import firebase_admin
from firebase_admin import auth as firebase_auth

from app.models.employer_profile import EmployerProfile
from app.models.internship import Internship
from app.models.application import Application

router = APIRouter(
    prefix="/admin",
    tags=["admin"],
)

# --- Response Models ---
class DashboardStats(BaseModel):
    total_employers: int
    verified_employers: int
    active_internships: int
    total_applications: int

class AdminAuthResponse(BaseModel):
    email: str
    name: str
    uid: str
    role: str

# --- Authentication Endpoint ---

@router.post("/auth/verify", response_model=AdminAuthResponse)
async def verify_admin_token(authorization: str = Header(None)):
    """Verify Firebase admin token"""
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="No token provided")
    
    token = authorization.split("Bearer ")[1]
    
    try:
        # ✅ Use the ADMIN Firebase app to verify tokens
        admin_app = firebase_admin.get_app('admin')
        decoded_token = firebase_auth.verify_id_token(token, app=admin_app)
        email = decoded_token.get('email', '')
        
        # Check if user is admin
        if not (email.endswith('@yuvasetu.gov.in') or email.endswith('@gmail.com')):
            raise HTTPException(status_code=403, detail="Not authorized as admin")
        
        return AdminAuthResponse(
            uid=decoded_token['uid'],
            email=email,
            name=decoded_token.get('name', email.split('@')[0]),
            role='admin'
        )
    except firebase_admin.exceptions.FirebaseError as e:
        raise HTTPException(status_code=401, detail=f"Invalid token: {str(e)}")
    except Exception as e:
        raise HTTPException(status_code=401, detail=f"Authentication failed: {str(e)}")

# --- Dashboard Stats Endpoint ---

@router.get("/stats", response_model=DashboardStats)
async def get_admin_stats():
    """Get platform statistics for Admin Dashboard"""
    total_emp = await EmployerProfile.count()
    verified_emp = await EmployerProfile.find(EmployerProfile.is_verified == True).count()
    active_int = await Internship.find(Internship.is_active == True).count()
    total_app = await Application.count()
    
    return DashboardStats(
        total_employers=total_emp,
        verified_employers=verified_emp,
        active_internships=active_int,
        total_applications=total_app
    )

@router.get("/employers", response_model=List[EmployerProfile])
async def get_all_employers():
    """List all employers for Admin to verify"""
    employers = await EmployerProfile.find_all().sort("-created_at").to_list()
    return employers

@router.put("/employers/{employer_uid}/verify")
async def verify_employer(employer_uid: str):
    """Mark employer as verified"""
    employer = await EmployerProfile.find_one(EmployerProfile.employer_uid == employer_uid)
    if not employer:
        raise HTTPException(status_code=404, detail="Employer not found")
    
    employer.is_verified = True
    employer.updated_at = datetime.utcnow()
    await employer.save()
    return {"message": "Employer verified successfully"}

@router.put("/employers/{employer_uid}/reject")
async def reject_employer(employer_uid: str):
    """Unverify/block employer"""
    employer = await EmployerProfile.find_one(EmployerProfile.employer_uid == employer_uid)
    if not employer:
        raise HTTPException(status_code=404, detail="Employer not found")
    
    employer.is_verified = False
    employer.updated_at = datetime.utcnow()
    await employer.save()
    return {"message": "Employer verification revoked"}
