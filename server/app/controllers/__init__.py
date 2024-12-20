#server/app/controllers/__init__.py
from .employee_controller import employee_bp
from .department_controller import department_bp
from .billing_controller import billing_bp
from .call_controller import call_bp
from .rate_controller import rate_bp
from .user_controller import user_bp

__all__ = [
    "employee_bp",
    "department_bp",
    "billing_bp",
    "call_bp",
    "rate_bp",
    "user_bp",
]
