# app/main.py
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database import init_db, close_db
from app.api.routes_internship import router as internships_router
from app.api.routes_applications import router as applications_router
from app.api.routes_employer_profile import router as employer_profile_router
from app.api.routes_admin import router as admin_router

@asynccontextmanager
async def lifespan(app: FastAPI):
    await init_db()
    yield
    await close_db()

app = FastAPI(
    title="YuvaSetu Employer Backend",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:8080",      # Employer Portal
        "http://127.0.0.1:8080",
        "http://localhost:8081",      # Admin Portal
        "http://127.0.0.1:8081",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(internships_router)
app.include_router(applications_router)
app.include_router(employer_profile_router)
app.include_router(admin_router)

@app.get("/health")
async def health():
    return {"status": "ok"}
