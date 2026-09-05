"""
GENOVA CampusOS AI — Initial Database Seeder
Seeds baseline users (Admin, Rishi Sharma as Student), Student profiles,
and core operational data into the SQLite / PostgreSQL database.
"""

import asyncio
from datetime import date
from sqlalchemy import select
from app.database.base_model import Base
from app.database.session import engine, AsyncSessionLocal
from app.models.user import User
from app.models.student import Student
from app.models.library import Book
from app.models.campus import PlacementDrive
from app.security.auth import get_password_hash

async def seed_database():
    print("Initializing database tables...")
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    async with AsyncSessionLocal() as db:
        # 1. Seed Admin User
        stmt = select(User).where(User.email == "admin@campusos.edu")
        existing_admin = (await db.execute(stmt)).scalars().first()
        if not existing_admin:
            admin_user = User(
                email="admin@campusos.edu",
                hashed_password=get_password_hash("Admin@123456"),
                name="System Administrator",
                role="Admin",
                is_active=True
            )
            db.add(admin_user)
            print("[OK] Seeded Admin user: admin@campusos.edu / Admin@123456")
        else:
            print("Admin user already exists.")

        # 2. Seed Rishi Sharma (Student User & Profile)
        stmt = select(User).where(User.email == "rishi.sharma@university.edu")
        existing_rishi = (await db.execute(stmt)).scalars().first()
        if not existing_rishi:
            rishi_user = User(
                email="rishi.sharma@university.edu",
                hashed_password=get_password_hash("Rishi@123456"),
                name="Rishi Sharma",
                role="Student",
                is_active=True
            )
            db.add(rishi_user)
            await db.flush()

            # Seed Student Profile for Rishi
            rishi_profile = Student(
                user_id=rishi_user.id,
                roll_no="2024CS001",
                department="Computer Science",
                course="B.Tech CSE",
                year=4,
                semester=8,
                enrollment_year=2023,
                cgpa=9.24,
                parent_name="Sunil Sharma",
                parent_email="sunil.sharma@gmail.com",
                phone="+919876543210",
                attendance_rate=94.20,
                status="Active",
                hostel_room="Block A, Room 304",
                transport_bus="Route 12",
                placement_status="Shortlisted"
            )
            db.add(rishi_profile)
            print("[OK] Seeded Student user & profile: Rishi Sharma (2024CS001, CGPA 9.24)")
        else:
            print("Rishi Sharma user already exists.")

        # 3. Seed Placement Drives
        stmt = select(PlacementDrive).where(PlacementDrive.company == "Google")
        existing_drive = (await db.execute(stmt)).scalars().first()
        if not existing_drive:
            drives = [
                PlacementDrive(company="Google", role="Software Development Engineer (SDE-1)", drive_date=date(2026, 8, 12), package_offer="32.5 LPA", eligible_cgpa=8.5, status="Upcoming"),
                PlacementDrive(company="Microsoft", role="Support Engineer / Cloud Consultant", drive_date=date(2026, 7, 18), package_offer="18.0 LPA", eligible_cgpa=8.0, status="Ongoing"),
                PlacementDrive(company="Genova Mobility Labs", role="Autonomous Systems Engineer", drive_date=date(2026, 9, 15), package_offer="24.0 LPA", eligible_cgpa=8.0, status="Upcoming"),
            ]
            db.add_all(drives)
            print("[OK] Seeded 3 Corporate Placement Drives (Google, Microsoft, Genova Mobility)")

        # 4. Seed Library Books
        stmt = select(Book).where(Book.isbn == "9780262033848")
        existing_book = (await db.execute(stmt)).scalars().first()
        if not existing_book:
            books = [
                Book(title="Introduction to Algorithms", author="Thomas H. Cormen", isbn="9780262033848", category="Computer Science", copies_total=10, copies_available=8),
                Book(title="Designing Data-Intensive Applications", author="Martin Kleppmann", isbn="9781449373320", category="Software Engineering", copies_total=6, copies_available=5),
                Book(title="Probabilistic Robotics", author="Sebastian Thrun", isbn="9780262201629", category="Robotics & AI", copies_total=5, copies_available=4),
            ]
            db.add_all(books)
            print("[OK] Seeded Library catalogue books")

        await db.commit()
    print("Database seeding completed successfully!")

if __name__ == "__main__":
    asyncio.run(seed_database())
