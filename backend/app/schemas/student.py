from datetime import datetime

from pydantic import BaseModel, ConfigDict, EmailStr, Field


class StudentBase(BaseModel):
    user_id: str
    roll_no: str = Field(..., min_length=2, max_length=30)
    department: str = Field(..., min_length=2, max_length=50)
    course: str = Field(..., min_length=2, max_length=50)
    year: int = Field(1, ge=1, le=5)
    semester: int = Field(1, ge=1, le=10)
    enrollment_year: int = Field(2024, ge=2000, le=2100)
    cgpa: float = Field(8.00, ge=0.0, le=10.0)
    parent_name: str = Field(..., min_length=2, max_length=100)
    parent_email: EmailStr
    phone: str = Field(..., min_length=5, max_length=20)
    attendance_rate: float = Field(100.00, ge=0.0, le=100.0)
    status: str = Field("Active", description="Active | Suspended | Graduated | Dropped")
    hostel_room: str = "Unassigned"
    transport_bus: str = "None"
    placement_status: str = "Preparing"


class StudentCreate(StudentBase):
    pass


class StudentUpdate(BaseModel):
    year: int | None = Field(None, ge=1, le=5)
    semester: int | None = Field(None, ge=1, le=10)
    cgpa: float | None = Field(None, ge=0.0, le=10.0)
    status: str | None = None
    hostel_room: str | None = None
    transport_bus: str | None = None
    placement_status: str | None = None
    parent_name: str | None = None
    parent_email: EmailStr | None = None
    phone: str | None = None


class StudentResponse(StudentBase):
    id: str
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)
