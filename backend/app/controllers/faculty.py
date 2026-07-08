from sqlalchemy.ext.asyncio import AsyncSession
from app.services.faculty import FacultyService
from app.schemas.faculty import FacultyCreate, FacultyUpdate, LeaveCreate
from app.models.faculty import Faculty, FacultyLeave
from typing import Sequence

class FacultyController:
    """
    Orchestrates Faculty staff profile and Leave operations.
    Invokes the FacultyService and commits changes.
    """
    @staticmethod
    async def create_faculty(db: AsyncSession, faculty_in: FacultyCreate) -> Faculty:
        service = FacultyService(db)
        res = await service.create_faculty(faculty_in)
        await db.commit()
        return res

    @staticmethod
    async def get_faculty_members(db: AsyncSession, skip: int = 0, limit: int = 100) -> Sequence[Faculty]:
        service = FacultyService(db)
        return await service.get_faculty_members(skip, limit)

    @staticmethod
    async def get_faculty_member(db: AsyncSession, faculty_id: str) -> Faculty:
        service = FacultyService(db)
        return await service.get_faculty_member(faculty_id)

    @staticmethod
    async def get_faculty_by_user_id(db: AsyncSession, user_id: str) -> Faculty:
        service = FacultyService(db)
        return await service.get_faculty_by_user_id(user_id)

    @staticmethod
    async def update_faculty(db: AsyncSession, faculty_id: str, update_in: FacultyUpdate) -> Faculty:
        service = FacultyService(db)
        res = await service.update_faculty(faculty_id, update_in)
        await db.commit()
        return res

    @staticmethod
    async def delete_faculty(db: AsyncSession, faculty_id: str) -> None:
        service = FacultyService(db)
        await service.delete_faculty(faculty_id)
        await db.commit()

    # Leaves
    @staticmethod
    async def get_leaves(db: AsyncSession, faculty_id: str) -> Sequence[FacultyLeave]:
        service = FacultyService(db)
        return await service.get_leaves(faculty_id)

    @staticmethod
    async def apply_leave(db: AsyncSession, leave_in: LeaveCreate) -> FacultyLeave:
        service = FacultyService(db)
        res = await service.apply_leave(leave_in)
        await db.commit()
        return res

    @staticmethod
    async def update_leave_status(db: AsyncSession, leave_id: str, status_str: str) -> FacultyLeave:
        service = FacultyService(db)
        res = await service.update_leave_status(leave_id, status_str)
        await db.commit()
        return res
