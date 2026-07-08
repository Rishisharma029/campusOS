from typing import Optional, Sequence
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.models.library import Book, BookBorrow
from app.schemas.library import BookCreate, BorrowCreate
from datetime import date

class LibraryRepository:
    """
    Handles database operations for library Books and checkout Borrow logs.
    """
    def __init__(self, db: AsyncSession):
        self.db = db

    # Books
    async def get_all_books(self, skip: int = 0, limit: int = 100) -> Sequence[Book]:
        result = await self.db.execute(select(Book).offset(skip).limit(limit))
        return result.scalars().all()

    async def get_book_by_id(self, book_id: str) -> Optional[Book]:
        result = await self.db.execute(select(Book).where(Book.id == book_id))
        return result.scalars().first()

    async def get_book_by_isbn(self, isbn: str) -> Optional[Book]:
        result = await self.db.execute(select(Book).where(Book.isbn == isbn))
        return result.scalars().first()

    async def create_book(self, book_in: BookCreate) -> Book:
        db_book = Book(
            title=book_in.title,
            author=book_in.author,
            isbn=book_in.isbn,
            category=book_in.category,
            copies_total=book_in.copies_total,
            copies_available=book_in.copies_total
        )
        self.db.add(db_book)
        await self.db.flush()
        return db_book

    # Borrows
    async def get_borrows_by_student(self, student_id: str) -> Sequence[BookBorrow]:
        result = await self.db.execute(select(BookBorrow).where(BookBorrow.student_id == student_id))
        return result.scalars().all()

    async def get_borrow_by_id(self, borrow_id: str) -> Optional[BookBorrow]:
        result = await self.db.execute(select(BookBorrow).where(BookBorrow.id == borrow_id))
        return result.scalars().first()

    async def create_borrow(self, borrow_in: BorrowCreate) -> BookBorrow:
        db_borrow = BookBorrow(
            book_id=borrow_in.book_id,
            student_id=borrow_in.student_id,
            issue_date=borrow_in.issue_date,
            due_date=borrow_in.due_date,
            fine_amount=0.00
        )
        self.db.add(db_borrow)
        await self.db.flush()
        return db_borrow

    async def return_book(self, borrow: BookBorrow, return_date: date) -> BookBorrow:
        borrow.return_date = return_date
        # Fine calculation: $2.00 per overdue day
        if return_date > borrow.due_date:
            days_overdue = (return_date - borrow.due_date).days
            borrow.fine_amount = float(days_overdue * 2.00)
        else:
            borrow.fine_amount = 0.00
        self.db.add(borrow)
        await self.db.flush()
        return borrow
