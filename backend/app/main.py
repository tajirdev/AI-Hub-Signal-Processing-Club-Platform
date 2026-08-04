from fastapi import FastAPI,Depends
from app.schemas import test
from sqlalchemy.orm import Session
from app.core.database import get_db,Base,engine
from app.routes import RouterUsers,loginroute,SubGroupRoute,MemberRouter
from app.core import seed_role




Base.metadata.create_all(engine)


app = FastAPI()

app.include_router(RouterUsers.router)
app.include_router(loginroute.router)
app.include_router(seed_role.router)
app.include_router(SubGroupRoute.router)
app.include_router(MemberRouter.router)

