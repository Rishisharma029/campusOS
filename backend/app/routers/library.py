from fastapi import APIRouter, Depends, status, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from app.database.session import get_db
from app.dependencies.auth import get_current_user, PermissionChecker
from app.schemas.library import (
    BookCreate, BookResponse,
    BorrowCreate, BorrowResponse, ReturnRequest
)
from app.controllers.library import LibraryController
from app.controllers.student import StudentController
from app.models.user import User

router = APIRouter()

@router.get(
    "/books",
    response_model=list[BookResponse],
    summary="Get all books in the library catalog"
)
async def get_all_books(
    skip: int = 0,
    limit: int = 100,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return await LibraryController.get_all_books(db, skip, limit)

@router.post(
    "/books",
    response_model=BookResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Add a new book to the catalog (Admin/Librarian only)"
)
async def create_book(
    book_in: BookCreate,
    db: AsyncSession = Depends(get_db),
    auth_user: User = Depends(PermissionChecker(["Admin", "Librarian"]))
):
    return await LibraryController.create_book(db, book_in)

@router.get(
    "/books/{id}",
    response_model=BookResponse,
    summary="Get details of a specific book by ID"
)
async def get_book(
    id: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return await LibraryController.get_book_by_id(db, id)

@router.post(
    "/books/{id}/borrow",
    response_model=BorrowResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Log a book borrow session (Admin/Librarian only)"
)
async def borrow_book(
    id: str,
    borrow_in: BorrowCreate,
    db: AsyncSession = Depends(get_db),
    auth_user: User = Depends(PermissionChecker(["Admin", "Librarian"]))
):
    if borrow_in.book_id != id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Book ID path parameter does not match the request payload."
        )
    return await LibraryController.borrow_book(db, borrow_in)

@router.put(
    "/borrows/{id}/return",
    response_model=BorrowResponse,
    summary="Mark a borrowed book as returned (Admin/Librarian only)"
)
async def return_book(
    id: str,
    return_in: ReturnRequest,
    db: AsyncSession = Depends(get_db),
    auth_user: User = Depends(PermissionChecker(["Admin", "Librarian"]))
):
    return await LibraryController.return_book(db, id, return_in)

@router.get(
    "/borrows/student/{student_id}",
    response_model=list[BorrowResponse],
    summary="Get library borrows logs for a specific student"
)
async def get_borrows_by_student(
    student_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    student = await StudentController.get_student(db, student_id)
    if current_user.role == "Student" and student.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You are not authorized to view this student's library borrow log."
        )
    return await LibraryController.get_borrows_by_student(db, student_id)
