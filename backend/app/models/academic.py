from sqlalchemy import String, Integer, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.database.base_model import Base

class Department(Base):
    """
    SQLAlchemy model representing college academic departments (e.g. CSE, ECE, ME).
    """
    __tablename__ = "departments"

    name: Mapped[str] = mapped_column(String(100), unique=True, nullable=False)
    code: Mapped[str] = mapped_column(String(10), unique=True, nullable=False)

    # Relationships
    courses: Mapped[list["Course"]] = relationship("Course", back_populates="department", cascade="all, delete-orphan")
    faculty_members: Mapped[list["Faculty"]] = relationship("Faculty", back_populates="department")

class Course(Base):
    """
    SQLAlchemy model representing degrees offered (e.g. B.Tech Computer Science).
    """
    __tablename__ = "courses"

    department_id: Mapped[str] = mapped_column(String(36), ForeignKey("departments.id", ondelete="CASCADE"), nullable=False)
    name: Mapped[str] = mapped_column(String(100), nullable=False)
    code: Mapped[str] = mapped_column(String(10), unique=True, nullable=False)
    duration_years: Mapped[int] = mapped_column(Integer, default=4, nullable=False)

    # Relationships
    department: Mapped["Department"] = relationship("Department", back_populates="courses")
    subjects: Mapped[list["Subject"]] = relationship("Subject", back_populates="course", cascade="all, delete-orphan")

class Subject(Base):
    """
    SQLAlchemy model representing single modules taught in courses (e.g. CS-302 Algorithms).
    """
    __tablename__ = "subjects"

    course_id: Mapped[str] = mapped_column(String(36), ForeignKey("courses.id", ondelete="CASCADE"), nullable=False)
    name: Mapped[str] = mapped_column(String(100), nullable=False)
    code: Mapped[str] = mapped_column(String(10), unique=True, nullable=False)
    credits: Mapped[int] = mapped_column(Integer, default=3, nullable=False)

    # Relationships
    course: Mapped["Course"] = relationship("Course", back_populates="subjects")
