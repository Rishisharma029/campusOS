from contextlib import asynccontextmanager

from fastapi import FastAPI, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from slowapi import _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded
from sqlalchemy.exc import SQLAlchemyError

from app.core.config import settings
from app.core.limiter import limiter
from app.middlewares.security_headers import SecurityHeadersMiddleware
from app.routers import user, mfa, academic, student, faculty, operation, finance, library


# ── Application Lifespan ──────────────────────────────────────────────────────

@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Startup: auto-create all tables in development mode (no migrations needed).
    Production: tables must be managed via Alembic migrations.
    Shutdown: clean close (session pool handled per-request).
    """
    if settings.ENVIRONMENT == "development":
        import app.models  # noqa: F401 — side-effect import registers all ORM models
        from app.database.base_model import Base
        from app.database.session import engine
        async with engine.begin() as conn:
            await conn.run_sync(Base.metadata.create_all)
    yield


# ── Application Factory ───────────────────────────────────────────────────────

app = FastAPI(
    title=settings.PROJECT_NAME,
    description="Enterprise College Management System REST API",
    version="2.0.0",
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    docs_url=settings.docs_url,
    redoc_url=settings.redoc_url,
    lifespan=lifespan,
)

# ── Rate Limiter State ────────────────────────────────────────────────────────

app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

# ── Middleware Stack ──────────────────────────────────────────────────────────
# Note: Middleware is applied in reverse addition order.

# 1. Security headers (outermost — applied after CORS allows the request)
app.add_middleware(SecurityHeadersMiddleware)

# 2. CORS — restricted origins; credentials enabled (no wildcard allowed with credentials)
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allow_headers=["Authorization", "Content-Type", "X-Request-ID", "Accept"],
)

# ── Global Exception Handlers ─────────────────────────────────────────────────

@app.exception_handler(SQLAlchemyError)
async def sqlalchemy_exception_handler(request: Request, exc: SQLAlchemyError) -> JSONResponse:
    """
    Intercepts all SQLAlchemy database errors.
    Returns a clean 503 without leaking schema details or stack traces.
    """
    return JSONResponse(
        status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
        content={"detail": "A database error occurred. Please try again later."},
    )


@app.exception_handler(Exception)
async def generic_exception_handler(request: Request, exc: Exception) -> JSONResponse:
    """
    Catch-all handler — prevents internal stack traces from leaking to clients.
    In development mode, the actual error message is returned for debugging.
    """
    if settings.ENVIRONMENT == "development":
        return JSONResponse(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            content={"detail": f"[DEV] {type(exc).__name__}: {str(exc)}"},
        )
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={"detail": "An unexpected server error occurred. Please try again later."},
    )


# ── Route Registration ────────────────────────────────────────────────────────

app.include_router(user.router, prefix=settings.API_V1_STR, tags=["Auth & Users"])
app.include_router(mfa.router, prefix=settings.API_V1_STR, tags=["MFA & 2FA"])
app.include_router(academic.router, prefix=settings.API_V1_STR, tags=["Academics"])
app.include_router(student.router, prefix=settings.API_V1_STR, tags=["Students"])
app.include_router(faculty.router, prefix=settings.API_V1_STR, tags=["Faculty"])
app.include_router(operation.router, prefix=settings.API_V1_STR, tags=["Operations"])
app.include_router(finance.router, prefix=settings.API_V1_STR, tags=["Finance"])
app.include_router(library.router, prefix=settings.API_V1_STR, tags=["Library"])


# ── Core Utility Endpoints ────────────────────────────────────────────────────

@app.get("/", summary="Root status check", include_in_schema=False)
async def root():
    return {
        "status": "online",
        "service": settings.PROJECT_NAME,
        "environment": settings.ENVIRONMENT,
        "docs": settings.docs_url,
    }


@app.get(
    "/health",
    summary="Health check",
    description="Validates API readiness and database connectivity.",
    status_code=status.HTTP_200_OK,
)
async def health():
    from sqlalchemy.future import select
    from app.database.session import AsyncSessionLocal

    db_status = "unknown"
    try:
        async with AsyncSessionLocal() as db:
            await db.execute(select(1))
        db_status = "connected"
    except Exception:
        db_status = "disconnected"

    return {
        "api_status": "healthy",
        "db_status": db_status,
        "environment": settings.ENVIRONMENT,
    }
