from sqlalchemy import String, Integer, Numeric, ForeignKey, Index
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.database.base_model import Base

class Student(Base):
    """
    SQLAlchemy model representing Student profiles, linked to User credentials records.
    """
    __tablename__ = "students"

    user_id: Mapped[str] = mapped_column(String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    roll_no: Mapped[str] = mapped_column(String(30), unique=True, index=True, nullable=False)
    department: Mapped[str] = mapped_column(String(50), nullable=False)
    course: Mapped[str] = mapped_column(String(50), nullable=False)
    year: Mapped[int] = mapped_column(Integer, default=1, nullable=False)
    semester: Mapped[int] = mapped_column(Integer, default=1, nullable=False)
    enrollment_year: Mapped[int] = mapped_column(Integer, default=2024, nullable=False)
    cgpa: Mapped[float] = mapped_column(Numeric(4, 2), default=8.00, nullable=False)
    parent_name: Mapped[str] = mapped_column(String(100), nullable=False)
    parent_email: Mapped[str] = mapped_column(String(255), nullable=False)
    phone: Mapped[str] = mapped_column(String(20), nullable=False)
    attendance_rate: Mapped[float] = mapped_column(Numeric(5, 2), default=100.00, nullable=False)
    status: Mapped[str] = mapped_column(String(20), default="Active", nullable=False) # Active | Suspended | Graduated | Dropped
    hostel_room: Mapped[str] = mapped_column(String(50), default="Unassigned", nullable=False)
    transport_bus: Mapped[str] = mapped_column(String(50), default="None", nullable=False)
    placement_status: Mapped[str] = mapped_column(String(50), default="Preparing", nullable=False)

    # Relationships
    user: Mapped["User"] = relationship("User")
    attendance_records: Mapped[list["Attendance"]] = relationship("Attendance", back_populates="student", cascade="all, delete-orphan")
    exam_results: Mapped[list["Result"]] = relationship("Result", back_populates="student", cascade="all, delete-orphan")
    fee_collections: Mapped[list["FeeCollection"]] = relationship("FeeCollection", back_populates="student", cascade="all, delete-orphan")
    book_borrows: Mapped[list["BookBorrow"]] = relationship("BookBorrow", back_populates="student", cascade="all, delete-orphan")

    __table_args__ = (
        Index("ix_students_department_enrollment_year", "department", "enrollment_year"),
    )
