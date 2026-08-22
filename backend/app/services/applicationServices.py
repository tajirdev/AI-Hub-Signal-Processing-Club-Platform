from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from fastapi import HTTPException, status

from app.models import applicationModel
from app.schemas import applicationSchm


class ApplicationService:

    @staticmethod
    def CreateApplication(
        request: applicationSchm.Application,
        db: Session
    ):

      
        existing_email = (
            db.query(applicationModel.Application)
            .filter(
                applicationModel.Application.email
                == request.email
            )
            .first()
        )

        if existing_email:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="An application with this email already exists."
            )

        
        existing_registration = (
            db.query(applicationModel.Application)
            .filter(
                applicationModel.Application.registration_number
                == request.registration_number
            )
            .first()
        )

        if existing_registration:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="An application with this registration number already exists."
            )

        new_application = applicationModel.Application(
            first_name=request.first_name,
            last_name=request.last_name,
            registration_number=request.registration_number,
            programme=request.programme,
            year=request.year,
            email=request.email,
            phone=request.phone,
            motivation=request.motivation,
            status=applicationModel.ApplicationStatus.pending
        )

        try:

            db.add(new_application)
            db.commit()
            db.refresh(new_application)

        except IntegrityError:

            db.rollback()

            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="Application already exists."
            )

        return new_application



    @staticmethod
    def GetApplications(
        db: Session
    ):

        applications = (
            db.query(applicationModel.Application)
            .order_by(
                applicationModel.Application.created_at.desc()
            )
            .all()
        )

        if not applications:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="No applications found."
            )

        return applications

   

    @staticmethod
    def GetApplication(
        applicant_id: int,
        db: Session
    ):

        application = (
            db.query(applicationModel.Application)
            .filter(
                applicationModel.Application.id
                == applicant_id
            )
            .first()
        )

        if not application:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Application with id {applicant_id} not found."
            )

        return application

    

    @staticmethod
    def ReviewApplication(
        applicant_id: int,
        request: applicationSchm.Applicationedite,
        db: Session,
        current_user_id: int
    ):

        application = (
            db.query(applicationModel.Application)
            .filter(
                applicationModel.Application.id
                == applicant_id
            )
            .first()
        )

        if not application:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Application with id {applicant_id} not found."
            )

      
        if (
            application.status
            != applicationModel.ApplicationStatus.pending
        ):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="This application has already been reviewed."
            )

       
        if request.status not in [
            applicationModel.ApplicationStatus.approved,
            applicationModel.ApplicationStatus.rejected
        ]:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Application can only be approved or rejected."
            )

        application.status = request.status
        application.reviewed_by = current_user_id

        db.commit()
        db.refresh(application)

        return application

  

    @staticmethod
    def RemoveApplication(
        applicant_id: int,
        db: Session
    ):

        application = (
            db.query(applicationModel.Application)
            .filter(
                applicationModel.Application.id
                == applicant_id
            )
            .first()
        )

        if not application:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Application with id {applicant_id} not found."
            )

       
        if (
            application.status
            != applicationModel.ApplicationStatus.pending
        ):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Reviewed applications cannot be deleted."
            )

        db.delete(application)
        db.commit()

        return {
            "message": "Application removed successfully."
        }
