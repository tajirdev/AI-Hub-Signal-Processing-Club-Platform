from fastapi import FastAPI
from app.core.database import Base, engine
from app.routes.member import router as member_router

# Tengeneza Majedwali kwenye Database kiotomatiki
Base.metadata.create_all(bind=engine)

app = FastAPI(title="AI Hub Platform - Member Module")

# Unganisha Router ya Member
app.include_router(member_router)