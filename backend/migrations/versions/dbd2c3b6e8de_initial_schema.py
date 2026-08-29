"""initial_schema

Revision ID: dbd2c3b6e8de
Revises: 
Create Date: 2026-08-22 13:11:46.697780

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'dbd2c3b6e8de'
down_revision: Union[str, Sequence[str], None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    # 1. CREATE INDEPENDENT TABLES FIRST
    op.create_table('categories',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('name', sa.String(length=100), nullable=False),
    sa.Column('created_at', sa.DateTime(), nullable=True),
    sa.Column('updated_at', sa.DateTime(), nullable=True),
    sa.PrimaryKeyConstraint('id'),
    sa.UniqueConstraint('name')
    )
    
    op.create_table('role',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('name', sa.String(), nullable=True),
    sa.Column('description', sa.String(), nullable=True),
    sa.PrimaryKeyConstraint('id')
    )
    
    op.create_table('test',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('name', sa.String(), nullable=True),
    sa.Column('test', sa.String(), nullable=True),
    sa.PrimaryKeyConstraint('id')
    )

    # 2. CREATE USERS WITHOUT THE AVATAR FOREIGN KEY (Breaks circular dependency)
    op.create_table('users',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('first_name', sa.String(length=100), nullable=True),
    sa.Column('last_name', sa.String(length=100), nullable=True),
    sa.Column('email', sa.String(), nullable=False),
    sa.Column('user_name', sa.String(length=100), nullable=False),
    sa.Column('password_hash', sa.String(), nullable=True),
    sa.Column('phone', sa.String(), nullable=True),
    sa.Column('avatar_id', sa.Integer(), nullable=True),
    sa.Column('bio', sa.String(), nullable=True),
    sa.Column('is_active', sa.Boolean(), nullable=False),
    sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
    sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
    sa.PrimaryKeyConstraint('id'),
    sa.UniqueConstraint('email'),
    sa.UniqueConstraint('user_name')
    )

    # 3. CREATE MEDIA (References users)
    op.create_table('media',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('filename', sa.String(length=225), nullable=False),
    sa.Column('original_filename', sa.String(length=150), nullable=False),
    sa.Column('path', sa.String(), nullable=False),
    sa.Column('mime_type', sa.String(), nullable=True),
    sa.Column('uploaded_by', sa.Integer(), nullable=True),
    sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=True),
    sa.ForeignKeyConstraint(['uploaded_by'], ['users.id'], ondelete='CASCADE'),
    sa.PrimaryKeyConstraint('id'),
    sa.UniqueConstraint('filename')
    )

    # 4. ADD FOREIGN KEY BACK TO USERS NOW THAT MEDIA EXISTS
    op.create_foreign_key(
        'fk_users_avatar_id_media', 'users', 'media', 
        ['avatar_id'], ['id'], ondelete='CASCADE'
    )

    # 5. CREATE ALL DEPENDENT TABLES
    op.create_table('applications',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('first_name', sa.String(length=50), nullable=False),
    sa.Column('last_name', sa.String(length=50), nullable=False),
    sa.Column('registration_number', sa.Integer(), nullable=False),
    sa.Column('programme', sa.String(length=150), nullable=False),
    sa.Column('year', sa.Integer(), nullable=False),
    sa.Column('email', sa.String(length=255), nullable=False),
    sa.Column('phone', sa.String(length=20), nullable=False),
    sa.Column('motivation', sa.String(), nullable=True),
    sa.Column('status', sa.Enum('pending', 'approved', 'rejected', name='applicationstatus'), nullable=False),
    sa.Column('reviewed_by', sa.Integer(), nullable=True),
    sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
    sa.ForeignKeyConstraint(['reviewed_by'], ['users.id'], ondelete='SET NULL'),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_applications_email'), 'applications', ['email'], unique=False)
    op.create_index(op.f('ix_applications_id'), 'applications', ['id'], unique=False)
    op.create_index(op.f('ix_applications_registration_number'), 'applications', ['registration_number'], unique=True)
    
    op.create_table('blog_posts',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('title', sa.String(length=150), nullable=False),
    sa.Column('slug', sa.String(length=180), nullable=False),
    sa.Column('excerpt', sa.String(length=500), nullable=True),
    sa.Column('content', sa.Text(), nullable=True),
    sa.Column('featured_image_id', sa.Integer(), nullable=True),
    sa.Column('status', sa.Enum('draft', 'published', name='poststatus'), nullable=True),
    sa.Column('published_at', sa.DateTime(), nullable=True),
    sa.Column('author_id', sa.Integer(), nullable=False),
    sa.Column('created_at', sa.DateTime(), nullable=True),
    sa.Column('updated_at', sa.DateTime(), nullable=True),
    sa.ForeignKeyConstraint(['author_id'], ['users.id'], ondelete='CASCADE'),
    sa.ForeignKeyConstraint(['featured_image_id'], ['media.id'], ),
    sa.PrimaryKeyConstraint('id'),
    sa.UniqueConstraint('slug')
    )
    op.create_index(op.f('ix_blog_posts_excerpt'), 'blog_posts', ['excerpt'], unique=False)
    
    op.create_table('events',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('title', sa.String(length=100), nullable=False),
    sa.Column('description', sa.Text(), nullable=False),
    sa.Column('location', sa.String(), nullable=True),
    sa.Column('event_date', sa.Date(), nullable=False),
    sa.Column('registration_link', sa.String(length=225), nullable=True),
    sa.Column('cover_image_id', sa.Integer(), nullable=True),
    sa.Column('category_id', sa.Integer(), nullable=True),
    sa.Column('status', sa.Enum('published', 'draft', name='eventstatus'), nullable=False),
    sa.Column('created_by', sa.Integer(), nullable=True),
    sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
    sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
    sa.Column('published_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=True),
    sa.ForeignKeyConstraint(['category_id'], ['categories.id'], ondelete='SET NULL'),
    sa.ForeignKeyConstraint(['cover_image_id'], ['media.id'], ),
    sa.ForeignKeyConstraint(['created_by'], ['users.id'], ondelete='CASCADE'),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_events_created_by'), 'events', ['created_by'], unique=False)
    op.create_index(op.f('ix_events_event_date'), 'events', ['event_date'], unique=False)
    op.create_index(op.f('ix_events_status'), 'events', ['status'], unique=False)
    
    op.create_table('news',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('title', sa.String(), nullable=False),
    sa.Column('slug', sa.String(), nullable=False),
    sa.Column('summary', sa.Text(), nullable=True),
    sa.Column('content', sa.String(), nullable=False),
    sa.Column('news_type', sa.String(), nullable=True),
    sa.Column('category_id', sa.Integer(), nullable=True),
    sa.Column('status', sa.Enum('draft', 'published', name='statuscheck'), nullable=True),
    sa.Column('author_id', sa.Integer(), nullable=True),
    sa.Column('published_at', sa.DateTime(), nullable=True),
    sa.Column('created_at', sa.DateTime(), nullable=True),
    sa.Column('updated_at', sa.DateTime(), nullable=True),
    sa.ForeignKeyConstraint(['author_id'], ['users.id'], ondelete='CASCADE'),
    sa.ForeignKeyConstraint(['category_id'], ['categories.id'], ondelete='CASCADE'),
    sa.PrimaryKeyConstraint('id')
    )
    
    op.create_table('projects',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('title', sa.String(length=100), nullable=False),
    sa.Column('description', sa.Text(), nullable=False),
    sa.Column('repository_url', sa.String(), nullable=True),
    sa.Column('demo_url', sa.String(), nullable=True),
    sa.Column('thumbnail_id', sa.Integer(), nullable=True),
    sa.Column('status', sa.String(), nullable=True),
    sa.Column('technology_stack', sa.String(), nullable=True),
    sa.Column('created_by', sa.Integer(), nullable=False),
    sa.Column('created_at', sa.DateTime(), nullable=True),
    sa.Column('updated_at', sa.DateTime(), nullable=True),
    sa.ForeignKeyConstraint(['created_by'], ['users.id'], ),
    sa.ForeignKeyConstraint(['thumbnail_id'], ['media.id'], ondelete='CASCADE'),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_projects_id'), 'projects', ['id'], unique=False)
    op.create_index(op.f('ix_projects_title'), 'projects', ['title'], unique=False)
    
    op.create_table('researchs',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('title', sa.String(), nullable=False),
    sa.Column('slug', sa.String(), nullable=False),
    sa.Column('abstract', sa.String(), nullable=True),
    sa.Column('content', sa.Text(), nullable=True),
    sa.Column('publication_date', sa.DateTime(), nullable=True),
    sa.Column('pdf_url', sa.String(), nullable=True),
    sa.Column('created_by', sa.Integer(), nullable=False),
    sa.Column('featured', sa.String(), nullable=True),
    sa.Column('created_at', sa.DateTime(), nullable=True),
    sa.Column('updated_at', sa.DateTime(), nullable=True),
    sa.ForeignKeyConstraint(['created_by'], ['users.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    
    op.create_table('sub_groups',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('name', sa.String(length=25), nullable=False),
    sa.Column('slug', sa.String(length=100), nullable=False),
    sa.Column('description', sa.String(length=1000), nullable=True),
    sa.Column('icon_id', sa.Integer(), nullable=True),
    sa.Column('cover_page_id', sa.Integer(), nullable=True),
    sa.Column('lead_id', sa.Integer(), nullable=True),
    sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
    sa.Column('upadated_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
    sa.ForeignKeyConstraint(['cover_page_id'], ['media.id'], ondelete='CASCADE'),
    sa.ForeignKeyConstraint(['icon_id'], ['media.id'], ondelete='CASCADE'),
    sa.ForeignKeyConstraint(['lead_id'], ['users.id'], ondelete='CASCADE'),
    sa.PrimaryKeyConstraint('id'),
    sa.UniqueConstraint('name'),
    sa.UniqueConstraint('slug')
    )
    
    op.create_table('userrole',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('user_id', sa.Integer(), nullable=True),
    sa.Column('role_id', sa.Integer(), nullable=True),
    sa.ForeignKeyConstraint(['role_id'], ['role.id'], ),
    sa.ForeignKeyConstraint(['user_id'], ['users.id'], ondelete='CASCADE'),
    sa.PrimaryKeyConstraint('id')
    )
    
    op.create_table('blog_categories',
    sa.Column('blog_id', sa.Integer(), nullable=False),
    sa.Column('Category_id', sa.Integer(), nullable=False),
    sa.ForeignKeyConstraint(['Category_id'], ['categories.id'], ondelete='CASCADE'),
    sa.ForeignKeyConstraint(['blog_id'], ['blog_posts.id'], ondelete='CASCADE'),
    sa.PrimaryKeyConstraint('blog_id', 'Category_id')
    )
    
    op.create_table('members',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('user_id', sa.Integer(), nullable=True),
    sa.Column('subgroup_id', sa.Integer(), nullable=True),
    sa.Column('position', sa.String(length=25), nullable=True),
    sa.Column('github', sa.String(), nullable=True),
    sa.Column('linkedin', sa.String(), nullable=True),
    sa.Column('portfolio', sa.String(), nullable=True),
    sa.Column('show_profile', sa.Boolean(), nullable=False),
    sa.Column('joined_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=True),
    sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=True),
    sa.ForeignKeyConstraint(['subgroup_id'], ['sub_groups.id'], ),
    sa.ForeignKeyConstraint(['user_id'], ['users.id'], ondelete='CASCADE'),
    sa.PrimaryKeyConstraint('id')
    )
    
    op.create_table('resources',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('title', sa.String(length=100), nullable=False),
    sa.Column('description', sa.Text(), nullable=True),
    sa.Column('type', sa.String(length=30), nullable=False),
    sa.Column('file_url', sa.String(length=500), nullable=True),
    sa.Column('external_url', sa.String(length=500), nullable=True),
    sa.Column('subgroup_id', sa.Integer(), nullable=False),
    sa.Column('uploaded_by', sa.Integer(), nullable=False),
    sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
    sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
    sa.CheckConstraint('file_url IS NOT NULL OR external_url IS NOT NULL', name='check_file_or_external_url'),
    sa.ForeignKeyConstraint(['subgroup_id'], ['sub_groups.id'], ),
    sa.ForeignKeyConstraint(['uploaded_by'], ['users.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_resources_id'), 'resources', ['id'], unique=False)
    
    op.create_table('research_authors',
    sa.Column('research_id', sa.Integer(), nullable=False),
    sa.Column('member_id', sa.Integer(), nullable=False),
    sa.Column('author_order', sa.Integer(), nullable=False),
    sa.ForeignKeyConstraint(['member_id'], ['members.id'], ondelete='CASCADE'),
    sa.ForeignKeyConstraint(['research_id'], ['researchs.id'], ondelete='CASCADE'),
    sa.PrimaryKeyConstraint('research_id', 'member_id')
    )


def downgrade() -> None:
    """Downgrade schema."""
    # 1. DROP DEPENDENT TABLES (Reverse order)
    op.drop_table('research_authors')
    op.drop_index(op.f('ix_resources_id'), table_name='resources')
    op.drop_table('resources')
    op.drop_table('members')
    op.drop_table('blog_categories')
    op.drop_table('userrole')
    op.drop_table('sub_groups')
    op.drop_table('researchs')
    op.drop_index(op.f('ix_projects_title'), table_name='projects')
    op.drop_index(op.f('ix_projects_id'), table_name='projects')
    op.drop_table('projects')
    op.drop_table('news')
    op.drop_index(op.f('ix_events_status'), table_name='events')
    op.drop_index(op.f('ix_events_event_date'), table_name='events')
    op.drop_index(op.f('ix_events_created_by'), table_name='events')
    op.drop_table('events')
    op.drop_index(op.f('ix_blog_posts_excerpt'), table_name='blog_posts')
    op.drop_table('blog_posts')
    op.drop_index(op.f('ix_applications_registration_number'), table_name='applications')
    op.drop_index(op.f('ix_applications_id'), table_name='applications')
    op.drop_index(op.f('ix_applications_email'), table_name='applications')
    op.drop_table('applications')

    # 2. DROP THE CIRCULAR FOREIGN KEY FIRST
    op.drop_constraint('fk_users_avatar_id_media', 'users', type_='foreignkey')

    # 3. DROP BASE TABLES
    op.drop_table('media')
    op.drop_table('users')
    op.drop_table('test')
    op.drop_table('role')
    op.drop_table('categories')