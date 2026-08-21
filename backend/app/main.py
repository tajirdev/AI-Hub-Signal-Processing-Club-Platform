import os
from fastapi import FastAPI,Depends
from app.schemas import test
from sqlalchemy.orm import Session
from app.core.database import get_db,Base,engine
from app.routes import (
    RouterUsers,
    loginroute,
    SubGroupRoute,
    MemberRouter,
    EventRouters,
    project,
    blog_post,
    category,
    resource,
    research,
    news,
)
from app.core import seed_role
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware


app = FastAPI(title="AI HUB PLATFORM API")

# CORS configuration supporting environment-based origins and local dev
raw_origins = os.getenv(
    "CORS_ORIGINS",
    "http://localhost:5173,http://localhost:5174,http://localhost:3000,http://127.0.0.1:5173,http://127.0.0.1:5174,http://127.0.0.1:3000",
)
allowed_origins = [origin.strip() for origin in raw_origins.split(",") if origin.strip()]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(RouterUsers.router)
app.include_router(loginroute.router)
app.include_router(seed_role.router)
app.include_router(SubGroupRoute.router)
app.include_router(resource.router)
app.include_router(research.router)
app.include_router(blog_post.router)
app.include_router(category.router)
app.include_router(MemberRouter.router)
app.include_router(EventRouters.router)
app.include_router(news.router)
app.include_router(project.router)
app.include_router(project.cover_router)




# Mount the static uploads directory
os.makedirs("uploads", exist_ok=True)
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")