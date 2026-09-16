from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.controllers.operation import OperationController
from app.controllers.student import StudentController
from app.database.session import get_db
from app.dependencies.auth import PermissionChecker, get_current_user
from app.models.user import User
from app.schemas.operation import (
    AttendanceBatchSync,
    AttendanceCreate,
    AttendanceResponse,
    AttendanceUpdate,
    ResultCreate,
    ResultResponse,
)

router = APIRouter()


@router.get(
    "/attendance",
    response_model=list[AttendanceResponse],
    summary="Get attendance logs for a student",
)
async def get_attendance(
    student_id: str,
    skip: int = 0,
    limit: int = 100,
    db: AsyncSession = Depends(get_db),
    auth_user: User = Depends(get_current_user),
):
    if auth_user.role == "Student":
        student = await StudentController.get_student(db, student_id)
        if student.user_id != auth_user.id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You are not authorized to view this student's attendance.",
            )
    elif auth_user.role not in ["Admin", "Faculty"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Permission denied.",
        )
    return await OperationController.get_attendance_by_student(db, student_id, skip, limit)


@router.post(
    "/attendance",
    response_model=AttendanceResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Submit or upsert student attendance",
)
async def submit_attendance(
    att_in: AttendanceCreate,
    db: AsyncSession = Depends(get_db),
    auth_user: User = Depends(get_current_user),
):
    if auth_user.role not in ["Admin", "Faculty", "Student"]:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Permission denied.")
    return await OperationController.create_attendance(db, att_in)


@router.put(
    "/attendance/{attendance_id}",
    response_model=AttendanceResponse,
    summary="Update or rectify student attendance status (Absent <-> Present)",
)
async def update_attendance_status(
    attendance_id: str,
    att_update: AttendanceUpdate,
    db: AsyncSession = Depends(get_db),
    auth_user: User = Depends(get_current_user),
):
    if auth_user.role not in ["Admin", "Faculty", "Student"]:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Permission denied.")
    res = await OperationController.update_attendance(db, attendance_id, att_update.status)
    if not res:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Attendance record not found")
    return res


@router.post(
    "/attendance/sync",
    response_model=list[AttendanceResponse],
    summary="Batch sync attendance records (Low-internet & offline sync)",
)
async def sync_attendance_batch(
    sync_in: AttendanceBatchSync,
    db: AsyncSession = Depends(get_db),
    auth_user: User = Depends(get_current_user),
):
    if auth_user.role not in ["Admin", "Faculty", "Student"]:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Permission denied.")
    return await OperationController.batch_sync_attendance(db, sync_in.records)


@router.get(
    "/results",
    response_model=list[ResultResponse],
    summary="Get exam results for a student (Admin/Faculty only)",
)
async def get_results(
    student_id: str,
    db: AsyncSession = Depends(get_db),
    auth_user: User = Depends(PermissionChecker(["Admin", "Faculty"])),
):
    return await OperationController.get_results_by_student(db, student_id)


@router.post(
    "/results",
    response_model=ResultResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Submit student exam result (Admin/Faculty only)",
)
async def submit_result(
    res_in: ResultCreate,
    db: AsyncSession = Depends(get_db),
    auth_user: User = Depends(PermissionChecker(["Admin", "Faculty"])),
):
    return await OperationController.create_result(db, res_in)
