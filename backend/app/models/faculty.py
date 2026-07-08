from sqlalchemy import String, Integer, ForeignKey, Date
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.database.base_model import Base
from datetime import date

class Faculty(Base):
    """
    SQLAlchemy model representing Faculty staff profiles, linked to User credentials records.
    """
    __tablename__ = "faculty"

    user_id: Mapped[str] = mapped_column(String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    employee_id: Mapped[str] = mapped_column(String(30), unique=True, nullable=False)
    department_id: Mapped[str] = mapped_column(String(36), ForeignKey("departments.id", ondelete="SET NULL"), nullable=True)
    designation: Mapped[str] = mapped_column(String(100), nullable=False)
    workload_hours: Mapped[int] = mapped_column(Integer, default=14, nullable=False)
    qualification: Mapped[str] = mapped_column(String(100), default="B.E.", nullable=False)
    join_date: Mapped[date | None] = mapped_column(Date, nullable=True)
    status: Mapped[str] = mapped_column(String(20), default="Active", nullable=False) # Active | On Leave | Terminated

    # Relationships
    user: Mapped["User"] = relationship("User")
    department: Mapped["Department"] = relationship("Department", back_populates="faculty_members")
    leaves: Mapped[list["FacultyLeave"]] = relationship("FacultyLeave", back_populates="faculty", cascade="all, delete-orphan")

class FacultyLeave(Base):
    """
    SQLAlchemy model representing staff leave logs (e.g. sick, casual leave).
    """
    __tablename__ = "leaves"

    faculty_id: Mapped[str] = mapped_column(String(36), ForeignKey("faculty.id", ondelete="CASCADE"), nullable=False)
    start_date: Mapped[date] = mapped_column(Date, nullable=False)
    end_date: Mapped[date] = mapped_column(Date, nullable=False)
    reason: Mapped[str] = mapped_column(String(255), nullable=False)
    status: Mapped[str] = mapped_column(String(20), default="Pending", nullable=False)

    # Relationships
    faculty: Mapped["Faculty"] = relationship("Faculty", back_populates="leaves")
