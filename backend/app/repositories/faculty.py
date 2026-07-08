from typing import Optional, Sequence
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.models.faculty import Faculty, FacultyLeave
from app.schemas.faculty import FacultyCreate, FacultyUpdate, LeaveCreate

class FacultyRepository:
    """
    Handles database operations for Faculty staff profiles and Leave requests.
    """
    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_all(self, skip: int = 0, limit: int = 100) -> Sequence[Faculty]:
        result = await self.db.execute(select(Faculty).offset(skip).limit(limit))
        return result.scalars().all()

    async def get_by_id(self, faculty_id: str) -> Optional[Faculty]:
        result = await self.db.execute(select(Faculty).where(Faculty.id == faculty_id))
        return result.scalars().first()

    async def get_by_employee_id(self, employee_id: str) -> Optional[Faculty]:
        result = await self.db.execute(select(Faculty).where(Faculty.employee_id == employee_id))
        return result.scalars().first()

    async def get_by_user_id(self, user_id: str) -> Optional[Faculty]:
        result = await self.db.execute(select(Faculty).where(Faculty.user_id == user_id))
        return result.scalars().first()

    async def create(self, faculty_in: FacultyCreate) -> Faculty:
        db_faculty = Faculty(
            user_id=faculty_in.user_id,
            employee_id=faculty_in.employee_id,
            department_id=faculty_in.department_id,
            designation=faculty_in.designation,
            workload_hours=faculty_in.workload_hours,
            qualification=faculty_in.qualification,
            join_date=faculty_in.join_date,
            status=faculty_in.status
        )
        self.db.add(db_faculty)
        await self.db.flush()
        return db_faculty

    async def update(self, faculty: Faculty, update_data: FacultyUpdate) -> Faculty:
        obj_data = update_data.model_dump(exclude_unset=True)
        for field in obj_data:
            setattr(faculty, field, obj_data[field])
        self.db.add(faculty)
        await self.db.flush()
        return faculty

    async def delete(self, faculty: Faculty) -> None:
        await self.db.delete(faculty)
        await self.db.flush()

    # Leaves
    async def get_leaves(self, faculty_id: str) -> Sequence[FacultyLeave]:
        result = await self.db.execute(select(FacultyLeave).where(FacultyLeave.faculty_id == faculty_id))
        return result.scalars().all()

    async def get_leave_by_id(self, leave_id: str) -> Optional[FacultyLeave]:
        result = await self.db.execute(select(FacultyLeave).where(FacultyLeave.id == leave_id))
        return result.scalars().first()

    async def create_leave(self, leave_in: LeaveCreate) -> FacultyLeave:
        db_leave = FacultyLeave(
            faculty_id=leave_in.faculty_id,
            start_date=leave_in.start_date,
            end_date=leave_in.end_date,
            reason=leave_in.reason,
            status="Pending"
        )
        self.db.add(db_leave)
        await self.db.flush()
        return db_leave

    async def update_leave_status(self, leave: FacultyLeave, status: str) -> FacultyLeave:
        leave.status = status
        self.db.add(leave)
        await self.db.flush()
        return leave
