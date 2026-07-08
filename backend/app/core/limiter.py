from slowapi import Limiter
from slowapi.util import get_remote_address

# Global rate limiter instance — keyed by client IP address.
# Default: 200 requests/minute per IP across all routes.
# Apply tighter limits per-route using @limiter.limit("N/period").
limiter = Limiter(key_func=get_remote_address, default_limits=["200/minute"])
