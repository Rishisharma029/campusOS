from fastapi import HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from app.repositories.user import UserRepository
from app.schemas.user import UserCreate, UserLogin
from app.models.user import User
from app.security.auth import verify_password

class UserService:
    """
    Coordinates User business validations.
    """
    def __init__(self, db: AsyncSession):
        self.repo = UserRepository(db)

    async def register_user(self, user_in: UserCreate) -> User:
        existing = await self.repo.get_by_email(user_in.email)
        if existing:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email already registered."
            )
        return await self.repo.create(user_in)

    async def authenticate(self, login_in: UserLogin) -> User:
        user = await self.repo.get_by_email(login_in.email)
        if not user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Incorrect email or password."
            )
        if not verify_password(login_in.password, user.hashed_password):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Incorrect email or password."
            )
        if not user.is_active:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="User account is deactivated."
            )
        # Optional role validation if requested during authorization
        if login_in.role and user.role != login_in.role:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"User is not registered under the role: {login_in.role}"
            )
        return user
