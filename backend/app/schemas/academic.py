from pydantic import BaseModel, Field, ConfigDict
from datetime import datetime

class DepartmentBase(BaseModel):
    name: str = Field(..., min_length=2, max_length=100)
    code: str = Field(..., min_length=1, max_length=10)

class DepartmentCreate(DepartmentBase):
    pass

class DepartmentResponse(DepartmentBase):
    id: str
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)

class CourseBase(BaseModel):
    department_id: str
    name: str = Field(..., min_length=2, max_length=100)
    code: str = Field(..., min_length=1, max_length=10)
    duration_years: int = 4

class CourseCreate(CourseBase):
    pass

class CourseResponse(CourseBase):
    id: str
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)

class SubjectBase(BaseModel):
    course_id: str
    name: str = Field(..., min_length=2, max_length=100)
    code: str = Field(..., min_length=1, max_length=20)
    credits: int = 3

class SubjectCreate(SubjectBase):
    pass

class SubjectResponse(SubjectBase):
    id: str
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)
