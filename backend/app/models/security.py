from datetime import datetime, timezone
from sqlalchemy import String, Boolean, DateTime, ForeignKey, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.database.base_model import Base


class UserSession(Base):
    """
    Represents an active login session — tracks device, browser, IP, and token.
    Deleted when the parent User is deleted (CASCADE).
    """
    __tablename__ = "user_sessions"

    user_id: Mapped[str] = mapped_column(
        String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True
    )
    refresh_token: Mapped[str] = mapped_column(
        String(255), unique=True, index=True, nullable=False
    )
    ip_address: Mapped[str] = mapped_column(String(45), nullable=False)
    user_agent: Mapped[str] = mapped_column(String(255), nullable=False)
    device_type: Mapped[str] = mapped_column(String(50), default="Desktop", nullable=False)
    os_name: Mapped[str] = mapped_column(String(50), default="Unknown", nullable=False)
    browser_name: Mapped[str] = mapped_column(String(50), default="Unknown", nullable=False)
    is_revoked: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    expires_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)
    last_activity: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
        nullable=False,
    )

    # Relationships
    user: Mapped["User"] = relationship("User")


class AuditLog(Base):
    """
    Immutable audit trail for all critical administrative actions.
    Preserved even after user deletion (SET NULL on user_id).
    """
    __tablename__ = "audit_logs"

    user_id: Mapped[str] = mapped_column(
        String(36), ForeignKey("users.id", ondelete="SET NULL"), nullable=True, index=True
    )
    action: Mapped[str] = mapped_column(String(100), nullable=False)       # e.g. EDIT_ATTENDANCE
    entity_name: Mapped[str] = mapped_column(String(50), nullable=False)   # e.g. attendance
    entity_id: Mapped[str] = mapped_column(String(36), nullable=False)     # UUID of target record
    ip_address: Mapped[str] = mapped_column(String(45), nullable=False)
    timestamp: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        nullable=False,
    )
    payload_delta: Mapped[str] = mapped_column(Text, nullable=False)       # JSON diff of changes

    # Relationships
    user: Mapped["User"] = relationship("User")
