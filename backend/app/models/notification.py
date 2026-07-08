from datetime import datetime, timezone
from sqlalchemy import String, Boolean, DateTime, ForeignKey, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.database.base_model import Base


class Notification(Base):
    """
    Per-user system notification.
    - user_id FK allows targeting individual users (SET NULL if user deleted, preserving history).
    - category enables client-side icon and color routing.
    - read flag tracks dismissed state.
    """
    __tablename__ = "notifications"

    # Target user — nullable allows system-wide broadcast notifications (user_id = NULL)
    user_id: Mapped[str | None] = mapped_column(
        String(36),
        ForeignKey("users.id", ondelete="SET NULL"),
        nullable=True,
        index=True,
    )

    title: Mapped[str] = mapped_column(String(100), nullable=False)
    message: Mapped[str] = mapped_column(Text, nullable=False)
    category: Mapped[str] = mapped_column(
        String(30), nullable=False
    )  # fee | exam | placement | academic | system
    read: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    timestamp: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        nullable=False,
    )

    # Relationships
    user: Mapped["User | None"] = relationship("User")
