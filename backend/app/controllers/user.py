from datetime import datetime, timedelta, timezone
from fastapi import HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.services.user import UserService
from app.schemas.user import UserCreate, UserLogin, TokenResponse
from app.security.auth import create_access_token, generate_refresh_token
from app.models.user import User
from app.models.security import UserSession


def parse_user_agent(ua_string: str) -> dict:
    """
    Parse browser User-Agent string into structured device/OS/browser info.
    Simple string matching — sufficient for session logging purposes.
    """
    ua = ua_string.lower()
    device_type = "Desktop"
    os_name = (
        "Windows" if "windows" in ua
        else "macOS" if "mac" in ua
        else "Android" if "android" in ua
        else "iOS" if "iphone" in ua or "ipad" in ua
        else "Linux" if "linux" in ua
        else "Unknown"
    )

    if "mobile" in ua or "android" in ua or "iphone" in ua or "ipad" in ua:
        device_type = "Mobile"

    browser_name = (
        "Edge" if "edg" in ua
        else "Chrome" if "chrome" in ua
        else "Firefox" if "firefox" in ua
        else "Safari" if "safari" in ua
        else "Unknown"
    )
    return {"device_type": device_type, "os_name": os_name, "browser_name": browser_name}


class UserController:
    """
    Orchestrates API requests to User business services and active security sessions.
    All methods are static — this class acts as a namespace for user-domain operations.
    """

    @staticmethod
    async def register_user(db: AsyncSession, user_in: UserCreate) -> User:
        service = UserService(db)
        user = await service.register_user(user_in)
        await db.commit()
        return user

    @staticmethod
    async def login_user(
        db: AsyncSession, login_in: UserLogin, ip_address: str, user_agent: str
    ) -> TokenResponse:
        service = UserService(db)
        user = await service.authenticate(login_in)

        access_token = create_access_token(subject=user.id)
        refresh_token = generate_refresh_token()
        ua_info = parse_user_agent(user_agent)

        # Persist session record for device tracking and revocation
        session = UserSession(
            user_id=user.id,
            refresh_token=refresh_token,
            ip_address=ip_address,
            user_agent=user_agent,
            device_type=ua_info["device_type"],
            os_name=ua_info["os_name"],
            browser_name=ua_info["browser_name"],
            expires_at=datetime.now(timezone.utc) + timedelta(days=7),
            is_revoked=False,
        )
        db.add(session)
        await db.commit()

        return TokenResponse(
            access_token=access_token,
            refresh_token=refresh_token,
            role=user.role,
            name=user.name,
        )

    @staticmethod
    async def rotate_tokens(
        db: AsyncSession, refresh_token: str, ip_address: str, user_agent: str
    ) -> TokenResponse:
        """
        Refresh token rotation:
        1. Validate the existing refresh token (active, not revoked, not expired).
        2. Revoke the old session.
        3. Issue new access + refresh token pair.
        4. Create new session record.
        """
        stmt = select(UserSession).where(
            UserSession.refresh_token == refresh_token,
            UserSession.is_revoked == False,
            UserSession.expires_at > datetime.now(timezone.utc),
        )
        result = await db.execute(stmt)
        session = result.scalars().first()

        if not session:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid or expired refresh token.",
            )

        # Revoke the consumed token (rotation — prevents replay)
        session.is_revoked = True

        # Load the associated user
        user_stmt = select(User).where(User.id == session.user_id)
        user_result = await db.execute(user_stmt)
        user = user_result.scalars().first()

        if not user or not user.is_active:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="User account is deactivated.",
            )

        # Issue new credential pair
        new_access = create_access_token(subject=user.id)
        new_refresh = generate_refresh_token()
        ua_info = parse_user_agent(user_agent)

        new_session = UserSession(
            user_id=user.id,
            refresh_token=new_refresh,
            ip_address=ip_address,
            user_agent=user_agent,
            device_type=ua_info["device_type"],
            os_name=ua_info["os_name"],
            browser_name=ua_info["browser_name"],
            expires_at=datetime.now(timezone.utc) + timedelta(days=7),
            is_revoked=False,
        )
        db.add(new_session)
        await db.commit()

        return TokenResponse(
            access_token=new_access,
            refresh_token=new_refresh,
            role=user.role,
            name=user.name,
        )

    @staticmethod
    async def list_active_sessions(db: AsyncSession, user_id: str) -> list[UserSession]:
        stmt = select(UserSession).where(
            UserSession.user_id == user_id,
            UserSession.is_revoked == False,
            UserSession.expires_at > datetime.now(timezone.utc),
        )
        result = await db.execute(stmt)
        return list(result.scalars().all())

    @staticmethod
    async def revoke_session(db: AsyncSession, user_id: str, session_id: str) -> None:
        stmt = select(UserSession).where(
            UserSession.id == session_id,
            UserSession.user_id == user_id,
        )
        result = await db.execute(stmt)
        session = result.scalars().first()
        if not session:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Active session record not found.",
            )
        session.is_revoked = True
        await db.commit()

    @staticmethod
    async def revoke_all_sessions(db: AsyncSession, user_id: str) -> None:
        stmt = select(UserSession).where(
            UserSession.user_id == user_id,
            UserSession.is_revoked == False,
        )
        result = await db.execute(stmt)
        sessions = result.scalars().all()
        for session in sessions:
            session.is_revoked = True
        await db.commit()
