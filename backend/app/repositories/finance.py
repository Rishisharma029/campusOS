from typing import Optional, Sequence
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.models.finance import FeeCollection
from app.schemas.finance import FeeCollectionCreate, FeePaymentUpdate

class FinanceRepository:
    """
    Handles database operations for Fee Collection ledgers.
    """
    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_all_fees(self, skip: int = 0, limit: int = 100) -> Sequence[FeeCollection]:
        result = await self.db.execute(select(FeeCollection).offset(skip).limit(limit))
        return result.scalars().all()

    async def get_fees_by_student(self, student_id: str) -> Sequence[FeeCollection]:
        result = await self.db.execute(select(FeeCollection).where(FeeCollection.student_id == student_id))
        return result.scalars().all()

    async def get_by_id(self, fee_id: str) -> Optional[FeeCollection]:
        result = await self.db.execute(select(FeeCollection).where(FeeCollection.id == fee_id))
        return result.scalars().first()

    async def get_by_invoice_no(self, invoice_no: str) -> Optional[FeeCollection]:
        result = await self.db.execute(select(FeeCollection).where(FeeCollection.invoice_no == invoice_no))
        return result.scalars().first()

    async def create_fee(self, fee_in: FeeCollectionCreate) -> FeeCollection:
        db_fee = FeeCollection(
            student_id=fee_in.student_id,
            invoice_no=fee_in.invoice_no,
            amount_total=fee_in.amount_total,
            amount_paid=fee_in.amount_paid,
            due_date=fee_in.due_date,
            status=fee_in.status,
            payment_mode=fee_in.payment_mode,
            academic_year=fee_in.academic_year,
            fee_type=fee_in.fee_type
        )
        self.db.add(db_fee)
        await self.db.flush()
        return db_fee

    async def update_payment(self, fee: FeeCollection, update_in: FeePaymentUpdate) -> FeeCollection:
        fee.amount_paid += update_in.amount_paid
        fee.payment_mode = update_in.payment_mode
        if fee.amount_paid >= fee.amount_total:
            fee.status = "Paid"
        self.db.add(fee)
        await self.db.flush()
        return fee
