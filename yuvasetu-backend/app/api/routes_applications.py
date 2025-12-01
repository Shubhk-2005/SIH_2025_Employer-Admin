# app/api/routes_applications.py
from typing import List

from fastapi import APIRouter, Depends, Path, HTTPException
from pydantic import BaseModel

from app.models.application import Application
from app.auth.deps import EmployerUser, get_current_employer


router = APIRouter(
    prefix="/employer",
    tags=["employer-applications"],
)


class ApplicationOut(BaseModel):
    id: str
    internship_id: str
    student_uid: str
    status: str  # "applied" | "under_review" | "shortlisted" | "rejected" | "selected"

    @classmethod
    def from_doc(cls, doc: Application) -> "ApplicationOut":
        return cls(
            id=str(doc.id),
            internship_id=doc.internship_id,
            student_uid=doc.student_uid,
            status=doc.status,
        )


class ApplicationStatusUpdate(BaseModel):
    status: str  # "applied" | "under_review" | "shortlisted" | "rejected" | "selected"


@router.get(
    "/internships/{internship_id}/applications",
    response_model=List[ApplicationOut],
)
async def list_applications_for_internship(
    internship_id: str = Path(..., description="Internship ID"),
    employer: EmployerUser = Depends(get_current_employer),
) -> List[ApplicationOut]:
    apps = await Application.find(
        Application.internship_id == internship_id
    ).to_list()
    return [ApplicationOut.from_doc(a) for a in apps]


@router.get(
    "/applications/{app_id}",
    response_model=ApplicationOut,
)
async def get_application(
    app_id: str,
    employer: EmployerUser = Depends(get_current_employer),
) -> ApplicationOut:
    app = await Application.get(app_id)
    if app is None:
        raise HTTPException(status_code=404, detail="Application not found")
    return ApplicationOut.from_doc(app)


@router.patch(
    "/applications/{app_id}",
    response_model=ApplicationOut,
)
async def update_application_status(
    app_id: str,
    payload: ApplicationStatusUpdate,
    employer: EmployerUser = Depends(get_current_employer),
) -> ApplicationOut:
    app = await Application.get(app_id)
    if app is None:
        raise HTTPException(status_code=404, detail="Application not found")

    app.status = payload.status
    await app.save()
    return ApplicationOut.from_doc(app)
