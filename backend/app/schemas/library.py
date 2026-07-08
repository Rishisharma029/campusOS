from pydantic import BaseModel, Field, ConfigDict
from datetime import datetime, date
from typing import Optional

class BookBase(BaseModel):
    title: str = Field(..., min_length=1, max_length=255)
    author: str = Field(..., min_length=1, max_length=255)
    isbn: str = Field(..., min_length=5, max_length=20)
    category: str = Field(..., min_length=2, max_length=50)
    copies_total: int = Field(1, ge=0)

class BookCreate(BookBase):
    pass

class BookResponse(BookBase):
    id: str
    copies_available: int
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)

class BorrowBase(BaseModel):
    book_id: str
    student_id: str
    issue_date: date
    due_date: date

class BorrowCreate(BorrowBase):
    pass

class BorrowResponse(BorrowBase):
    id: str
    return_date: Optional[date] = None
    fine_amount: float
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)

class ReturnRequest(BaseModel):
    return_date: date
