# app/main.py

import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from typing import Dict, Any
from bson import ObjectId
from datetime import datetime

from app.database import init_db, close_db
from app.api.routes_internship import router as internships_router
from app.api.routes_applications import router as applications_router
from app.api.routes_employer_profile import router as employer_profile_router
from app.api.routes_admin import router as admin_router
from app.api.routes_internship_semantic import router as internships_semantic_router
from app.models.internship import Internship
from app.models.application import Application
from app.models.employer_profile import EmployerProfile

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)

logger = logging.getLogger(__name__)

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    logger.info("Starting application...")
    await init_db()
    
    # Initialize FAISS service and embedding service
    try:
        from app.services.faiss_service import get_faiss_service
        from app.services.embedding_service import get_embedding_service
        
        logger.info("Initializing embedding service...")
        embedding_service = get_embedding_service()
        logger.info(f"Embedding service ready (device: {embedding_service.device})")
        
        logger.info("Initializing FAISS service...")
        faiss_service = get_faiss_service()
        logger.info(f"FAISS service ready (index size: {faiss_service.get_index_size()})")
        
        if faiss_service.get_index_size() == 0:
            logger.warning(
                "FAISS index is empty. Run 'python -m app.scripts.init_faiss' "
                "to initialize the index with existing data."
            )
    except Exception as e:
        logger.error(f"Error initializing vector search services: {e}")
        # Don't fail startup - services can still work without embeddings
    
    logger.info("Application started successfully")
    yield
    
    # Shutdown
    logger.info("Shutting down application...")
    
    # Save FAISS index on shutdown
    try:
        from app.services.faiss_service import get_faiss_service
        faiss_service = get_faiss_service()
        faiss_service.save_index()
        logger.info("FAISS index saved")
    except Exception as e:
        logger.error(f"Error saving FAISS index: {e}")
    
    await close_db()
    logger.info("Application shutdown complete")

app = FastAPI(
    title="YuvaSetu Employer Backend",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:8080",  # Employer Portal
        "http://127.0.0.1:8080",
        "http://localhost:8081",  # Admin Portal
        "http://127.0.0.1:8081",
        "http://localhost:3000",  # Student Portal
        "http://127.0.0.1:3000",
        "http://localhost:5173",  # Vite dev server
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(internships_router)
app.include_router(internships_semantic_router)  # Semantic search routes
app.include_router(applications_router)
app.include_router(employer_profile_router)
app.include_router(admin_router)

@app.get("/health")
async def health():
    return {"status": "ok"}


# ============================================================
# MAP ENDPOINTS - REAL-TIME DATABASE CONNECTION
# ============================================================

STATE_CODE_MAP = {
    "Andaman & Nicobar": "IN-AN",
    "Andhra Pradesh": "IN-AP",
    "Arunachal Pradesh": "IN-AR",
    "Assam": "IN-AS",
    "Bihar": "IN-BR",
    "Chandigarh": "IN-CH",
    "Chhattisgarh": "IN-CT",
    "Daman & Diu": "IN-DD",
    "Delhi": "IN-DL",
    "Dadra & Nagar Haveli": "IN-DN",
    "Goa": "IN-GA",
    "Gujarat": "IN-GJ",
    "Himachal Pradesh": "IN-HP",
    "Haryana": "IN-HR",
    "Jharkhand": "IN-JH",
    "Jammu & Kashmir": "IN-JK",
    "Karnataka": "IN-KA",
    "Kerala": "IN-KL",
    "Lakshadweep": "IN-LD",
    "Madhya Pradesh": "IN-MP",
    "Maharashtra": "IN-MH",
    "Meghalaya": "IN-ML",
    "Manipur": "IN-MN",
    "Mizoram": "IN-MZ",
    "Nagaland": "IN-NL",
    "Odisha": "IN-OR",
    "Punjab": "IN-PB",
    "Puducherry": "IN-PY",
    "Rajasthan": "IN-RJ",
    "Sikkim": "IN-SK",
    "Tamil Nadu": "IN-TN",
    "Telangana": "IN-TG",
    "Tripura": "IN-TR",
    "Uttar Pradesh": "IN-UP",
    "Uttarakhand": "IN-UT",
    "West Bengal": "IN-WB"
}

@app.get("/api/map/state-statistics")
async def get_state_statistics() -> Dict[str, Any]:
    """
    Get REAL-TIME state statistics from MongoDB.
    Handles empty database gracefully (returns zeros).
    """
    try:
        logger.info("Fetching REAL-TIME state statistics from MongoDB...")
        
        # Fetch ALL data from MongoDB
        all_internships = await Internship.find_all().to_list()
        all_applications = await Application.find_all().to_list()
        
        logger.info(f"Found {len(all_internships)} internships and {len(all_applications)} applications in database")
        
        # Initialize all states with zero values
        state_stats = {}
        for state_name, state_code in STATE_CODE_MAP.items():
            state_stats[state_code] = {
                "name": state_name,
                "companies": 0,
                "hiredInternships": 0,
                "pmInternships": 0,
                "activeInternships": 0,
                "studentsHired": 0
            }
        
        # Track unique companies per state
        companies_per_state = {}
        
        # Process internships from database
        for internship in all_internships:
            state = internship.state
            if not state:
                logger.debug(f"Internship {internship.id} has no state field")
                continue
                
            # Find matching state code
            state_code = STATE_CODE_MAP.get(state)
            if not state_code:
                logger.warning(f"Unknown state '{state}' in internship {internship.id}")
                continue
            
            # Count active vs closed internships
            if internship.is_active:
                state_stats[state_code]["activeInternships"] += 1
            else:
                state_stats[state_code]["hiredInternships"] += 1
            
            # Track unique companies
            if state_code not in companies_per_state:
                companies_per_state[state_code] = set()
            companies_per_state[state_code].add(internship.owner_uid)
            
            # Count PM/Government internships
            if internship.sector and "Government" in internship.sector:
                state_stats[state_code]["pmInternships"] += 1
            elif internship.title and "PM" in internship.title.upper():
                state_stats[state_code]["pmInternships"] += 1
        
        # Process applications to count students hired
        for application in all_applications:
            if application.status == "selected":
                try:
                    # Get internship to find state
                    internship = await Internship.get(ObjectId(application.internship_id))
                    if internship and internship.state:
                        state_code = STATE_CODE_MAP.get(internship.state)
                        if state_code:
                            state_stats[state_code]["studentsHired"] += 1
                except Exception as e:
                    logger.debug(f"Could not process application {application.id}: {e}")
                    continue
        
        # Set company counts
        for state_code, companies in companies_per_state.items():
            state_stats[state_code]["companies"] = len(companies)
        
        logger.info(f"Successfully generated REAL-TIME statistics for {len(state_stats)} states")
        return {
            "stateStats": state_stats,
            "status": "success",
            "dataSource": "mongodb",
            "timestamp": datetime.utcnow().isoformat()
        }
    
    except Exception as e:
        logger.error(f"Error fetching state statistics: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/api/map/statistics-summary")
async def get_statistics_summary() -> Dict[str, Any]:
    """
    Get REAL-TIME overall summary statistics from MongoDB.
    Handles empty database gracefully.
    """
    try:
        logger.info("Fetching REAL-TIME summary statistics from MongoDB...")
        
        # Get counts from MongoDB
        total_internships = await Internship.count()
        active_internships = await Internship.find({"is_active": True}).count()
        total_applications = await Application.count()
        students_hired = await Application.find({"status": "selected"}).count()
        
        # Get unique companies
        all_internships = await Internship.find_all().to_list()
        unique_companies = set(i.owner_uid for i in all_internships)
        
        # Count PM internships
        pm_internships = 0
        for internship in all_internships:
            if internship.sector and "Government" in internship.sector:
                pm_internships += 1
            elif internship.title and "PM" in internship.title.upper():
                pm_internships += 1
        
        logger.info(f"Summary: {total_internships} internships, {len(unique_companies)} companies, {students_hired} students hired")
        
        return {
            "total_companies": len(unique_companies),
            "total_internships": total_internships,
            "active_internships": active_internships,
            "closed_internships": total_internships - active_internships,
            "pm_internships": pm_internships,
            "total_applications": total_applications,
            "students_hired": students_hired,
            "status": "success",
            "dataSource": "mongodb",
            "timestamp": datetime.utcnow().isoformat()
        }
    
    except Exception as e:
        logger.error(f"Error fetching statistics summary: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=str(e))
