from pydantic import BaseModel, Field, ConfigDict
from datetime import datetime, date

class AttendanceBase(BaseModel):
    student_id: str
    subject_code: str = Field(..., min_length=2, max_length=20)
    date: date
    status: str = Field("Present", description="Present | Absent | Late")

class AttendanceCreate(AttendanceBase):
    pass

class AttendanceResponse(AttendanceBase):
    id: str
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)

class ResultBase(BaseModel):
    student_id: str
    subject_name: str = Field(..., min_length=2, max_length=100)
    marks_obtained: int = Field(..., ge=0)
    max_marks: int = Field(100, ge=1)
    grade: str = Field(..., min_length=1, max_length=5)
    exam_type: str = Field("End Semester", description="End Semester | Internal | Midterm")

class ResultCreate(ResultBase):
    pass

class ResultResponse(ResultBase):
    id: str
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)
