from fastapi import APIRouter, Depends, Request, status
from sqlalchemy.ext.asyncio import AsyncSession
from app.database.session import get_db
from app.schemas.user import (
    UserCreate, UserResponse, UserLogin, TokenResponse,
    RefreshTokenRequest, SessionResponse,
)
from app.controllers.user import UserController
from app.dependencies.auth import get_current_user, PermissionChecker
from app.core.limiter import limiter
from app.models.user import User

router = APIRouter()


# ── Authentication ────────────────────────────────────────────────────────────

@router.post(
    "/auth/register",
    response_model=UserResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Register a new system user",
)
async def register(user_in: UserCreate, db: AsyncSession = Depends(get_db)):
    """
    Create a new user account.
    Duplicate emails are rejected with HTTP 400.
    """
    return await UserController.register_user(db, user_in)


@router.post(
    "/auth/login",
    response_model=TokenResponse,
    summary="Authenticate and obtain access + refresh token pair",
)
@limiter.limit("5/minute")
async def login(
    request: Request,
    login_in: UserLogin,
    db: AsyncSession = Depends(get_db),
):
    """
    Authenticate with email and password.
    Rate-limited to 5 attempts per minute per IP address to prevent brute-force attacks.
    Returns a JWT access token (30-min expiry) and a refresh token (7-day expiry).
    """
    ip = request.client.host if request.client else "127.0.0.1"
    ua = request.headers.get("user-agent", "Unknown")
    return await UserController.login_user(db, login_in, ip, ua)


@router.post(
    "/auth/refresh",
    response_model=TokenResponse,
    summary="Rotate refresh token to obtain a fresh access token",
)
@limiter.limit("10/minute")
async def refresh(
    request: Request,
    refresh_in: RefreshTokenRequest,
    db: AsyncSession = Depends(get_db),
):
    """
    Exchange a valid refresh token for a new access + refresh token pair.
    The submitted refresh token is immediately revoked (rotation security).
    Rate-limited to 10/minute.
    """
    ip = request.client.host if request.client else "127.0.0.1"
    ua = request.headers.get("user-agent", "Unknown")
    return await UserController.rotate_tokens(db, refresh_in.refresh_token, ip, ua)


# ── Session Management ────────────────────────────────────────────────────────

@router.get(
    "/auth/sessions",
    response_model=list[SessionResponse],
    summary="List all active login sessions for the current user",
)
async def get_active_sessions(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    return await UserController.list_active_sessions(db, current_user.id)


@router.post(
    "/auth/sessions/{session_id}/revoke",
    summary="Revoke (terminate) a specific active session",
)
async def revoke_session(
    session_id: str,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    await UserController.revoke_session(db, current_user.id, session_id)
    return {"message": "Session successfully terminated."}


@router.post(
    "/auth/sessions/revoke-all",
    summary="Revoke all active sessions (global logout)",
)
async def revoke_all_sessions(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    await UserController.revoke_all_sessions(db, current_user.id)
    return {"message": "All sessions terminated. You have been logged out everywhere."}


# ── Profile ───────────────────────────────────────────────────────────────────

@router.get(
    "/users/me",
    response_model=UserResponse,
    summary="Retrieve the currently authenticated user's profile",
)
async def get_me(current_user: User = Depends(get_current_user)):
    return current_user


# ── RBAC Test Endpoint ────────────────────────────────────────────────────────

@router.get(
    "/admin/verify",
    response_model=dict,
    summary="[Test] Verify Admin role-based access control",
)
async def verify_admin_role(
    current_user: User = Depends(PermissionChecker(["Admin"])),
):
    """Test endpoint verifying that PermissionChecker correctly enforces Admin-only access."""
    return {
        "message": "Admin authorization check passed successfully.",
        "admin_user": current_user.name,
    }
