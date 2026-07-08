from sqlalchemy.ext.asyncio import AsyncSession
from app.services.student import StudentService
from app.schemas.student import StudentCreate, StudentUpdate
from app.models.student import Student
from typing import Sequence

class StudentController:
    """
    Orchestrates Student profile operations.
    Invokes the StudentService and commits changes.
    """
    @staticmethod
    async def create_student(db: AsyncSession, student_in: StudentCreate) -> Student:
        service = StudentService(db)
        res = await service.create_student(student_in)
        await db.commit()
        return res

    @staticmethod
    async def get_students(db: AsyncSession, skip: int = 0, limit: int = 100) -> Sequence[Student]:
        service = StudentService(db)
        return await service.get_students(skip, limit)

    @staticmethod
    async def get_student(db: AsyncSession, student_id: str) -> Student:
        service = StudentService(db)
        return await service.get_student(student_id)

    @staticmethod
    async def get_student_by_user_id(db: AsyncSession, user_id: str) -> Student:
        service = StudentService(db)
        return await service.get_student_by_user_id(user_id)

    @staticmethod
    async def update_student(db: AsyncSession, student_id: str, update_in: StudentUpdate) -> Student:
        service = StudentService(db)
        res = await service.update_student(student_id, update_in)
        await db.commit()
        return res

    @staticmethod
    async def delete_student(db: AsyncSession, student_id: str) -> None:
        service = StudentService(db)
        await service.delete_student(student_id)
        await db.commit()
