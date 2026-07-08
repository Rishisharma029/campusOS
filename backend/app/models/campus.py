from sqlalchemy import String, Integer, Numeric, Date
from sqlalchemy.orm import Mapped, mapped_column
from app.database.base_model import Base
from datetime import date

class HostelRoom(Base):
    """
    SQLAlchemy model representing hostel room allocations.
    """
    __tablename__ = "hostel_rooms"

    block: Mapped[str] = mapped_column(String(10), nullable=False)
    room_no: Mapped[str] = mapped_column(String(10), nullable=False)
    capacity: Mapped[int] = mapped_column(Integer, default=4, nullable=False)
    occupied: Mapped[int] = mapped_column(Integer, default=0, nullable=False)

class TransitRoute(Base):
    """
    SQLAlchemy model representing college bus routes and live status indicators.
    """
    __tablename__ = "transit_routes"

    route_name: Mapped[str] = mapped_column(String(100), nullable=False)
    driver_name: Mapped[str] = mapped_column(String(100), nullable=False)
    driver_phone: Mapped[str] = mapped_column(String(20), nullable=False)
    status: Mapped[str] = mapped_column(String(20), default="Parked", nullable=False)

class PlacementDrive(Base):
    """
    SQLAlchemy model representing campus placement drives scheduled by companies.
    """
    __tablename__ = "placements"

    company: Mapped[str] = mapped_column(String(100), nullable=False)
    role: Mapped[str] = mapped_column(String(100), nullable=False)
    drive_date: Mapped[date] = mapped_column(Date, nullable=False)
    package_offer: Mapped[str] = mapped_column(String(50), nullable=False)
    eligible_cgpa: Mapped[float] = mapped_column(Numeric(4, 2), default=6.00, nullable=False)
    status: Mapped[str] = mapped_column(String(20), default="Upcoming", nullable=False) # Upcoming, Active, Completed
