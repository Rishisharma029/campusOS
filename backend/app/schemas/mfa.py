from pydantic import BaseModel


class MFASetupResponse(BaseModel):
    """Response from MFA setup containing the secret and provisioning URI for QR scanning."""
    otp_secret: str
    provisioning_uri: str
    message: str = "Scan the provisioning URI with your authenticator app (Google Authenticator, Authy, etc.)"


class MFAVerifyRequest(BaseModel):
    """Request body for verifying a TOTP code during login."""
    otp_code: str
