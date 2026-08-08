from fastapi import FastAPI,Depends
from app.schemas import test
from sqlalchemy.orm import Session
from app.core.database import get_db,Base,engine
from app.routes import RouterUsers,loginroute,SubGroupRoute,MemberRouter, project,blog_post,category, research
from app.routes import RouterUsers,loginroute,SubGroupRoute,MemberRouter, project,blog_post,category,resource
from app.core import seed_role
from fastapi.staticfiles import StaticFiles




Base.metadata.create_all(engine)


app = FastAPI(title="AI HUB PLATFORM API")

app.include_router(RouterUsers.router)
app.include_router(loginroute.router)
app.include_router(seed_role.router)
app.include_router(SubGroupRoute.router)
app.include_router(resource.router)
app.include_router(blog_post.router)
app.include_router(category.router)
app.include_router(MemberRouter.router)
app.include_router(project.router)





# Mount the static uploads directory
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")
app.include_router(research.router)

