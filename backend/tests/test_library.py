import pytest
from httpx import AsyncClient
from app.core.config import settings

@pytest.mark.asyncio
async def test_library_borrow_and_return_flow(client: AsyncClient):
    # 1. Register and Login Admin
    admin_payload = {
        "email": "lib-admin@campusos.edu",
        "name": "Lib Admin",
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

    # 2. Add a Book to the Library
    book_payload = {
        "title": "Introduction to Algorithms",
        "author": "CLRS",
        "isbn": "9780262033848",
        "category": "Computer Science",
        "copies_total": 2
    }
    book_resp = await client.post(
        f"{settings.API_V1_STR}/books",
        json=book_payload,
        headers=headers
    )
    assert book_resp.status_code == 201
    book_id = book_resp.json()["id"]
    assert book_resp.json()["copies_available"] == 2

    # 3. Register a Student User & profile (needed for FK integrity)
    student_user_payload = {
        "email": "lib_student@campusos.edu",
        "name": "Library Student",
        "role": "Student",
        "password": "studentpwd123"
    }
    su_resp = await client.post(f"{settings.API_V1_STR}/auth/register", json=student_user_payload)
    student_user_id = su_resp.json()["id"]

    student_profile_payload = {
        "user_id": student_user_id,
        "roll_no": "2026-CS-99",
        "department": "Computer Science",
        "course": "B.Tech CSE",
        "year": 1,
        "semester": 1,
        "enrollment_year": 2026,
        "cgpa": 8.50,
        "parent_name": "Sanjay Verma",
        "parent_email": "sanjay@email.com",
        "phone": "+919876543210",
        "attendance_rate": 95.0,
        "status": "Active",
        "hostel_room": "Unassigned",
        "transport_bus": "None",
        "placement_status": "Preparing"
    }
    student_profile_resp = await client.post(
        f"{settings.API_V1_STR}/students",
        json=student_profile_payload,
        headers=headers
    )
    student_id = student_profile_resp.json()["id"]

    # 4. Borrow the Book
    borrow_payload = {
        "book_id": book_id,
        "student_id": student_id,
        "issue_date": "2026-07-01",
        "due_date": "2026-07-15"
    }
    borrow_resp = await client.post(
        f"{settings.API_V1_STR}/books/{book_id}/borrow",
        json=borrow_payload,
        headers=headers
    )
    assert borrow_resp.status_code == 201
    borrow_id = borrow_resp.json()["id"]

    # Check copies decrement
    get_book_resp = await client.get(f"{settings.API_V1_STR}/books/{book_id}", headers=headers)
    assert get_book_resp.json()["copies_available"] == 1

    # 5. Return the Book (with fine: returned after due date)
    # Due date: July 15. Return date: July 20. Fines: 5 days * $2.00 = $10.00
    return_payload = {"return_date": "2026-07-20"}
    return_resp = await client.put(
        f"{settings.API_V1_STR}/borrows/{borrow_id}/return",
        json=return_payload,
        headers=headers
    )
    assert return_resp.status_code == 200
    assert return_resp.json()["fine_amount"] == 10.00

    # Check copies increment
    get_book_resp2 = await client.get(f"{settings.API_V1_STR}/books/{book_id}", headers=headers)
    assert get_book_resp2.json()["copies_available"] == 2
