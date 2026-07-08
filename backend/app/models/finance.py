from sqlalchemy import String, Numeric, ForeignKey, Date, Index
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.database.base_model import Base
from datetime import date

class FeeCollection(Base):
    """
    SQLAlchemy model representing annual fee collections and payment logs.
    """
    __tablename__ = "fee_collections"

    student_id: Mapped[str] = mapped_column(String(36), ForeignKey("students.id", ondelete="CASCADE"), nullable=False)
    invoice_no: Mapped[str] = mapped_column(String(30), unique=True, nullable=False)
    amount_total: Mapped[float] = mapped_column(Numeric(12, 2), nullable=False)
    amount_paid: Mapped[float] = mapped_column(Numeric(12, 2), default=0.00, nullable=False)
    due_date: Mapped[date] = mapped_column(Date, nullable=False)
    status: Mapped[str] = mapped_column(String(20), default="Pending", nullable=False) # Paid, Pending, Overdue
    payment_mode: Mapped[str] = mapped_column(String(30), default="Cash", nullable=False)
    academic_year: Mapped[str] = mapped_column(String(10), default="2025-26", nullable=False)
    fee_type: Mapped[str] = mapped_column(String(50), default="Tuition", nullable=False)

    # Relationships
    student: Mapped["Student"] = relationship("Student", back_populates="fee_collections")

    __table_args__ = (
        Index("ix_fee_collections_student_status", "student_id", "status"),
    )
