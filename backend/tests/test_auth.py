import pytest
from httpx import AsyncClient
from app.core.config import settings

@pytest.mark.asyncio
async def test_user_flow(client: AsyncClient):
    # 1. Register a student user
    student_payload = {
        "email": "student@campusos.edu",
        "name": "Arjun Das",
        "role": "Student",
        "password": "strongpassword123"
    }
    
    reg_response = await client.post(
        f"{settings.API_V1_STR}/auth/register",
        json=student_payload
    )
    assert reg_response.status_code == 201
    reg_data = reg_response.json()
    assert reg_data["email"] == student_payload["email"]
    assert reg_data["name"] == student_payload["name"]
    assert reg_data["role"] == "Student"
    assert "id" in reg_data
    
    # 2. Login using the registered credentials
    login_payload = {
        "email": student_payload["email"],
        "password": student_payload["password"]
    }
    login_response = await client.post(
        f"{settings.API_V1_STR}/auth/login",
        json=login_payload
    )
    assert login_response.status_code == 200
    token_data = login_response.json()
    assert "access_token" in token_data
    assert token_data["role"] == "Student"
    assert token_data["name"] == student_payload["name"]
    
    access_token = token_data["access_token"]
    headers = {"Authorization": f"Bearer {access_token}"}
    
    # 3. Retrieve personal user details using the bearer token
    me_response = await client.get(
        f"{settings.API_V1_STR}/users/me",
        headers=headers
    )
    assert me_response.status_code == 200
    me_data = me_response.json()
    assert me_data["email"] == student_payload["email"]
    
    # 4. Attempt to access Admin only verification endpoint -> Expect 403 Forbidden
    admin_verify_response = await client.get(
        f"{settings.API_V1_STR}/admin/verify",
        headers=headers
    )
    assert admin_verify_response.status_code == 403
    
    # 5. Register an Admin user
    admin_payload = {
        "email": "admin@campusos.edu",
        "name": "Super Admin",
        "role": "Admin",
        "password": "adminsuperpass"
    }
    await client.post(
        f"{settings.API_V1_STR}/auth/register",
        json=admin_payload
    )
    
    # Login as admin
    admin_login_resp = await client.post(
        f"{settings.API_V1_STR}/auth/login",
        json={
            "email": admin_payload["email"],
            "password": admin_payload["password"]
        }
    )
    admin_token = admin_login_resp.json()["access_token"]
    admin_headers = {"Authorization": f"Bearer {admin_token}"}
    
    # Access Admin only verification endpoint -> Expect 200 OK
    admin_ok_resp = await client.get(
        f"{settings.API_V1_STR}/admin/verify",
        headers=admin_headers
    )
    assert admin_ok_resp.status_code == 200
    admin_ok_data = admin_ok_resp.json()
    assert admin_ok_data["admin_user"] == admin_payload["name"]


@pytest.mark.asyncio
async def test_duplicate_registration(client):
    """Registering with an already-used email should return HTTP 400."""
    payload = {"email": "dup@test.com", "name": "First User", "role": "Student", "password": "pass123"}
    await client.post(f"{settings.API_V1_STR}/auth/register", json=payload)
    resp = await client.post(f"{settings.API_V1_STR}/auth/register", json=payload)
    assert resp.status_code == 400

@pytest.mark.asyncio
async def test_wrong_password(client):
    """Login with wrong password should return HTTP 400."""
    payload = {"email": "wrongpwd@test.com", "name": "Test", "role": "Student", "password": "correct"}
    await client.post(f"{settings.API_V1_STR}/auth/register", json=payload)
    resp = await client.post(f"{settings.API_V1_STR}/auth/login", json={"email": "wrongpwd@test.com", "password": "wrong"})
    assert resp.status_code == 400

@pytest.mark.asyncio
async def test_malformed_jwt(client):
    """A malformed Bearer token should return HTTP 401."""
    resp = await client.get(f"{settings.API_V1_STR}/users/me", headers={"Authorization": "Bearer notavalidjwt"})
    assert resp.status_code == 401

@pytest.mark.asyncio
async def test_missing_auth_header(client):
    """No Authorization header should return HTTP 401."""
    resp = await client.get(f"{settings.API_V1_STR}/users/me")
    assert resp.status_code == 401

@pytest.mark.asyncio
async def test_invalid_email_format(client):
    """Registration with invalid email format should return HTTP 422."""
    payload = {"email": "not-an-email", "name": "Bad", "role": "Student", "password": "pass123"}
    resp = await client.post(f"{settings.API_V1_STR}/auth/register", json=payload)
    assert resp.status_code == 422
