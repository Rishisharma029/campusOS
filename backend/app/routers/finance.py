from fastapi import APIRouter, Depends, status, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from app.database.session import get_db
from app.dependencies.auth import get_current_user, PermissionChecker
from app.schemas.finance import FeeCollectionCreate, FeeCollectionResponse, FeePaymentUpdate
from app.controllers.finance import FinanceController
from app.controllers.student import StudentController
from app.models.user import User

router = APIRouter()

@router.get(
    "/fees",
    response_model=list[FeeCollectionResponse],
    summary="Get all fee collection ledgers (Admin/Accountant only)"
)
async def get_all_fees(
    skip: int = 0,
    limit: int = 100,
    db: AsyncSession = Depends(get_db),
    auth_user: User = Depends(PermissionChecker(["Admin", "Accountant"]))
):
    return await FinanceController.get_all_fees(db, skip, limit)

@router.post(
    "/fees",
    response_model=FeeCollectionResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Create a new fee ledger (Admin/Accountant only)"
)
async def create_fee(
    fee_in: FeeCollectionCreate,
    db: AsyncSession = Depends(get_db),
    auth_user: User = Depends(PermissionChecker(["Admin", "Accountant"]))
):
    return await FinanceController.create_fee(db, fee_in)

@router.get(
    "/fees/student/{student_id}",
    response_model=list[FeeCollectionResponse],
    summary="Get fee logs for a specific student"
)
async def get_fees_by_student(
    student_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Enforce profile security: Students can only view their own fees.
    # Faculty and Admins can view any student fees.
    student = await StudentController.get_student(db, student_id)
    if current_user.role == "Student" and student.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You are not authorized to view this student's fee ledgers."
        )
    return await FinanceController.get_fees_by_student(db, student_id)

@router.put(
    "/fees/{fee_id}/pay",
    response_model=FeeCollectionResponse,
    summary="Process a fee payment (Admin/Accountant only)"
)
async def pay_fee(
    fee_id: str,
    payment_in: FeePaymentUpdate,
    db: AsyncSession = Depends(get_db),
    auth_user: User = Depends(PermissionChecker(["Admin", "Accountant"]))
):
    return await FinanceController.pay_fee(db, fee_id, payment_in)
