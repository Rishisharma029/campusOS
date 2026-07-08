import pytest
from httpx import AsyncClient
from app.core.config import settings

@pytest.mark.asyncio
async def test_security_headers(client: AsyncClient):
    # Retrieve root status endpoint
    response = await client.get("/")
    assert response.status_code == 200
    
    # Assert defense-in-depth secure headers are injected
    headers = response.headers
    assert "strict-transport-security" in headers
    assert headers["x-frame-options"] == "DENY"
    assert headers["x-content-type-options"] == "nosniff"
    assert headers["referrer-policy"] == "strict-origin-when-cross-origin"
    assert "default-src 'self'" in headers["content-security-policy"]
    assert "geolocation=" in headers["permissions-policy"]

@pytest.mark.asyncio
async def test_session_rotation_and_revocation(client: AsyncClient):
    # 1. Register a test user
    payload = {
        "email": "secuser@campusos.edu",
        "name": "Security User",
        "role": "Student",
        "password": "secpassword123"
    }
    await client.post(f"{settings.API_V1_STR}/auth/register", json=payload)
    
    # 2. Login (User-Agent header sets browser logs)
    headers = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0.0.0"}
    login_resp = await client.post(
        f"{settings.API_V1_STR}/auth/login",
        json={"email": payload["email"], "password": payload["password"]},
        headers=headers
    )
    assert login_resp.status_code == 200
    token_data = login_resp.json()
    assert "access_token" in token_data
    assert "refresh_token" in token_data
    
    access_token = token_data["access_token"]
    refresh_token = token_data["refresh_token"]
    auth_headers = {
        "Authorization": f"Bearer {access_token}",
        **headers
    }
    
    # 3. Retrieve sessions list
    sessions_resp = await client.get(f"{settings.API_V1_STR}/auth/sessions", headers=auth_headers)
    assert sessions_resp.status_code == 200
    sessions_list = sessions_resp.json()
    assert len(sessions_list) == 1
    assert sessions_list[0]["browser_name"] == "Chrome"
    assert sessions_list[0]["os_name"] == "Windows"
    assert sessions_list[0]["device_type"] == "Desktop"
    
    session_id = sessions_list[0]["id"]
    
    # 4. Refresh token rotation check
    refresh_resp = await client.post(
        f"{settings.API_V1_STR}/auth/refresh",
        json={"refresh_token": refresh_token},
        headers=headers
    )
    assert refresh_resp.status_code == 200
    new_tokens = refresh_resp.json()
    assert new_tokens["access_token"] != access_token
    assert new_tokens["refresh_token"] != refresh_token
    
    new_access_token = new_tokens["access_token"]
    new_refresh_token = new_tokens["refresh_token"]
    
    # 5. Verify the old refresh token is now revoked (Token Rotation check!)
    failed_refresh = await client.post(
        f"{settings.API_V1_STR}/auth/refresh",
        json={"refresh_token": refresh_token},
        headers=headers
    )
    assert failed_refresh.status_code == 401
    
    # 6. Verify revoking the new active session
    new_auth_headers = {
        "Authorization": f"Bearer {new_access_token}",
        **headers
    }
    
    # Get active session ID for the rotated token
    list_resp = await client.get(f"{settings.API_V1_STR}/auth/sessions", headers=new_auth_headers)
    active_sessions = list_resp.json()
    # Should have exactly 1 active session (the old one was revoked on rotate)
    assert len(active_sessions) == 1
    new_session_id = active_sessions[0]["id"]
    
    # Revoke it
    revoke_resp = await client.post(
        f"{settings.API_V1_STR}/auth/sessions/{new_session_id}/revoke",
        headers=new_auth_headers
    )
    assert revoke_resp.status_code == 200
    
    # List active sessions again -> expect 0 active sessions
    check_resp = await client.get(f"{settings.API_V1_STR}/auth/sessions", headers=new_auth_headers)
    assert len(check_resp.json()) == 0
