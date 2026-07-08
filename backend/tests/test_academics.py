import pytest
from httpx import AsyncClient
from app.core.config import settings

@pytest.mark.asyncio
async def test_academics_workflow(client: AsyncClient):
    # 1. Register and Login Admin
    admin_payload = {
        "email": "acad-admin@campusos.edu",
        "name": "Acad Admin",
        "role": "Admin",
        "password": "strongpassword123"
    }
    await client.post(f"{settings.API_V1_STR}/auth/register", json=admin_payload)
    login_resp = await client.post(
        f"{settings.API_V1_STR}/auth/login",
        json={"email": admin_payload["email"], "password": admin_payload["password"]}
    )
    admin_token = login_resp.json()["access_token"]
    headers = {"Authorization": f"Bearer {admin_token}"}

    # 2. Create Department
    dept_payload = {"name": "Computer Science", "code": "CSE"}
    dept_resp = await client.post(
        f"{settings.API_V1_STR}/departments",
        json=dept_payload,
        headers=headers
    )
    assert dept_resp.status_code == 201
    dept_data = dept_resp.json()
    assert dept_data["code"] == "CSE"
    dept_id = dept_data["id"]

    # 3. Create Department Duplicate -> Expect 400
    dup_dept_resp = await client.post(
        f"{settings.API_V1_STR}/departments",
        json=dept_payload,
        headers=headers
    )
    assert dup_dept_resp.status_code == 400

    # 4. Create Course
    course_payload = {"department_id": dept_id, "name": "B.Tech CSE", "code": "BTECH-CSE", "duration_years": 4}
    course_resp = await client.post(
        f"{settings.API_V1_STR}/courses",
        json=course_payload,
        headers=headers
    )
    assert course_resp.status_code == 201
    course_data = course_resp.json()
    assert course_data["code"] == "BTECH-CSE"
    course_id = course_data["id"]

    # 5. Create Subject
    subject_payload = {"course_id": course_id, "name": "Algorithms", "code": "CS-302", "credits": 4}
    subject_resp = await client.post(
        f"{settings.API_V1_STR}/subjects",
        json=subject_payload,
        headers=headers
    )
    assert subject_resp.status_code == 201
    subject_data = subject_resp.json()
    assert subject_data["code"] == "CS-302"

    # 6. List Departments, Courses, Subjects
    depts_resp = await client.get(f"{settings.API_V1_STR}/departments", headers=headers)
    assert len(depts_resp.json()) >= 1

    courses_resp = await client.get(f"{settings.API_V1_STR}/courses", headers=headers)
    assert len(courses_resp.json()) >= 1

    subjects_resp = await client.get(f"{settings.API_V1_STR}/subjects", headers=headers)
    assert len(subjects_resp.json()) >= 1
