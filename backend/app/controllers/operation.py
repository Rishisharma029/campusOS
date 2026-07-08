from sqlalchemy.ext.asyncio import AsyncSession
from app.repositories.operation import OperationRepository
from app.schemas.operation import AttendanceCreate, ResultCreate
from app.models.operation import Attendance, Result
from typing import Sequence

class OperationController:
    """
    Orchestrates daily operations like student Attendance and exam Results.
    Directly invokes the OperationRepository (since no complex validation is required)
    and commits changes.
    """
    @staticmethod
    async def create_attendance(db: AsyncSession, att_in: AttendanceCreate) -> Attendance:
        repo = OperationRepository(db)
        res = await repo.create_attendance(att_in)
        await db.commit()
        return res

    @staticmethod
    async def get_attendance_by_student(db: AsyncSession, student_id: str, skip: int = 0, limit: int = 100) -> Sequence[Attendance]:
        repo = OperationRepository(db)
        return await repo.get_attendance_by_student(student_id, skip, limit)

    @staticmethod
    async def create_result(db: AsyncSession, res_in: ResultCreate) -> Result:
        repo = OperationRepository(db)
        res = await repo.create_result(res_in)
        await db.commit()
        return res

    @staticmethod
    async def get_results_by_student(db: AsyncSession, student_id: str) -> Sequence[Result]:
        repo = OperationRepository(db)
        return await repo.get_results_by_student(student_id)
