from app.schemas.category import CategoryCreate,CategoryUpdate
from sqlalchemy.orm import Session
from fastapi import HTTPException,status
from app.models.category import Category



class CategoryService:
    def __init__(self):
        pass

    def create_category(self,data:CategoryCreate,db:Session):
        existing=db.query(Category).filter(Category.name==data.name).first()
        if existing:
            raise HTTPException(status_code=status.HTTP_208_ALREADY_REPORTED,detail="category name already exist")
        category=Category(name=data.name)
        db.add(category)
        db.commit()
        db.refresh(category)
        
        return category

    def show_all_categories(self,db:Session):
        category=db.query(Category).all()
        return category

    def show_single(self,category_id:int,db:Session):
        category=db.query(Category).filter(Category.id==category_id).first()
        if not category:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,detail="category not found")
        return category

    def update_category(self,category_id:int,data:CategoryUpdate,db:Session):
        category=db.query(Category).filter(Category.id==category_id).first()
        if not category:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,detail="category not found")
        existing=db.query(Category).filter(Category.name==data.name, Category.id != category_id).first()
        if existing:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Category name already exists")
        category.name=data.name
        db.commit()
        db.refresh(category)
        return category


    def delete_category(self,category_id:int,db:Session):
        category=db.query(Category).filter(Category.id==category_id).first()
        if not category:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,detail="category not found")
        db.delete(category)
        db.commit()
        return {"message":"category deleted succesesfully"}