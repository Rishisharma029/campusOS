from fastapi import HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from app.repositories.academic import AcademicRepository
from app.schemas.academic import DepartmentCreate, CourseCreate, SubjectCreate
from app.models.academic import Department, Course, Subject
from typing import Sequence

class AcademicService:
    """
    Business logic for Academics: Department, Course, and Subject.
    Checks code uniqueness and coordinates queries.
    """
    def __init__(self, db: AsyncSession):
        self.repo = AcademicRepository(db)

    # Department
    async def create_department(self, dept_in: DepartmentCreate) -> Department:
        existing = await self.repo.get_department_by_code(dept_in.code)
        if existing:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Department code '{dept_in.code}' is already registered."
            )
        return await self.repo.create_department(dept_in)

    async def get_departments(self, skip: int = 0, limit: int = 100) -> Sequence[Department]:
        return await self.repo.get_all_departments(skip, limit)

    async def get_department(self, dept_id: str) -> Department:
        dept = await self.repo.get_department_by_id(dept_id)
        if not dept:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Department not found."
            )
        return dept

    # Course
    async def create_course(self, course_in: CourseCreate) -> Course:
        # Check course code
        existing = await self.repo.get_course_by_code(course_in.code)
        if existing:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Course code '{course_in.code}' is already registered."
            )
        # Check department existence
        await self.get_department(course_in.department_id)
        return await self.repo.create_course(course_in)

    async def get_courses(self, skip: int = 0, limit: int = 100) -> Sequence[Course]:
        return await self.repo.get_all_courses(skip, limit)

    async def get_course(self, course_id: str) -> Course:
        course = await self.repo.get_course_by_id(course_id)
        if not course:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Course not found."
            )
        return course

    # Subject
    async def create_subject(self, subject_in: SubjectCreate) -> Subject:
        # Check subject code
        existing = await self.repo.get_subject_by_code(subject_in.code)
        if existing:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Subject code '{subject_in.code}' is already registered."
            )
        # Check course existence
        await self.get_course(subject_in.course_id)
        return await self.repo.create_subject(subject_in)

    async def get_subjects(self, skip: int = 0, limit: int = 100) -> Sequence[Subject]:
        return await self.repo.get_all_subjects(skip, limit)

    async def get_subjects_by_course(self, course_id: str) -> Sequence[Subject]:
        await self.get_course(course_id)
        return await self.repo.get_subjects_by_course(course_id)
