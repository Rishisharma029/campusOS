from pydantic import BaseModel, Field, ConfigDict
from datetime import datetime, date

class FeeCollectionBase(BaseModel):
    student_id: str
    invoice_no: str = Field(..., min_length=2, max_length=30)
    amount_total: float = Field(..., ge=0.0)
    amount_paid: float = Field(0.00, ge=0.0)
    due_date: date
    status: str = Field("Pending", description="Paid | Pending | Overdue")
    payment_mode: str = Field("Cash", description="Cash | Card | UPI | NetBanking")
    academic_year: str = Field("2025-26", min_length=4, max_length=10)
    fee_type: str = Field("Tuition", min_length=2, max_length=50)

class FeeCollectionCreate(FeeCollectionBase):
    pass

class FeePaymentUpdate(BaseModel):
    amount_paid: float = Field(..., ge=0.0)
    payment_mode: str = Field(..., min_length=2, max_length=30)

class FeeCollectionResponse(FeeCollectionBase):
    id: str
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)
