from fastapi import APIRouter, Depends, status, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from app.database.session import get_db
from app.dependencies.auth import get_current_user, PermissionChecker
from app.schemas.faculty import (
    FacultyCreate, FacultyResponse, FacultyUpdate,
    LeaveCreate, LeaveResponse, LeaveStatusUpdate
)
from app.controllers.faculty import FacultyController
from app.models.user import User

router = APIRouter()

@router.get(
    "/faculty",
    response_model=list[FacultyResponse],
    summary="Get all faculty members (Admin/Faculty only)"
)
async def get_faculty_members(
    skip: int = 0,
    limit: int = 100,
    db: AsyncSession = Depends(get_db),
    auth_user: User = Depends(PermissionChecker(["Admin", "Faculty"]))
):
    return await FacultyController.get_faculty_members(db, skip, limit)

@router.post(
    "/faculty",
    response_model=FacultyResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Create a new faculty profile (Admin only)"
)
async def create_faculty(
    faculty_in: FacultyCreate,
    db: AsyncSession = Depends(get_db),
    admin_user: User = Depends(PermissionChecker(["Admin"]))
):
    return await FacultyController.create_faculty(db, faculty_in)

@router.get(
    "/faculty/{id}",
    response_model=FacultyResponse,
    summary="Get a faculty profile by ID"
)
async def get_faculty_member(
    id: str,
    db: AsyncSession = Depends(get_db),
    auth_user: User = Depends(PermissionChecker(["Admin", "Faculty"]))
):
    return await FacultyController.get_faculty_member(db, id)

@router.put(
    "/faculty/{id}",
    response_model=FacultyResponse,
    summary="Update a faculty profile (Admin only)"
)
async def update_faculty(
    id: str,
    update_in: FacultyUpdate,
    db: AsyncSession = Depends(get_db),
    admin_user: User = Depends(PermissionChecker(["Admin"]))
):
    return await FacultyController.update_faculty(db, id, update_in)

@router.get(
    "/faculty/{id}/leaves",
    response_model=list[LeaveResponse],
    summary="Get leave applications for a faculty member"
)
async def get_leaves(
    id: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    faculty = await FacultyController.get_faculty_member(db, id)
    if current_user.role == "Faculty" and faculty.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You are not authorized to view this faculty's leaves."
        )
    return await FacultyController.get_leaves(db, id)

@router.post(
    "/faculty/{id}/leaves",
    response_model=LeaveResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Apply for leave (Faculty only)"
)
async def apply_leave(
    id: str,
    leave_in: LeaveCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(PermissionChecker(["Faculty"]))
):
    faculty = await FacultyController.get_faculty_member(db, id)
    if faculty.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You can only apply for leaves under your own faculty profile."
        )
    return await FacultyController.apply_leave(db, leave_in)

@router.put(
    "/faculty/leaves/{leave_id}/status",
    response_model=LeaveResponse,
    summary="Approve or reject a leave application (Admin only)"
)
async def update_leave_status(
    leave_id: str,
    status_in: LeaveStatusUpdate,
    db: AsyncSession = Depends(get_db),
    admin_user: User = Depends(PermissionChecker(["Admin"]))
):
    return await FacultyController.update_leave_status(db, leave_id, status_in.status)
