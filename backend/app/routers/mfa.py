from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

from app.database.session import get_db
from app.dependencies.auth import get_current_user
from app.models.user import User
from app.schemas.mfa import MFASetupResponse, MFAVerifyRequest
from app.security.totp import generate_totp_secret, generate_totp_uri, verify_totp

router = APIRouter()


@router.post(
    "/auth/mfa/setup",
    response_model=MFASetupResponse,
    summary="Generate a TOTP secret and provisioning URI for the current user",
)
async def setup_mfa(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """
    Generates a new TOTP secret and stores it on the user's account.
    The provisioning URI can be scanned with any standard authenticator app.

    ⚠️ Calling this endpoint again will regenerate the secret, invalidating existing authenticator setups.
    """
    secret = generate_totp_secret()

    # Persist the new TOTP secret on the user record
    result = await db.execute(select(User).where(User.id == current_user.id))
    user = result.scalars().first()
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found.")

    user.otp_secret = secret
    await db.commit()

    uri = generate_totp_uri(secret, user.email)
    return MFASetupResponse(otp_secret=secret, provisioning_uri=uri)


@router.post(
    "/auth/mfa/verify",
    summary="Verify a 6-digit TOTP code (completes 2FA login flow)",
)
async def verify_mfa(
    verify_in: MFAVerifyRequest,
    current_user: User = Depends(get_current_user),
):
    """
    Validates a 6-digit TOTP code from the user's authenticator app.
    Returns 200 OK on success; 401 Unauthorized on invalid or expired code.

    This endpoint is called as the second factor after password login.
    Note: A ±30 second window is allowed to account for clock drift.
    """
    if not current_user.otp_secret:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="MFA is not configured for this account. Call /auth/mfa/setup first.",
        )

    is_valid = verify_totp(current_user.otp_secret, verify_in.otp_code)
    if not is_valid:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired OTP code. Please try again.",
        )

    return {"message": "MFA verification successful. Authentication complete.", "user": current_user.name}
