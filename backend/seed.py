import sys
import random
from faker import Faker
from app.core.database import SessionLocal
from app.models.ModoleUsers import Users
from app.models.SubGroupModel import SubGroup
from app.models.ModoleMembers import Members
from app.models.project import Project
from app.models.research import Research, ResearchAuthor
from app.models.resource import Resource

fake = Faker()

def seed():
    db = SessionLocal()

    print("Clearing existing data...")
    db.query(ResearchAuthor).delete()
    db.query(Research).delete()
    db.query(Project).delete()
    db.query(Members).delete()
    db.query(Resource).delete()
    db.query(SubGroup).delete()
    db.commit()

    existing_users = db.query(Users).all()
    users_needed = 28 - len(existing_users)
    if users_needed > 0:
        print(f"Creating {users_needed} dummy users...")
        for _ in range(users_needed):
            u = Users(
                first_name=fake.first_name(),
                last_name=fake.last_name(),
                user_name=fake.user_name(),
                email=fake.email(),
                password_hash="pbkdf2:sha256:260000$dummy$dummy",
                is_active=True
            )
            db.add(u)
        db.commit()

    all_users = db.query(Users).all()
    
    subgroup_names = [
        "Machine Learning & AI",
        "Audio & Speech Processing",
        "Computer Vision",
        "IoT & Embedded Systems",
        "Robotics & Control",
        "Data Science & Analytics",
        "Software Engineering"
    ]

    user_index = 0

    print("Seeding subgroups, members, projects, and research...")
    for sg_name in subgroup_names:
        leader = all_users[user_index]
        user_index += 1

        slug = sg_name.lower().replace(" & ", "-").replace(" ", "-")

        sg = SubGroup(
            name=sg_name,
            slug=slug,
            description=fake.paragraph(nb_sentences=5),
            lead_id=leader.id
        )
        db.add(sg)
        db.commit()

        sg_members = []
        for _ in range(3):
            mu = all_users[user_index]
            user_index += 1
            member = Members(
                user_id=mu.id,
                subgroup_id=sg.id,
                position="Researcher",
                github="https://github.com/example",
                linkedin="https://linkedin.com/in/example",
                portfolio="https://example.com",
                show_profile=True
            )
            db.add(member)
            sg_members.append(member)
        
        db.commit()

        for _ in range(2):
            proj = Project(
                title=fake.catch_phrase(),
                description=fake.text(max_nb_chars=200),
                repository_url="https://github.com/example/repo",
                demo_url="https://example.com/demo",
                status="active",
                technology_stack="Python, React, PostgreSQL",
                created_by=leader.id
            )
            db.add(proj)
        
        for i in range(2):
            res_slug = fake.slug()
            research = Research(
                title=fake.sentence(nb_words=6),
                slug=res_slug,
                abstract=fake.paragraph(nb_sentences=3),
                content=fake.text(max_nb_chars=500),
                created_by=leader.id,
                is_published=True
            )
            db.add(research)
            db.commit()

            for idx, member in enumerate(sg_members):
                ra = ResearchAuthor(
                    research_id=research.id,
                    member_id=member.id,
                    author_order=idx + 1
                )
                db.add(ra)

        db.commit()
    
    print("Seeding complete!")

seed()
