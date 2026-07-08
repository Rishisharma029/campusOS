from sqlalchemy import String, Boolean
from sqlalchemy.orm import Mapped, mapped_column
from app.database.base_model import Base

class User(Base):
    """
    SQLAlchemy model representing system users (students, faculty, administrators, parents, etc.).
    """
    __tablename__ = "users"
    
    email: Mapped[str] = mapped_column(
        String(255),
        unique=True,
        index=True,
        nullable=False
    )
    
    hashed_password: Mapped[str] = mapped_column(
        String(255),
        nullable=False
    )
    
    name: Mapped[str] = mapped_column(
        String(100),
        nullable=False
    )
    
    role: Mapped[str] = mapped_column(
        String(50),
        default="Student",
        nullable=False
    )
    
    is_active: Mapped[bool] = mapped_column(
        Boolean,
        default=True,
        nullable=False
    )
    
    otp_secret: Mapped[str] = mapped_column(
        String(100),
        nullable=True
    )
