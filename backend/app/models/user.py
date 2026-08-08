from sqlalchemy.orm import relationship

resources = relationship("Resource", back_populates="uploader", cascade="all, delete")