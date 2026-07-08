import pytest
from datetime import date
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.orm import selectinload
from app.models.user import User
from app.models.academic import Department, Course, Subject
from app.models.student import Student
from app.models.operation import Attendance, Result
from app.models.finance import FeeCollection
from app.models.library import Book, BookBorrow

@pytest.mark.asyncio
async def test_database_cascades_and_relationships(db: AsyncSession):
    # 1. Setup Academic hierarchy
    dept = Department(name="Computer Science & Engineering", code="CSE")
    db.add(dept)
    await db.flush()
    
    course = Course(department_id=dept.id, name="B.Tech Computer Science", code="CS_BTECH", duration_years=4)
    db.add(course)
    await db.flush()
    
    subject = Subject(course_id=course.id, name="Design and Analysis of Algorithms", code="CS-302", credits=4)
    db.add(subject)
    await db.flush()
    
    # 2. Setup Student credentials and profile
    student_user = User(
        email="rahul@campusos.edu",
        hashed_password="hashed_placeholder_123",
        name="Rahul Verma",
        role="Student",
        is_active=True
    )
    db.add(student_user)
    await db.flush()
    
    student_profile = Student(
        user_id=student_user.id,
        roll_no="CSE-2026-004",
        department="Computer Science & Engineering",
        course="B.Tech Computer Science",
        year=2,
        cgpa=8.75,
        parent_name="Mr. Amit Verma",
        parent_email="amit.verma@parent.com",
        phone="+91 9988776655",
        attendance_rate=95.00
    )
    db.add(student_profile)
    await db.flush()
    
    # 3. Add relational transaction logs
    # Attendance log
    att_log = Attendance(
        student_id=student_profile.id,
        subject_code="CS-302",
        date=date(2026, 7, 8),
        status="Present"
    )
    db.add(att_log)
    
    # Exam result
    exam_res = Result(
        student_id=student_profile.id,
        subject_name="Algorithms",
        marks_obtained=92,
        max_marks=100,
        grade="A+"
    )
    db.add(exam_res)
    
    # Invoice payment collection
    invoice = FeeCollection(
        student_id=student_profile.id,
        invoice_no="INV-2026-042",
        amount_total=180000.00,
        amount_paid=100000.00,
        due_date=date(2026, 7, 30),
        status="Pending",
        payment_mode="Online"
    )
    db.add(invoice)
    
    # Library book and borrow record
    book = Book(
        title="Introduction to Algorithms",
        author="CLRS",
        isbn="9780262033848",
        category="Computer Science",
        copies_total=5,
        copies_available=4
    )
    db.add(book)
    await db.flush()
    
    borrow = BookBorrow(
        book_id=book.id,
        student_id=student_profile.id,
        issue_date=date(2026, 7, 1),
        due_date=date(2026, 7, 15)
    )
    db.add(borrow)
    await db.commit() # commit changes to mock DB
    
    # Assert relational query loading with selectinload to prevent lazy-loading exceptions
    stmt = (
        select(Student)
        .options(
            selectinload(Student.attendance_records),
            selectinload(Student.exam_results),
            selectinload(Student.book_borrows).selectinload(BookBorrow.book)
        )
        .where(Student.id == student_profile.id)
    )
    res = await db.execute(stmt)
    retrieved_student = res.scalars().first()
    assert retrieved_student is not None
    assert retrieved_student.roll_no == "CSE-2026-004"
    assert len(retrieved_student.attendance_records) == 1
    assert len(retrieved_student.exam_results) == 1
    assert retrieved_student.exam_results[0].grade == "A+"
    assert len(retrieved_student.book_borrows) == 1
    assert retrieved_student.book_borrows[0].book.title == "Introduction to Algorithms"
    
    # 4. Assert Cascade Purge Rules
    # Delete student profile
    await db.delete(retrieved_student)
    await db.commit()
    
    # Verify that Attendance, Result, and BookBorrow records are cascade-deleted!
    att_check = await db.execute(select(Attendance).where(Attendance.student_id == student_profile.id))
    assert att_check.scalars().first() is None
    
    res_check = await db.execute(select(Result).where(Result.student_id == student_profile.id))
    assert res_check.scalars().first() is None
    
    borrow_check = await db.execute(select(BookBorrow).where(BookBorrow.student_id == student_profile.id))
    assert borrow_check.scalars().first() is None
    
    # Verify that the Book itself was NOT deleted (ON DELETE CASCADE should only drop transaction logs!)
    book_check = await db.execute(select(Book).where(Book.id == book.id))
    assert book_check.scalars().first() is not None
