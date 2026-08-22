from pydantic import BaseModel,Field
from typing import Optional


class SubGroup(BaseModel):
    name : str =Field(max_length=150)
    description : str = Field(min_length=30)
    lead_id: Optional[int] = None
