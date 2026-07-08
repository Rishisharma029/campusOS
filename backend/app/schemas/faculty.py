from pydantic import BaseModel, Field, ConfigDict
from datetime import datetime, date
from typing import Optional

class FacultyBase(BaseModel):
    user_id: str
    employee_id: str = Field(..., min_length=2, max_length=30)
    department_id: Optional[str] = None
    designation: str = Field(..., min_length=2, max_length=100)
    workload_hours: int = Field(14, ge=0, le=40)
    qualification: str = Field("B.E.", min_length=2, max_length=100)
    join_date: Optional[date] = None
    status: str = Field("Active", description="Active | On Leave | Terminated")

class FacultyCreate(FacultyBase):
    pass

class FacultyUpdate(BaseModel):
    designation: Optional[str] = None
    workload_hours: Optional[int] = None
    qualification: Optional[str] = None
    status: Optional[str] = None

class FacultyResponse(FacultyBase):
    id: str
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)

class LeaveBase(BaseModel):
    faculty_id: str
    start_date: date
    end_date: date
    reason: str = Field(..., min_length=5, max_length=255)

class LeaveCreate(LeaveBase):
    pass

class LeaveStatusUpdate(BaseModel):
    status: str = Field(..., description="Pending | Approved | Rejected")

class LeaveResponse(LeaveBase):
    id: str
    status: str
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)
