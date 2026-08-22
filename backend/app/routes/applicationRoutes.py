from fastapi import APIRouter,Depends
from app.core.database import get_db
from app.schemas import applicationSchm
from app.schemas.onboardingSchm import ApplicationOnboarding
from app.services import applicationServices
from app.services.onboarding_service import OnboardingService
from sqlalchemy.orm import Session
from app.models import ModoleUsers
from app.core.RoleAuth import RoleChecker
from typing import List
admin_required = RoleChecker(["super_admin"])


service = applicationServices.ApplicationService
router = APIRouter(
    tags=["APPLICATION"],
    prefix="/application"
)

@router.post("/",response_model=applicationSchm.ApplicationResponce)
def PostApplication(
    request:applicationSchm.Application,
    db:Session=Depends(get_db)
):
    return service.CreateApplication(request,db)


@router.post("/onboarding")
def CompleteOnboarding(
    request: ApplicationOnboarding,
    db: Session = Depends(get_db)
):
    return OnboardingService.complete_onboarding(request, db)


@router.get("/",response_model=List[applicationSchm.ApplicationResponce])
def RerurnApplications(
    db:Session=Depends(get_db),
    current_user:ModoleUsers.Users=Depends(admin_required)
):
    return service.GetApplications(db)

@router.get("/{applicant_id}")
def ReturnApplicant(
    applicant_id:int,
    db:Session=Depends(get_db),
    current_user:ModoleUsers.Users=Depends(admin_required)
):
    return service.GetApplication(applicant_id,db)


@router.put("/{applicant_id}",response_model=applicationSchm.ApplicationResponce)
def PutApplicant(
    applicant_id:int,
    request:applicationSchm.Applicationedite,
    db:Session=Depends(get_db),
    current_user:ModoleUsers.Users=Depends(admin_required)
):
    return service.ReviewApplication(applicant_id,request,db,current_user_id=current_user.id)

@router.delete("/{applicant_id}")
def DeleteApplicant(
    applicant_id:int,
    db:Session=Depends(get_db),
    current_user:ModoleUsers.Users=Depends(admin_required)

):
    return service.RemoveApplication(applicant_id,db)
