from sqlalchemy import String, Integer, ForeignKey, Date, Index
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.database.base_model import Base
from datetime import date

class Attendance(Base):
    """
    SQLAlchemy model representing daily student attendance log entries.
    """
    __tablename__ = "attendance"

    student_id: Mapped[str] = mapped_column(String(36), ForeignKey("students.id", ondelete="CASCADE"), nullable=False)
    subject_code: Mapped[str] = mapped_column(String(20), nullable=False)
    date: Mapped[date] = mapped_column(Date, nullable=False)
    status: Mapped[str] = mapped_column(String(15), nullable=False) # e.g. Present, Absent, Late

    # Relationships
    student: Mapped["Student"] = relationship("Student", back_populates="attendance_records")

    __table_args__ = (
        Index("ix_attendance_student_date", "student_id", "date"),
    )

class Result(Base):
    """
    SQLAlchemy model representing academic evaluation scores.
    """
    __tablename__ = "results"

    student_id: Mapped[str] = mapped_column(String(36), ForeignKey("students.id", ondelete="CASCADE"), nullable=False)
    subject_name: Mapped[str] = mapped_column(String(100), nullable=False)
    marks_obtained: Mapped[int] = mapped_column(Integer, nullable=False)
    max_marks: Mapped[int] = mapped_column(Integer, default=100, nullable=False)
    grade: Mapped[str] = mapped_column(String(5), nullable=False) # e.g. O, A+, A
    exam_type: Mapped[str] = mapped_column(String(20), default="End Semester", nullable=False)

    # Relationships
    student: Mapped["Student"] = relationship("Student", back_populates="exam_results")
