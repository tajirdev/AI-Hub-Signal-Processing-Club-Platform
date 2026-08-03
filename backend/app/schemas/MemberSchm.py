from pydantic import BaseModel

class Members(BaseModel):
    position : str
    github : str | None = None
    linkedin : str | None = None
    portfolio : str | None = None


