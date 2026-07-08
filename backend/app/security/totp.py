from __future__ import annotations

import pyotp


def generate_totp_secret() -> str:
    """
    Generate a new cryptographically secure TOTP secret key (Base32 encoded).
    Store this in the User model's otp_secret column.
    """
    return pyotp.random_base32()


def generate_totp_uri(secret: str, user_email: str, issuer: str = "CampusOS ERP") -> str:
    """
    Generate a standard otpauth:// URI for QR code scanning in authenticator apps.
    Compatible with Google Authenticator, Authy, Microsoft Authenticator, etc.
    """
    totp = pyotp.TOTP(secret)
    return totp.provisioning_uri(name=user_email, issuer_name=issuer)


def verify_totp(secret: str, otp_code: str) -> bool:
    """
    Validate a 6-digit TOTP code against the stored secret.
    Allows a ±30 second window (valid=1) to account for clock drift.
    Returns False on any error rather than raising.
    """
    try:
        totp = pyotp.TOTP(secret)
        return totp.verify(otp_code, valid_window=1)
    except Exception:
        return False
