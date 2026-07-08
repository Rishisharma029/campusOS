from sqlalchemy.ext.asyncio import AsyncSession
from app.services.academic import AcademicService
from app.schemas.academic import DepartmentCreate, CourseCreate, SubjectCreate
from app.models.academic import Department, Course, Subject
from typing import Sequence

class AcademicController:
    """
    Orchestrates department, course, and subject operations.
    Invokes the AcademicService and commits the transaction.
    """
    @staticmethod
    async def create_department(db: AsyncSession, dept_in: DepartmentCreate) -> Department:
        service = AcademicService(db)
        res = await service.create_department(dept_in)
        await db.commit()
        return res

    @staticmethod
    async def get_departments(db: AsyncSession, skip: int = 0, limit: int = 100) -> Sequence[Department]:
        service = AcademicService(db)
        return await service.get_departments(skip, limit)

    @staticmethod
    async def get_department(db: AsyncSession, dept_id: str) -> Department:
        service = AcademicService(db)
        return await service.get_department(dept_id)

    @staticmethod
    async def create_course(db: AsyncSession, course_in: CourseCreate) -> Course:
        service = AcademicService(db)
        res = await service.create_course(course_in)
        await db.commit()
        return res

    @staticmethod
    async def get_courses(db: AsyncSession, skip: int = 0, limit: int = 100) -> Sequence[Course]:
        service = AcademicService(db)
        return await service.get_courses(skip, limit)

    @staticmethod
    async def get_course(db: AsyncSession, course_id: str) -> Course:
        service = AcademicService(db)
        return await service.get_course(course_id)

    @staticmethod
    async def create_subject(db: AsyncSession, subject_in: SubjectCreate) -> Subject:
        service = AcademicService(db)
        res = await service.create_subject(subject_in)
        await db.commit()
        return res

    @staticmethod
    async def get_subjects(db: AsyncSession, skip: int = 0, limit: int = 100) -> Sequence[Subject]:
        service = AcademicService(db)
        return await service.get_subjects(skip, limit)

    @staticmethod
    async def get_subjects_by_course(db: AsyncSession, course_id: str) -> Sequence[Subject]:
        service = AcademicService(db)
        return await service.get_subjects_by_course(course_id)
