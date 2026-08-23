from pydantic import BaseModel

class UserRoleUpdate(BaseModel):
    user_id: int
    role_name: str
