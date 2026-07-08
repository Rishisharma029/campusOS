from typing import Sequence
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.models.operation import Attendance, Result
from app.schemas.operation import AttendanceCreate, ResultCreate

class OperationRepository:
    """
    Handles database operations for Attendance and Result records.
    """
    def __init__(self, db: AsyncSession):
        self.db = db

    # Attendance
    async def get_attendance_by_student(self, student_id: str, skip: int = 0, limit: int = 100) -> Sequence[Attendance]:
        result = await self.db.execute(
            select(Attendance)
            .where(Attendance.student_id == student_id)
            .order_by(Attendance.date.desc())
            .offset(skip)
            .limit(limit)
        )
        return result.scalars().all()

    async def create_attendance(self, att_in: AttendanceCreate) -> Attendance:
        db_att = Attendance(
            student_id=att_in.student_id,
            subject_code=att_in.subject_code,
            date=att_in.date,
            status=att_in.status
        )
        self.db.add(db_att)
        await self.db.flush()
        return db_att

    # Results
    async def get_results_by_student(self, student_id: str) -> Sequence[Result]:
        result = await self.db.execute(
            select(Result)
            .where(Result.student_id == student_id)
        )
        return result.scalars().all()

    async def create_result(self, res_in: ResultCreate) -> Result:
        db_res = Result(
            student_id=res_in.student_id,
            subject_name=res_in.subject_name,
            marks_obtained=res_in.marks_obtained,
            max_marks=res_in.max_marks,
            grade=res_in.grade,
            exam_type=res_in.exam_type
        )
        self.db.add(db_res)
        await self.db.flush()
        return db_res
