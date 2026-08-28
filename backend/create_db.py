from app.core.database import Base, engine
import app.models  # Ensures all models are registered

print("Creating tables...")
Base.metadata.create_all(bind=engine)
print("Tables created.")
