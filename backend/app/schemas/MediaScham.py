from pydantic import BaseModel, Field


class AvatarResponse(BaseModel):
    original_filename : str 
    path : str = Field(..., alias="path")

    class Config:
        from_attributes = True
        populate_by_name = True
class MediaResponse(BaseModel):
    id: int
    path: str
    original_filename: str

    class Config:
        from_attributes = True

