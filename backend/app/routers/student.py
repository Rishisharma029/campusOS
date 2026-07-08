from fastapi import APIRouter, Depends, status, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from app.database.session import get_db
from app.dependencies.auth import get_current_user, PermissionChecker
from app.schemas.student import StudentCreate, StudentResponse, StudentUpdate
from app.schemas.operation import AttendanceResponse, ResultResponse
from app.controllers.student import StudentController
from app.controllers.operation import OperationController
from app.models.user import User

router = APIRouter()

@router.get(
    "/students",
    response_model=list[StudentResponse],
    summary="Get all student profiles (Admin/Faculty only)"
)
async def get_students(
    skip: int = 0,
    limit: int = 100,
    db: AsyncSession = Depends(get_db),
    auth_user: User = Depends(PermissionChecker(["Admin", "Faculty"]))
):
    return await StudentController.get_students(db, skip, limit)

@router.post(
    "/students",
    response_model=StudentResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Create a new student profile (Admin only)"
)
async def create_student(
    student_in: StudentCreate,
    db: AsyncSession = Depends(get_db),
    admin_user: User = Depends(PermissionChecker(["Admin"]))
):
    return await StudentController.create_student(db, student_in)

@router.get(
    "/students/{id}",
    response_model=StudentResponse,
    summary="Get a student profile by ID"
)
async def get_student(
    id: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Enforce profile security: Students can only view their own profile.
    # Faculty and Admins can view any profile.
    student = await StudentController.get_student(db, id)
    if current_user.role == "Student" and student.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You are not authorized to view this student profile."
        )
    return student

@router.put(
    "/students/{id}",
    response_model=StudentResponse,
    summary="Update a student profile (Admin only)"
)
async def update_student(
    id: str,
    update_in: StudentUpdate,
    db: AsyncSession = Depends(get_db),
    admin_user: User = Depends(PermissionChecker(["Admin"]))
):
    return await StudentController.update_student(db, id, update_in)

@router.delete(
    "/students/{id}",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Delete a student profile (Admin only)"
)
async def delete_student(
    id: str,
    db: AsyncSession = Depends(get_db),
    admin_user: User = Depends(PermissionChecker(["Admin"]))
):
    await StudentController.delete_student(db, id)
    return None

@router.get(
    "/students/{id}/attendance",
    response_model=list[AttendanceResponse],
    summary="Get student attendance records"
)
async def get_student_attendance(
    id: str,
    skip: int = 0,
    limit: int = 100,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    student = await StudentController.get_student(db, id)
    if current_user.role == "Student" and student.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You are not authorized to view this student's attendance."
        )
    return await OperationController.get_attendance_by_student(db, id, skip, limit)

@router.get(
    "/students/{id}/results",
    response_model=list[ResultResponse],
    summary="Get student exam results"
)
async def get_student_results(
    id: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    student = await StudentController.get_student(db, id)
    if current_user.role == "Student" and student.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You are not authorized to view this student's exam results."
        )
    return await OperationController.get_results_by_student(db, id)
