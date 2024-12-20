# server/app/routes.py
from app.controllers import (
    employee_bp,
    department_bp,
    billing_bp,
    call_bp,
    rate_bp,
    user_bp,
)


def init_routes(app):
    app.register_blueprint(employee_bp, url_prefix="/employees")
    app.register_blueprint(department_bp, url_prefix="/departments")
    app.register_blueprint(billing_bp, url_prefix="/billing")
    app.register_blueprint(call_bp, url_prefix="/calls")
    app.register_blueprint(rate_bp, url_prefix="/rates")
    app.register_blueprint(user_bp, url_prefix="/users")
