from fastapi import APIRouter,Depends
from app.core.database import get_db
from sqlalchemy.orm import Session
from app.schemas.research import ResearchCreate,ResearchResponse,Researchupdate
from app.services.research import ResearchServices
from app.models.ModoleUsers import Users
from app.core.RoleAuth import RoleChecker


member_required=RoleChecker(["member","editor","super_admin"])
editor_required=RoleChecker(["editor","super_admin"])


router=APIRouter(prefix="/research",tags=["Research"])


@router.post("/",response_model=ResearchResponse)
def New_research(data:ResearchCreate,db:Session=Depends(get_db),
           current_user:Users=Depends(editor_required)):
    return ResearchServices.addresearch(data,db,current_user)

@router.get("/",response_model=list[ResearchResponse])
def show_all(db:Session=Depends(get_db),current_user:Users=Depends(member_required),
            page:int=1,search:str=None,
            limit:int=10,title:str=None,
            sort:str="publication_date",
            order:str="desc"
            ):
    return ResearchServices.show_all(db,current_user)

@router.get("/{research_id}",response_model=ResearchResponse)
def show_by_id(resarch_id:int,db:Session=Depends(get_db),current_user:Users=Depends(member_required)):
    return ResearchServices.show_by_id(resarch_id,db,current_user)

@router.put("/{research_id}",response_model=ResearchResponse)
def update(research_id:int,data:Researchupdate,db:Session=Depends(get_db),current_user:Users=Depends(editor_required)):
    return ResearchServices.update(research_id,data,db,current_user)

@router.delete("/{reserearch_id}")
def delete(research_id:int,db:Session=Depends(get_db),current_user:Users=Depends(editor_required)):
    return ResearchServices.deleteresource(research_id,db,current_user)