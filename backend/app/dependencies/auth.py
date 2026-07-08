from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
import jwt

from app.core.config import settings
from app.database.session import get_db
from app.models.user import User

# tokenUrl points to the JSON-based login endpoint.
# Note: Swagger "Authorize" uses form encoding which differs from the JSON login.
# This declaration enables Bearer token authorization in the API docs.
reusable_oauth2 = OAuth2PasswordBearer(
    tokenUrl=f"{settings.API_V1_STR}/auth/login",
    auto_error=True,
)


async def get_current_user(
    db: AsyncSession = Depends(get_db),
    token: str = Depends(reusable_oauth2),
) -> User:
    """
    FastAPI dependency: decode JWT, load the corresponding user from the database.
    Raises HTTP 401 for all authentication failures (invalid token, missing user, inactive account).
    """
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials.",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(
            token,
            settings.SECRET_KEY,
            algorithms=[settings.JWT_ALGORITHM],
        )
        user_id: str | None = payload.get("sub")
        if user_id is None:
            raise credentials_exception
    except jwt.ExpiredSignatureError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Access token has expired. Please refresh.",
            headers={"WWW-Authenticate": "Bearer"},
        )
    except jwt.PyJWTError:
        raise credentials_exception

    result = await db.execute(select(User).where(User.id == user_id))
    user = result.scalars().first()

    if user is None:
        raise credentials_exception

    if not user.is_active:
        # Fixed: was HTTP 400 (Bad Request) — correct status is 401 (Unauthorized) [F-10]
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User account has been deactivated.",
            headers={"WWW-Authenticate": "Bearer"},
        )

    return user


class PermissionChecker:
    """
    FastAPI dependency for role-based access control (RBAC).
    Usage: Depends(PermissionChecker(["Admin", "Faculty"]))
    Returns the authenticated user if their role is in the allowed list.
    Raises HTTP 403 Forbidden otherwise.
    """

    def __init__(self, allowed_roles: list[str]):
        self.allowed_roles = allowed_roles

    def __call__(self, current_user: User = Depends(get_current_user)) -> User:
        if current_user.role not in self.allowed_roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Role '{current_user.role}' is not authorized to access this resource. "
                       f"Required: {self.allowed_roles}",
            )
        return current_user
