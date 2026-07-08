from typing import Optional, Sequence
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.models.student import Student
from app.schemas.student import StudentCreate, StudentUpdate

class StudentRepository:
    """
    Handles database operations for Student records.
    """
    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_all(self, skip: int = 0, limit: int = 100) -> Sequence[Student]:
        result = await self.db.execute(select(Student).offset(skip).limit(limit))
        return result.scalars().all()

    async def get_by_id(self, student_id: str) -> Optional[Student]:
        result = await self.db.execute(select(Student).where(Student.id == student_id))
        return result.scalars().first()

    async def get_by_roll_no(self, roll_no: str) -> Optional[Student]:
        result = await self.db.execute(select(Student).where(Student.roll_no == roll_no))
        return result.scalars().first()

    async def get_by_user_id(self, user_id: str) -> Optional[Student]:
        result = await self.db.execute(select(Student).where(Student.user_id == user_id))
        return result.scalars().first()

    async def create(self, student_in: StudentCreate) -> Student:
        db_student = Student(
            user_id=student_in.user_id,
            roll_no=student_in.roll_no,
            department=student_in.department,
            course=student_in.course,
            year=student_in.year,
            semester=student_in.semester,
            enrollment_year=student_in.enrollment_year,
            cgpa=student_in.cgpa,
            parent_name=student_in.parent_name,
            parent_email=student_in.parent_email,
            phone=student_in.phone,
            attendance_rate=student_in.attendance_rate,
            status=student_in.status,
            hostel_room=student_in.hostel_room,
            transport_bus=student_in.transport_bus,
            placement_status=student_in.placement_status
        )
        self.db.add(db_student)
        await self.db.flush()
        return db_student

    async def update(self, student: Student, update_data: StudentUpdate) -> Student:
        obj_data = update_data.model_dump(exclude_unset=True)
        for field in obj_data:
            setattr(student, field, obj_data[field])
        self.db.add(student)
        await self.db.flush()
        return student

    async def delete(self, student: Student) -> None:
        await self.db.delete(student)
        await self.db.flush()
