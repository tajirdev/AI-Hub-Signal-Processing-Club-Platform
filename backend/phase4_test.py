import os
import sys
import uuid

# Ensure backend is in pythonpath
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

users = {
    "super_admin": {"email": "admin@test.com", "password": "Password123!"},
    "editor": {"email": "editor@test.com", "password": "Password123!"},
    "member": {"email": "member@test.com", "password": "Password123!"},
    "user": {"email": "user@test.com", "password": "Password123!"},
}

tokens = {}
for role, creds in users.items():
    res = client.post("/login", data={"username": creds["email"], "password": creds["password"]})
    if res.status_code == 200:
        tokens[role] = res.json()["access_token"]
    else:
        print(f"Failed to login {role}")

report = ["# Phase 4: Comprehensive CRUD & Authorization Test Report\n"]

def run_test(name, func):
    try:
        status, details = func()
        mark = "?" if status else "?"
        report.append(f"- {mark} **{name}**: {details}")
    except Exception as e:
        report.append(f"- ? **{name}**: Crash - {str(e)}")

headers = {role: {"Authorization": f"Bearer {token}"} for role, token in tokens.items()}
headers["unauth"] = {}

uid = str(uuid.uuid4())[:4]

# 1. Categories CRUD
category_id = None
def test_category_create_admin():
    global category_id
    res = client.post("/category/create", json={"name": f"Tech AI {uid}", "description": "Tech AI Description"}, headers=headers["super_admin"])
    if res.status_code == 200 or res.status_code == 201:
        category_id = res.json()["id"]
        return True, "Admin successfully created a category."
    return False, f"Expected 200/201, got {res.status_code}. {res.text}"

def test_category_create_editor():
    res = client.post("/category/create", json={"name": f"Editor AI {uid}", "description": "Editor Description"}, headers=headers["editor"])
    if res.status_code == 403:
        return True, "Editor correctly blocked from creating a category."
    return False, f"Expected 403, got {res.status_code}."

run_test("Category: Admin Create", test_category_create_admin)
run_test("Category: Editor Create (Blocked)", test_category_create_editor)


# 2. SubGroups CRUD
subgroup_id = None
def test_subgroup_create_admin():
    global subgroup_id
    res = client.post("/sub_groups", json={"name": f"Group {uid}", "description": "This is a detailed description of the subgroup that passes the length check."}, headers=headers["super_admin"])
    if res.status_code == 200 or res.status_code == 201:
        subgroup_id = res.json()["id"]
        return True, "Admin created subgroup."
    return False, f"Failed: {res.status_code} - {res.text}"

def test_subgroup_create_editor():
    res = client.post("/sub_groups", json={"name": f"EdGroup {uid}", "description": "Detailed description for the subgroup passing length check."}, headers=headers["editor"])
    return res.status_code == 403, f"Editor blocked from creating subgroup. Status: {res.status_code}"

def test_subgroup_edit_admin():
    res = client.put(f"/sub_groups/{subgroup_id}", json={"name": f"Upd Grp {uid}", "description": "This is a detailed description of the subgroup that passes the length check."}, headers=headers["super_admin"])
    return res.status_code == 200, f"Admin edited subgroup. Status: {res.status_code}"

run_test("SubGroup: Admin Create", test_subgroup_create_admin)
run_test("SubGroup: Editor Create (Blocked)", test_subgroup_create_editor)
run_test("SubGroup: Admin Edit", test_subgroup_edit_admin)


# 3. Blog Post CRUD
blog_editor_id = None
def test_blog_create_editor():
    global blog_editor_id
    res = client.post("/blog-posts/", json={
        "title": f"Editor Blog Post {uid}",
        "content": "This is a very long content string for the editor blog post that meets the minimum length required by the pydantic schema. It must be at least 100 characters long to pass validation.",
        "excerpt": "Editor excerpt.",
        "status": "published",
        "category_ids": [category_id] if category_id else []
    }, headers=headers["editor"])
    if res.status_code == 200 or res.status_code == 201:
        blog_editor_id = res.json()["id"]
        return True, "Editor created blog successfully."
    return False, f"Failed: {res.status_code} - {res.text}"

def test_blog_edit_owner():
    res = client.put(f"/blog-posts/{blog_editor_id}", json={"title": "Updated Editor Blog"}, headers=headers["editor"])
    if res.status_code == 200:
        return True, "Editor edited own blog."
    return False, f"Failed: {res.status_code} - {res.text}"

def test_blog_edit_member():
    res = client.put(f"/blog-posts/{blog_editor_id}", json={"title": "Member Hack"}, headers=headers["member"])
    return res.status_code == 403, f"Member blocked from editing blog. Status: {res.status_code}"

def test_blog_edit_admin_override():
    res = client.put(f"/blog-posts/{blog_editor_id}", json={"title": "Admin Override Blog"}, headers=headers["super_admin"])
    return res.status_code == 200, f"Admin overrode editor's blog. Status: {res.status_code}"

run_test("Blog: Editor Create", test_blog_create_editor)
run_test("Blog: Editor Edit Own", test_blog_edit_owner)
run_test("Blog: Member Edit (Blocked)", test_blog_edit_member)
run_test("Blog: Admin Edit (Override)", test_blog_edit_admin_override)


# 4. Projects CRUD
project_id = None
def test_project_create_editor():
    global project_id
    res = client.post("/projects/", json={
        "title": f"Editor Project {uid}",
        "description": "This is a project description that exceeds thirty characters for length.",
        "repository_url": "http://github.com/project",
        "demo_url": "http://github.com/project",
        "technology_stack": "Python, React",
        "status": "active"
    }, headers=headers["editor"])
    if res.status_code == 201:
        project_id = res.json()["id"]
        return True, "Editor created project."
    return False, f"Failed: {res.status_code} - {res.text}"

def test_project_edit_owner():
    res = client.put(f"/projects/{project_id}", json={"title": "Updated Editor Project"}, headers=headers["editor"])
    if res.status_code == 200:
        return True, "Editor edited own project."
    return False, f"Failed: {res.status_code} - {res.text}"

def test_project_edit_admin_override():
    res = client.put(f"/projects/{project_id}", json={"title": "Admin Project Edit Override"}, headers=headers["super_admin"])
    return res.status_code == 200, f"Admin overrode editor's project. Status: {res.status_code}"

def test_project_delete_admin():
    res = client.delete(f"/projects/{project_id}", headers=headers["super_admin"])
    return res.status_code == 200, f"Admin deleted project. Status: {res.status_code}"

run_test("Project: Editor Create", test_project_create_editor)
run_test("Project: Editor Edit Own", test_project_edit_owner)
run_test("Project: Admin Edit (Override)", test_project_edit_admin_override)
run_test("Project: Admin Delete", test_project_delete_admin)


# 5. Resource CRUD
resource_id = None
def test_resource_create_editor():
    global resource_id
    res = client.post("/resources/", json={
        "title": f"Editor Resource {uid}",
        "description": "This is a useful resource for learning about signal processing.",
        "external_url": "http://example.com/resource",
        "type": "EXTERNAL_LINK",
        "subgroup_id": subgroup_id
    }, headers=headers["editor"])
    if res.status_code == 201 or res.status_code == 200:
        resource_id = res.json()["id"]
        return True, "Editor created resource."
    return False, f"Failed: {res.status_code} - {res.text}"

def test_resource_create_member():
    res = client.post("/resources/", json={
        "title": f"Member Resource {uid}",
        "description": "This is a useful resource for learning about signal processing.",
        "external_url": "http://example.com/resource",
        "type": "EXTERNAL_LINK",
        "subgroup_id": subgroup_id
    }, headers=headers["member"])
    return res.status_code == 403, f"Member blocked from creating resource. Status: {res.status_code}"

def test_resource_edit_editor():
    if not resource_id:
        return False, "Skipped (no resource ID)"
    res = client.put(f"/resources/{resource_id}", json={"title": "Updated Editor Resource"}, headers=headers["editor"])
    if res.status_code == 200:
         return True, "Editor edited own resource."
    return False, f"Failed: {res.status_code} - {res.text}"

def test_resource_edit_user():
    if not resource_id:
        return False, "Skipped (no resource ID)"
    res = client.put(f"/resources/{resource_id}", json={"title": "User Hacker Resource"}, headers=headers["user"])
    return res.status_code == 403, f"User blocked from editing resource. Status: {res.status_code}"

def test_resource_delete_admin():
    if not resource_id:
        return False, "Skipped (no resource ID)"
    res = client.delete(f"/resources/{resource_id}", headers=headers["super_admin"])
    return res.status_code == 200, f"Admin deleted resource. Status: {res.status_code}"

run_test("Resource: Editor Create", test_resource_create_editor)
run_test("Resource: Member Create (Blocked)", test_resource_create_member)
run_test("Resource: Editor Edit Own", test_resource_edit_editor)
run_test("Resource: User Edit (Blocked)", test_resource_edit_user)
run_test("Resource: Admin Delete", test_resource_delete_admin)

with open("phase4_report.md", "w", encoding="utf-8") as f:
    f.write("\n".join(report))

print("Phase 4 Tests execution completed.")
