from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession
from app.database.session import get_db
from app.dependencies.auth import PermissionChecker
from app.schemas.operation import AttendanceCreate, AttendanceResponse, ResultCreate, ResultResponse
from app.controllers.operation import OperationController
from app.models.user import User

router = APIRouter()

@router.get(
    "/attendance",
    response_model=list[AttendanceResponse],
    summary="Get attendance logs for a student (Admin/Faculty only)"
)
async def get_attendance(
    student_id: str,
    skip: int = 0,
    limit: int = 100,
    db: AsyncSession = Depends(get_db),
    auth_user: User = Depends(PermissionChecker(["Admin", "Faculty"]))
):
    return await OperationController.get_attendance_by_student(db, student_id, skip, limit)

@router.post(
    "/attendance",
    response_model=AttendanceResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Submit student attendance (Admin/Faculty only)"
)
async def submit_attendance(
    att_in: AttendanceCreate,
    db: AsyncSession = Depends(get_db),
    auth_user: User = Depends(PermissionChecker(["Admin", "Faculty"]))
):
    return await OperationController.create_attendance(db, att_in)

@router.get(
    "/results",
    response_model=list[ResultResponse],
    summary="Get exam results for a student (Admin/Faculty only)"
)
async def get_results(
    student_id: str,
    db: AsyncSession = Depends(get_db),
    auth_user: User = Depends(PermissionChecker(["Admin", "Faculty"]))
):
    return await OperationController.get_results_by_student(db, student_id)

@router.post(
    "/results",
    response_model=ResultResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Submit student exam result (Admin/Faculty only)"
)
async def submit_result(
    res_in: ResultCreate,
    db: AsyncSession = Depends(get_db),
    auth_user: User = Depends(PermissionChecker(["Admin", "Faculty"]))
):
    return await OperationController.create_result(db, res_in)
