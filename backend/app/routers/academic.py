from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession
from app.database.session import get_db
from app.dependencies.auth import get_current_user, PermissionChecker
from app.schemas.academic import (
    DepartmentCreate, DepartmentResponse,
    CourseCreate, CourseResponse,
    SubjectCreate, SubjectResponse
)
from app.controllers.academic import AcademicController
from app.models.user import User
from typing import Sequence

router = APIRouter()

# ── Departments ──────────────────────────────────────────────────────────────

@router.get(
    "/departments",
    response_model=list[DepartmentResponse],
    summary="Get all academic departments"
)
async def get_departments(
    skip: int = 0,
    limit: int = 100,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return await AcademicController.get_departments(db, skip, limit)

@router.post(
    "/departments",
    response_model=DepartmentResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Create a new academic department (Admin only)"
)
async def create_department(
    dept_in: DepartmentCreate,
    db: AsyncSession = Depends(get_db),
    admin_user: User = Depends(PermissionChecker(["Admin"]))
):
    return await AcademicController.create_department(db, dept_in)

@router.get(
    "/departments/{id}",
    response_model=DepartmentResponse,
    summary="Get a department by ID"
)
async def get_department(
    id: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return await AcademicController.get_department(db, id)


# ── Courses ───────────────────────────────────────────────────────────────────

@router.get(
    "/courses",
    response_model=list[CourseResponse],
    summary="Get all academic courses"
)
async def get_courses(
    skip: int = 0,
    limit: int = 100,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return await AcademicController.get_courses(db, skip, limit)

@router.post(
    "/courses",
    response_model=CourseResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Create a new course (Admin only)"
)
async def create_course(
    course_in: CourseCreate,
    db: AsyncSession = Depends(get_db),
    admin_user: User = Depends(PermissionChecker(["Admin"]))
):
    return await AcademicController.create_course(db, course_in)

@router.get(
    "/courses/{id}",
    response_model=CourseResponse,
    summary="Get a course by ID"
)
async def get_course(
    id: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return await AcademicController.get_course(db, id)


# ── Subjects ──────────────────────────────────────────────────────────────────

@router.get(
    "/subjects",
    response_model=list[SubjectResponse],
    summary="Get all academic subjects"
)
async def get_subjects(
    skip: int = 0,
    limit: int = 100,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return await AcademicController.get_subjects(db, skip, limit)

@router.post(
    "/subjects",
    response_model=SubjectResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Create a new subject (Admin only)"
)
async def create_subject(
    subject_in: SubjectCreate,
    db: AsyncSession = Depends(get_db),
    admin_user: User = Depends(PermissionChecker(["Admin"]))
):
    return await AcademicController.create_subject(db, subject_in)

@router.get(
    "/subjects/course/{course_id}",
    response_model=list[SubjectResponse],
    summary="Get all subjects of a course"
)
async def get_subjects_by_course(
    course_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return await AcademicController.get_subjects_by_course(db, course_id)
