from fastapi import Request, HTTPException
from fastapi.responses import JSONResponse
from starlette.exceptions import HTTPException as StarletteHTTPException
from fastapi.exceptions import RequestValidationError

async def http_error_handler(request: Request, exc: StarletteHTTPException):

    return JSONResponse(
        status_code=exc.status_code,
        content={
            "error": {
                "code": exc.status_code,
                "message": exc.detail,
                "path": request.url.path
            }
        }
    )

async def validation_exception_handler(request: Request, exc: RequestValidationError):

    return JSONResponse(
        status_code=422,
        content={
            "error": {
                "code": 422,
                "message": "Przesłane dane są nieprawidłowe",
                "details": exc.errors(),
                "path": request.url.path
            }
        }
    )

async def unhandled_exception_handler(request: Request, exc: Exception):
    
    return JSONResponse(
        status_code=500,
        content={
            "error": {
                "code": 500,
                "message": "Wystąpił nieoczekiwany błąd po stronie serwera",
                "path": request.url.path
            }
        }
    )