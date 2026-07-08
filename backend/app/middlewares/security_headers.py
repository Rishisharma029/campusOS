from starlette.middleware.base import BaseHTTPMiddleware, RequestResponseEndpoint
from starlette.requests import Request
from starlette.responses import Response

class SecurityHeadersMiddleware(BaseHTTPMiddleware):
    """
    Injects standard security headers to protect against Clickjacking, CSS/MIME sniffing,
    XSS, and insecure transport vulnerabilities.
    Allows Swagger UI CDN assets to load correctly.
    """
    async def dispatch(self, request: Request, call_next: RequestResponseEndpoint) -> Response:
        response = await call_next(request)
        
        # Inject standard security headers
        response.headers["Strict-Transport-Security"] = "max-age=31536000; includeSubDomains"
        response.headers["X-Frame-Options"] = "DENY"
        response.headers["X-Content-Type-Options"] = "nosniff"
        response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
        
        # CSP: Allowed cdn.jsdelivr.net and fastly.jsdelivr.net for Swagger UI styling and scripting
        response.headers["Content-Security-Policy"] = (
            "default-src 'self'; "
            "script-src 'self' 'unsafe-inline' 'unsafe-eval' cdn.jsdelivr.net; "
            "style-src 'self' 'unsafe-inline' cdn.jsdelivr.net; "
            "img-src 'self' data: cdn.jsdelivr.net fastly.jsdelivr.net; "
            "connect-src 'self'; "
            "frame-ancestors 'none';"
        )
        
        response.headers["Permissions-Policy"] = "geolocation=(), microphone=(), camera=()"
        
        return response
