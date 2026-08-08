from fastapi import UploadFile,HTTPException
from uuid import uuid4
import shutil
import os
from pathlib import Path
from enum import Enum



class UploadCategory(str, Enum):
    PROFILE_PICTURES = "profile_pictures"
    PROJECT_THUMBNAILS = "project_thumbnails"
    BLOG_COVERS = "blog_covers"
    EVENT_COVERS = "event_covers"
    RESEARCH_FILES = "research_files"
    RESOURCES = "resources"
    SUBGROUP_LOGOS = "subgroup_logos"



IMAGE_TYPES = [
    "image/jpeg",
    "image/png",
    "image/webp"
]

PDF_TYPES = [
    "application/pdf"
]

VIDEO_TYPES = [
    "video/mp4",
    "video/webm",
    "video/quicktime"
]

DOCUMENT_TYPES = [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
]

BASE_UPLOAD_DIR = Path("uploads")



def save_upload_file(
    file: UploadFile,
    allowed_types: list[str],
    category: UploadCategory
) -> str:
    """
    Validates and saves a file into its specific subfolder.
    Returns the relative file path as a string (e.g. 'uploads/profile_pictures/uuid.png').
    """
    # 1. Validate MIME type
    if file.content_type not in allowed_types:
        raise HTTPException(
            status_code=400,
            detail=f"File type '{file.content_type}' is not allowed."
        )

    # 2. Determine and create directory dynamically
    target_dir = BASE_UPLOAD_DIR / category.value
    target_dir.mkdir(parents=True, exist_ok=True)

    # 3. Generate unique filename preserving extension
    extension = Path(file.filename).suffix if file.filename else ""
    unique_filename = f"{uuid4()}{extension}"
    file_path = target_dir / unique_filename

    # 4. Save file
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    return str(file_path)




def delete_upload_file(path: str) -> bool:
    """
    Delete a file from storage.

    Returns:
        True if the file was deleted.
        False if the file does not exist.
    """

    file_path = Path(path)

    if file_path.exists():
        file_path.unlink()
        return True

    return False