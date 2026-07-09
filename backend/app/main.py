from fastapi import FastAPI,Depends
from app.schemas import test
from sqlalchemy.orm import Session
from app.core.database import get_db,Base,engine
from app.models import modeltest 
from app.routes import RouterUsers




Base.metadata.create_all(engine)


app = FastAPI()

app.include_router(RouterUsers.router)

