import pytest
from httpx import AsyncClient
from app.core.config import settings

@pytest.mark.asyncio
async def test_attendance_rectification_and_sync(client: AsyncClient):
    # 1. Register & Login Admin
    admin_payload = {
        "email": "att-admin@campusos.edu",
        "name": "Att Admin",
        "role": "Admin",
        "password": "strongpassword123",
    }
    await client.post(f"{settings.API_V1_STR}/auth/register", json=admin_payload)
    login_resp = await client.post(
        f"{settings.API_V1_STR}/auth/login",
        json={"email": admin_payload["email"], "password": admin_payload["password"]},
    )
    assert login_resp.status_code == 200
    token = login_resp.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    # 2. Register a Student User & Profile
    student_user_payload = {
        "email": "att-student@campusos.edu",
        "name": "Att Student",
        "role": "Student",
        "password": "strongpassword123",
    }
    reg_student_resp = await client.post(f"{settings.API_V1_STR}/auth/register", json=student_user_payload)
    student_user_id = reg_student_resp.json()["id"]

    student_profile = {
        "user_id": student_user_id,
        "roll_no": "2026-ATT-01",
        "department": "Computer Science",
        "course": "B.Tech CSE",
        "year": 2,
        "semester": 4,
        "enrollment_year": 2024,
        "cgpa": 8.8,
        "parent_name": "Ramesh Sharma",
        "parent_email": "ramesh@email.com",
        "phone": "+919876543299",
        "attendance_rate": 88.5,
        "status": "Active",
        "hostel_room": "C-101",
        "transport_bus": "Route 12",
        "placement_status": "Eligible",
    }
    create_prof_resp = await client.post(f"{settings.API_V1_STR}/students", json=student_profile, headers=headers)
    assert create_prof_resp.status_code == 201
    student_id = create_prof_resp.json()["id"]

    # 3. Mark Absent first
    absent_payload = {
        "student_id": student_id,
        "subject_code": "CS-TEST-99",
        "date": "2026-09-16",
        "status": "Absent",
    }
    create_absent_resp = await client.post(
        f"{settings.API_V1_STR}/attendance",
        json=absent_payload,
        headers=headers,
    )
    assert create_absent_resp.status_code == 201
    created_att = create_absent_resp.json()
    assert created_att["status"] == "Absent"
    att_id = created_att["id"]

    # 4. Rectify: Mark Present on same date and subject (Upsert verification)
    present_payload = {
        "student_id": student_id,
        "subject_code": "CS-TEST-99",
        "date": "2026-09-16",
        "status": "Present",
    }
    create_present_resp = await client.post(
        f"{settings.API_V1_STR}/attendance",
        json=present_payload,
        headers=headers,
    )
    assert create_present_resp.status_code == 201
    updated_att = create_present_resp.json()
    assert updated_att["id"] == att_id  # Upserted the exact same record!
    assert updated_att["status"] == "Present"

    # 5. Test direct PUT /attendance/{id} rectification
    put_resp = await client.put(
        f"{settings.API_V1_STR}/attendance/{att_id}",
        json={"status": "Late"},
        headers=headers,
    )
    assert put_resp.status_code == 200
    assert put_resp.json()["status"] == "Late"

    # 6. Test batch sync (Low-internet offline sync endpoint)
    batch_payload = {
        "records": [
            {
                "student_id": student_id,
                "subject_code": "CS-TEST-99",
                "date": "2026-09-16",
                "status": "Present",
            },
            {
                "student_id": student_id,
                "subject_code": "CS-BATCH-01",
                "date": "2026-09-17",
                "status": "Present",
            },
        ]
    }
    sync_resp = await client.post(
        f"{settings.API_V1_STR}/attendance/sync",
        json=batch_payload,
        headers=headers,
    )
    assert sync_resp.status_code == 200
    synced_records = sync_resp.json()
    assert len(synced_records) == 2
    assert any(r["subject_code"] == "CS-BATCH-01" for r in synced_records)
