from fastapi.testclient import TestClient
from app.main import app
from app.core.database import SessionLocal
import os

client = TestClient(app)

# Login as super_admin to get token
def get_token():
    response = client.post("/login", data={"username": "admin@test.com", "password": "Password123!"})
    if response.status_code == 200:
        return response.json()["access_token"]
    return None

def run_tests():
    token = get_token()
    if not token:
        print("Failed to get token for super_admin. Please ensure one exists.")
        return

    headers = {"Authorization": f"Bearer {token}"}

    # CREATE SubGroup first to get an ID for resource
    sg_res = client.post("/subgroup/", json={"name": "Test SG for Phase 6", "description": "Test"}, headers=headers)
    if sg_res.status_code == 201:
        sg_id = sg_res.json()["id"]
    else:
        # Fallback to 1
        sg_id = 1

    print("\n--- Testing Resources ---")
    
    # 1. Create Resource
    res_data = {
        "title": "My Awesome Resource",
        "description": "Test Phase 6 Resource",
        "type": "PDF",
        "external_url": "https://example.com/file",
        "subgroup_id": sg_id
    }
    resp = client.post("/resources/", json=res_data, headers=headers)
    print("Create Resource:", resp.status_code, resp.json())
    resource_id = resp.json().get("id")

    # 2. Upload File to Resource
    # Create a dummy file
    with open("dummy.pdf", "wb") as f:
        f.write(b"%PDF-1.4 dummy file content")

    with open("dummy.pdf", "rb") as f:
        file_resp = client.post(f"/resources/{resource_id}/file", files={"file": ("dummy.pdf", f, "application/pdf")}, headers=headers)
        print("Upload Resource File:", file_resp.status_code, file_resp.json())
        file_id = file_resp.json().get("id")

    # 3. Retrieve Resource
    get_resp = client.get(f"/resources/{resource_id}", headers=headers)
    print("Get Resource:", get_resp.status_code)
    data = get_resp.json()
    if data.get("file_id") == file_id:
        print(" -> Resource has correct file_id associated!")
    else:
        print(" -> ERROR: Resource file_id mismatch!")

    # 4. Delete Resource
    del_resp = client.delete(f"/resources/{resource_id}", headers=headers)
    print("Delete Resource:", del_resp.status_code)

    
    print("\n--- Testing Research ---")
    # 1. Create Research
    research_data = {
        "title": "My Awesome Research Paper",
        "abstract": "This is an abstract of at least 30 characters in length to pass validation.",
        "content": "Full content of the research.",
        "author_ids": []
    }
    r_resp = client.post("/research/", json=research_data, headers=headers)
    print("Create Research:", r_resp.status_code, r_resp.json())
    research_id = r_resp.json().get("id")

    # 2. Upload File to Research
    with open("dummy.pdf", "rb") as f:
        r_file_resp = client.post(f"/research/{research_id}/file", files={"file": ("dummy.pdf", f, "application/pdf")}, headers=headers)
        print("Upload Research File:", r_file_resp.status_code, r_file_resp.json())
        r_file_id = r_file_resp.json().get("id")
        
    # 3. Retrieve Research
    r_get_resp = client.get(f"/research/{research_id}", headers=headers)
    print("Get Research:", r_get_resp.status_code)
    r_data = r_get_resp.json()
    if r_data.get("file_id") == r_file_id:
        print(" -> Research has correct file_id associated!")
    else:
        print(" -> ERROR: Research file_id mismatch!")

    # 4. Delete Research
    r_del_resp = client.delete(f"/research/{research_id}", headers=headers)
    print("Delete Research:", r_del_resp.status_code)

    os.remove("dummy.pdf")
    print("\nPhase 6 Test Completed.")

if __name__ == "__main__":
    run_tests()
