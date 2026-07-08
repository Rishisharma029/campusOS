from typing import Optional, Sequence
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.models.academic import Department, Course, Subject
from app.schemas.academic import DepartmentCreate, CourseCreate, SubjectCreate

class AcademicRepository:
    """
    Handles database operations for Department, Course, and Subject records.
    """
    def __init__(self, db: AsyncSession):
        self.db = db

    # Department
    async def get_all_departments(self, skip: int = 0, limit: int = 100) -> Sequence[Department]:
        result = await self.db.execute(select(Department).offset(skip).limit(limit))
        return result.scalars().all()

    async def get_department_by_id(self, dept_id: str) -> Optional[Department]:
        result = await self.db.execute(select(Department).where(Department.id == dept_id))
        return result.scalars().first()

    async def get_department_by_code(self, code: str) -> Optional[Department]:
        result = await self.db.execute(select(Department).where(Department.code == code))
        return result.scalars().first()

    async def create_department(self, dept_in: DepartmentCreate) -> Department:
        db_dept = Department(name=dept_in.name, code=dept_in.code)
        self.db.add(db_dept)
        await self.db.flush()
        return db_dept

    # Course
    async def get_all_courses(self, skip: int = 0, limit: int = 100) -> Sequence[Course]:
        result = await self.db.execute(select(Course).offset(skip).limit(limit))
        return result.scalars().all()

    async def get_course_by_id(self, course_id: str) -> Optional[Course]:
        result = await self.db.execute(select(Course).where(Course.id == course_id))
        return result.scalars().first()

    async def get_course_by_code(self, code: str) -> Optional[Course]:
        result = await self.db.execute(select(Course).where(Course.code == code))
        return result.scalars().first()

    async def create_course(self, course_in: CourseCreate) -> Course:
        db_course = Course(
            department_id=course_in.department_id,
            name=course_in.name,
            code=course_in.code,
            duration_years=course_in.duration_years
        )
        self.db.add(db_course)
        await self.db.flush()
        return db_course

    # Subject
    async def get_all_subjects(self, skip: int = 0, limit: int = 100) -> Sequence[Subject]:
        result = await self.db.execute(select(Subject).offset(skip).limit(limit))
        return result.scalars().all()

    async def get_subject_by_id(self, subject_id: str) -> Optional[Subject]:
        result = await self.db.execute(select(Subject).where(Subject.id == subject_id))
        return result.scalars().first()

    async def get_subject_by_code(self, code: str) -> Optional[Subject]:
        result = await self.db.execute(select(Subject).where(Subject.code == code))
        return result.scalars().first()

    async def get_subjects_by_course(self, course_id: str) -> Sequence[Subject]:
        result = await self.db.execute(select(Subject).where(Subject.course_id == course_id))
        return result.scalars().all()

    async def create_subject(self, subject_in: SubjectCreate) -> Subject:
        db_subject = Subject(
            course_id=subject_in.course_id,
            name=subject_in.name,
            code=subject_in.code,
            credits=subject_in.credits
        )
        self.db.add(db_subject)
        await self.db.flush()
        return db_subject
