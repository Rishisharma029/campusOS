from fastapi import HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from app.repositories.faculty import FacultyRepository
from app.schemas.faculty import FacultyCreate, FacultyUpdate, LeaveCreate
from app.models.faculty import Faculty, FacultyLeave
from typing import Sequence

class FacultyService:
    """
    Business logic for Faculty staff profiles and leave records.
    """
    def __init__(self, db: AsyncSession):
        self.repo = FacultyRepository(db)

    async def create_faculty(self, faculty_in: FacultyCreate) -> Faculty:
        existing = await self.repo.get_by_employee_id(faculty_in.employee_id)
        if existing:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Faculty member with employee ID '{faculty_in.employee_id}' already exists."
            )
        return await self.repo.create(faculty_in)

    async def get_faculty_members(self, skip: int = 0, limit: int = 100) -> Sequence[Faculty]:
        return await self.repo.get_all(skip, limit)

    async def get_faculty_member(self, faculty_id: str) -> Faculty:
        faculty = await self.repo.get_by_id(faculty_id)
        if not faculty:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Faculty profile not found."
            )
        return faculty

    async def get_faculty_by_user_id(self, user_id: str) -> Faculty:
        faculty = await self.repo.get_by_user_id(user_id)
        if not faculty:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Faculty profile not found for this user."
            )
        return faculty

    async def update_faculty(self, faculty_id: str, update_in: FacultyUpdate) -> Faculty:
        faculty = await self.get_faculty_member(faculty_id)
        return await self.repo.update(faculty, update_in)

    async def delete_faculty(self, faculty_id: str) -> None:
        faculty = await self.get_faculty_member(faculty_id)
        await self.repo.delete(faculty)

    # Leaves
    async def get_leaves(self, faculty_id: str) -> Sequence[FacultyLeave]:
        await self.get_faculty_member(faculty_id)
        return await self.repo.get_leaves(faculty_id)

    async def apply_leave(self, leave_in: LeaveCreate) -> FacultyLeave:
        await self.get_faculty_member(leave_in.faculty_id)
        if leave_in.start_date > leave_in.end_date:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Leave start date cannot be after end date."
            )
        return await self.repo.create_leave(leave_in)

    async def update_leave_status(self, leave_id: str, status_str: str) -> FacultyLeave:
        leave = await self.repo.get_leave_by_id(leave_id)
        if not leave:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Leave record not found."
            )
        if status_str not in ["Pending", "Approved", "Rejected"]:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid status. Choose from: Pending, Approved, Rejected."
            )
        return await self.repo.update_leave_status(leave, status_str)
