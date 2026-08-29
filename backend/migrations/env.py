import os
import sys
from logging.config import fileConfig
from sqlalchemy import engine_from_config, pool
from alembic import context

# 1. NEW: Load environment variables (allows using .env)
from dotenv import load_dotenv
load_dotenv()

# 2. NEW: Add your project root to the path so 'app' can be found
sys.path.append(os.path.join(os.getcwd()))

# 3. NEW: Import your Base and Models exactly as requested
from app.core.database import Base
from app.models import *
target_metadata = Base.metadata

# this is the Alembic Config object
config = context.config

# 4. NEW: Overwrite the sqlalchemy.url from alembic.ini with your .env URL
# In alembic/env.py, update step 4:
db_url = os.getenv("DATABASE_URL")
if db_url:
    # If the URL already has %%, don't double escape it.
    # If it only has %, escape it for the ConfigParser.
    if "%%" not in db_url:
        db_url = db_url.replace("%", "%%")
    config.set_main_option("sqlalchemy.url", db_url)

# 5. NEW: Set target_metadata to your models' metadata
target_metadata = Base.metadata

def run_migrations_offline() -> None:
    url = config.get_main_option("sqlalchemy.url")
    context.configure(
        url=url,
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={"paramstyle": "named"},
    )
    with context.begin_transaction():
        context.run_migrations()

def run_migrations_online() -> None:
    # Use the config which now has the URL from our .env
    connectable = engine_from_config(
        config.get_section(config.config_ini_section, {}),
        prefix="sqlalchemy.",
        poolclass=pool.NullPool,
    )

    with connectable.connect() as connection:
        context.configure(
            connection=connection, 
            target_metadata=target_metadata
        )
        with context.begin_transaction():
            context.run_migrations()

if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()