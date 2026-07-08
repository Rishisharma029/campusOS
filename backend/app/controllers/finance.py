from sqlalchemy.ext.asyncio import AsyncSession
from fastapi import HTTPException, status
from app.repositories.finance import FinanceRepository
from app.schemas.finance import FeeCollectionCreate, FeePaymentUpdate
from app.models.finance import FeeCollection
from typing import Sequence

class FinanceController:
    """
    Orchestrates fee record collections and payments.
    """
    @staticmethod
    async def get_all_fees(db: AsyncSession, skip: int = 0, limit: int = 100) -> Sequence[FeeCollection]:
        repo = FinanceRepository(db)
        return await repo.get_all_fees(skip, limit)

    @staticmethod
    async def get_fees_by_student(db: AsyncSession, student_id: str) -> Sequence[FeeCollection]:
        repo = FinanceRepository(db)
        return await repo.get_fees_by_student(student_id)

    @staticmethod
    async def create_fee(db: AsyncSession, fee_in: FeeCollectionCreate) -> FeeCollection:
        repo = FinanceRepository(db)
        # Check unique invoice
        existing = await repo.get_by_invoice_no(fee_in.invoice_no)
        if existing:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Fee invoice '{fee_in.invoice_no}' is already registered."
            )
        res = await repo.create_fee(fee_in)
        await db.commit()
        return res

    @staticmethod
    async def pay_fee(db: AsyncSession, fee_id: str, update_in: FeePaymentUpdate) -> FeeCollection:
        repo = FinanceRepository(db)
        fee = await repo.get_by_id(fee_id)
        if not fee:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Fee collection record not found."
            )
        res = await repo.update_payment(fee, update_in)
        await db.commit()
        return res
