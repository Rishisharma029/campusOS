from sqlalchemy.ext.asyncio import AsyncSession
from fastapi import HTTPException, status
from app.repositories.library import LibraryRepository
from app.schemas.library import BookCreate, BorrowCreate, ReturnRequest
from app.models.library import Book, BookBorrow
from typing import Sequence

class LibraryController:
    """
    Orchestrates Library catalogue entries and borrowing sessions.
    """
    @staticmethod
    async def get_all_books(db: AsyncSession, skip: int = 0, limit: int = 100) -> Sequence[Book]:
        repo = LibraryRepository(db)
        return await repo.get_all_books(skip, limit)

    @staticmethod
    async def get_book_by_id(db: AsyncSession, book_id: str) -> Book:
        repo = LibraryRepository(db)
        book = await repo.get_book_by_id(book_id)
        if not book:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Book not found.")
        return book

    @staticmethod
    async def create_book(db: AsyncSession, book_in: BookCreate) -> Book:
        repo = LibraryRepository(db)
        # Check ISBN uniqueness
        existing = await repo.get_book_by_isbn(book_in.isbn)
        if existing:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Book with ISBN '{book_in.isbn}' already exists."
            )
        res = await repo.create_book(book_in)
        await db.commit()
        return res

    @staticmethod
    async def borrow_book(db: AsyncSession, borrow_in: BorrowCreate) -> BookBorrow:
        repo = LibraryRepository(db)
        # Verify book availability
        book = await repo.get_book_by_id(borrow_in.book_id)
        if not book:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Book not found.")
        if book.copies_available <= 0:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="No copies of this book are currently available for checkout."
            )
        # Decrement copies
        book.copies_available -= 1
        res = await repo.create_borrow(borrow_in)
        await db.commit()
        return res

    @staticmethod
    async def return_book(db: AsyncSession, borrow_id: str, return_in: ReturnRequest) -> BookBorrow:
        repo = LibraryRepository(db)
        borrow = await repo.get_borrow_by_id(borrow_id)
        if not borrow:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Borrow record not found.")
        if borrow.return_date:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Book has already been returned.")

        # Increment copies
        book = await repo.get_book_by_id(borrow.book_id)
        if book:
            book.copies_available += 1

        res = await repo.return_book(borrow, return_in.return_date)
        await db.commit()
        return res

    @staticmethod
    async def get_borrows_by_student(db: AsyncSession, student_id: str) -> Sequence[BookBorrow]:
        repo = LibraryRepository(db)
        return await repo.get_borrows_by_student(student_id)
