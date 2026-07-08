from datetime import datetime, timedelta, timezone
from typing import Any, Union
import jwt
import bcrypt
import secrets
import uuid
from app.core.config import settings


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """
    Verify a plain-text password against its bcrypt hash.
    Returns False on any error rather than raising — prevents timing side-channels.
    """
    try:
        plain_bytes = plain_password.encode("utf-8")
        hashed_bytes = hashed_password.encode("utf-8")
        return bcrypt.checkpw(plain_bytes, hashed_bytes)
    except Exception:
        return False


def get_password_hash(password: str) -> str:
    """
    Hash a plain-text password using bcrypt with a fresh per-password salt.
    """
    pwd_bytes = password.encode("utf-8")
    salt = bcrypt.gensalt()
    hashed = bcrypt.hashpw(pwd_bytes, salt)
    return hashed.decode("utf-8")


def create_access_token(
    subject: Union[str, Any],
    expires_delta: timedelta | None = None,
) -> str:
    """
    Generate a signed JWT access token.
    Includes a unique JTI (JWT ID) claim for future token revocation support.
    Uses timezone-aware UTC datetime (Python 3.12+ compatible).
    """
    expire = datetime.now(timezone.utc) + (
        expires_delta
        if expires_delta
        else timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    )
    payload = {
        "exp": expire,
        "sub": str(subject),
        "jti": str(uuid.uuid4()),  # Unique token ID — used for revocation blacklisting
        "iat": datetime.now(timezone.utc),  # Issued-at claim
    }
    return jwt.encode(payload, settings.SECRET_KEY, algorithm=settings.JWT_ALGORITHM)


def generate_refresh_token() -> str:
    """
    Generate a cryptographically secure random hex string for use as a refresh token.
    256 bits of entropy (64 hex chars).
    """
    return secrets.token_hex(32)
