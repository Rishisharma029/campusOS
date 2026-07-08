import pytest
from httpx import AsyncClient
from app.core.config import settings

@pytest.mark.asyncio
async def test_student_complete_flow(client: AsyncClient):
    # 1. Register and Login Admin
    admin_payload = {
        "email": "student-admin@campusos.edu",
        "name": "Stud Admin",
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

    # 2. Register a Student User
    user_payload = {
        "email": "student_account@campusos.edu",
        "name": "Rahul Verma",
        "role": "Student",
        "password": "studentpwd123"
    }
    user_resp = await client.post(f"{settings.API_V1_STR}/auth/register", json=user_payload)
    student_user_id = user_resp.json()["id"]

    # 3. Create Student profile linking to user_id
    student_payload = {
        "user_id": student_user_id,
        "roll_no": "2026-CS-45",
        "department": "Computer Science",
        "course": "B.Tech CSE",
        "year": 1,
        "semester": 1,
        "enrollment_year": 2026,
        "cgpa": 9.20,
        "parent_name": "Sanjay Verma",
        "parent_email": "sanjay@email.com",
        "phone": "+919876543210",
        "attendance_rate": 95.0,
        "status": "Active",
        "hostel_room": "B-402",
        "transport_bus": "Route 5",
        "placement_status": "Preparing"
    }
    student_resp = await client.post(
        f"{settings.API_V1_STR}/students",
        json=student_payload,
        headers=headers
    )
    assert student_resp.status_code == 201
    student_data = student_resp.json()
    student_id = student_data["id"]

    # 4. Get Student by ID
    get_student_resp = await client.get(
        f"{settings.API_V1_STR}/students/{student_id}",
        headers=headers
    )
    assert get_student_resp.status_code == 200
    assert get_student_resp.json()["roll_no"] == "2026-CS-45"

    # 5. Submit Attendance
    att_payload = {
        "student_id": student_id,
        "subject_code": "CS-302",
        "date": "2026-07-08",
        "status": "Present"
    }
    att_resp = await client.post(
        f"{settings.API_V1_STR}/attendance",
        json=att_payload,
        headers=headers
    )
    assert att_resp.status_code == 201

    # 6. Retrieve Attendance
    get_att_resp = await client.get(
        f"{settings.API_V1_STR}/students/{student_id}/attendance?student_id={student_id}",
        headers=headers
    )
    assert get_att_resp.status_code == 200
    assert len(get_att_resp.json()) >= 1

    # 7. Submit exam Result
    res_payload = {
        "student_id": student_id,
        "subject_name": "Algorithms",
        "marks_obtained": 88,
        "max_marks": 100,
        "grade": "A+",
        "exam_type": "Internal"
    }
    res_resp = await client.post(
        f"{settings.API_V1_STR}/results",
        json=res_payload,
        headers=headers
    )
    assert res_resp.status_code == 201

    # 8. Retrieve Results
    get_res_resp = await client.get(
        f"{settings.API_V1_STR}/students/{student_id}/results",
        headers=headers
    )
    assert get_res_resp.status_code == 200
    assert len(get_res_resp.json()) >= 1
