from sqlalchemy import String, Integer, Numeric, ForeignKey, Date, Index
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.database.base_model import Base
from datetime import date

class Book(Base):
    """
    SQLAlchemy model representing library catalog books.
    """
    __tablename__ = "books"

    title: Mapped[str] = mapped_column(String(255), nullable=False)
    author: Mapped[str] = mapped_column(String(255), nullable=False)
    isbn: Mapped[str] = mapped_column(String(20), unique=True, nullable=False)
    category: Mapped[str] = mapped_column(String(50), nullable=False)
    copies_total: Mapped[int] = mapped_column(Integer, default=1, nullable=False)
    copies_available: Mapped[int] = mapped_column(Integer, default=1, nullable=False)

    # Relationships
    borrows: Mapped[list["BookBorrow"]] = relationship("BookBorrow", back_populates="book", cascade="all, delete-orphan")

class BookBorrow(Base):
    """
    SQLAlchemy model representing checkout sessions of library books by students.
    """
    __tablename__ = "book_borrows"

    book_id: Mapped[str] = mapped_column(String(36), ForeignKey("books.id", ondelete="CASCADE"), nullable=False)
    student_id: Mapped[str] = mapped_column(String(36), ForeignKey("students.id", ondelete="CASCADE"), nullable=False)
    issue_date: Mapped[date] = mapped_column(Date, nullable=False)
    due_date: Mapped[date] = mapped_column(Date, nullable=False)
    return_date: Mapped[date] = mapped_column(Date, nullable=True)
    fine_amount: Mapped[float] = mapped_column(Numeric(8, 2), default=0.00, nullable=False)

    # Relationships
    book: Mapped["Book"] = relationship("Book", back_populates="borrows")
    student: Mapped["Student"] = relationship("Student", back_populates="book_borrows")

    __table_args__ = (
        Index("ix_borrows_student", "student_id"),
        Index("ix_borrows_book", "book_id"),
    )
