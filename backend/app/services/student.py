from fastapi import HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from app.repositories.student import StudentRepository
from app.schemas.student import StudentCreate, StudentUpdate
from app.models.student import Student
from typing import Sequence

class StudentService:
    """
    Business logic for Students. Validates roll numbers and links user records.
    """
    def __init__(self, db: AsyncSession):
        self.repo = StudentRepository(db)

    async def create_student(self, student_in: StudentCreate) -> Student:
        existing = await self.repo.get_by_roll_no(student_in.roll_no)
        if existing:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Student with roll number '{student_in.roll_no}' already exists."
            )
        return await self.repo.create(student_in)

    async def get_students(self, skip: int = 0, limit: int = 100) -> Sequence[Student]:
        return await self.repo.get_all(skip, limit)

    async def get_student(self, student_id: str) -> Student:
        student = await self.repo.get_by_id(student_id)
        if not student:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Student profile not found."
            )
        return student

    async def get_student_by_user_id(self, user_id: str) -> Student:
        student = await self.repo.get_by_user_id(user_id)
        if not student:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Student profile not found for this user."
            )
        return student

    async def update_student(self, student_id: str, update_in: StudentUpdate) -> Student:
        student = await self.get_student(student_id)
        return await self.repo.update(student, update_in)

    async def delete_student(self, student_id: str) -> None:
        student = await self.get_student(student_id)
        await self.repo.delete(student)
