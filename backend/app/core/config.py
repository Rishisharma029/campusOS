from __future__ import annotations

from typing import Optional
from pydantic import Field, model_validator
from pydantic_settings import BaseSettings, SettingsConfigDict

# Development fallback — clearly labelled insecure; rejected in production.
_DEV_KEY_MARKER = "campusos-dev-local-secret-key-replace-before-production"


class Settings(BaseSettings):
    # ── Identity ─────────────────────────────────────────────────────────────
    API_V1_STR: str = "/api/v1"
    PROJECT_NAME: str = "CampusOS ERP API"

    # Environment: development | staging | production
    ENVIRONMENT: str = Field("development", validation_alias="ENVIRONMENT")

    # ── Security ─────────────────────────────────────────────────────────────
    # Must be overridden via environment variable in production.
    # Generate with: python -c "import secrets; print(secrets.token_hex(32))"
    SECRET_KEY: str = Field(
        default=_DEV_KEY_MARKER,
        validation_alias="SECRET_KEY",
    )
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = Field(30, validation_alias="ACCESS_TOKEN_EXPIRE_MINUTES")
    REFRESH_TOKEN_EXPIRE_DAYS: int = Field(7, validation_alias="REFRESH_TOKEN_EXPIRE_DAYS")

    # ── CORS ──────────────────────────────────────────────────────────────────
    # JSON-parseable list of allowed frontend origins.
    # Example .env value: CORS_ORIGINS=["http://localhost:5173"]
    CORS_ORIGINS: list[str] = Field(
        default=["http://localhost:5173", "http://localhost:3000", "http://localhost:4173"],
        validation_alias="CORS_ORIGINS",
    )

    # ── Database ─────────────────────────────────────────────────────────────
    # Development default: local SQLite via aiosqlite async driver.
    # Production: postgresql+asyncpg://user:pass@host:5432/dbname
    DATABASE_URL: str = Field(
        "sqlite+aiosqlite:///./campusos.db",
        validation_alias="DATABASE_URL",
    )

    # ── Production Guards ─────────────────────────────────────────────────────
    @model_validator(mode="after")
    def enforce_production_security(self) -> "Settings":
        """
        Reject startup in production if the secret key is the insecure dev default
        or shorter than 32 characters.
        """
        if self.ENVIRONMENT == "production":
            if _DEV_KEY_MARKER in self.SECRET_KEY or len(self.SECRET_KEY) < 32:
                raise ValueError(
                    "SECRET_KEY must be a cryptographically secure random string "
                    "(≥ 32 characters) when ENVIRONMENT=production. "
                    "Generate one with: python -c \"import secrets; print(secrets.token_hex(32))\""
                )
        return self

    # ── Derived Properties ────────────────────────────────────────────────────
    @property
    def docs_url(self) -> Optional[str]:
        """OpenAPI /docs disabled in production."""
        return "/docs" if self.ENVIRONMENT != "production" else None

    @property
    def redoc_url(self) -> Optional[str]:
        """ReDoc /redoc disabled in production."""
        return "/redoc" if self.ENVIRONMENT != "production" else None

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )


settings = Settings()
