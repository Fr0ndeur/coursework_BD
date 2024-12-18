from flask import Blueprint, jsonify, g
from app.services.rate_service import RateService
from app.services.user_service import UserService
from app.decorators.auth_decorator import jwt_required

rate_bp = Blueprint("rate", __name__)
rate_service = RateService()
user_service = UserService()


@rate_bp.route("/", methods=["GET"])
@jwt_required(roles=["admin", "accountant"])
def get_all_rates():
    """
    Возвращает все тарифы.
    Доступно только для admin и accountant.
    """
    rates = rate_service.get_all_rates()
    return jsonify([rate.to_dict() for rate in rates]), 200


@rate_bp.route("/employee/<int:employee_id>/discounts", methods=["GET"])
@jwt_required(roles=["admin", "accountant", "user"])
def get_discounts_by_employee(employee_id):
    """
    Возвращает скидки на типы звонков по ID сотрудника.
    - admin/accountant могут получать скидки любого сотрудника.
    - user может запрашивать только свои скидки.
    """
    # Если роль "user", проверяем соответствие employee_id
    if g.user_role == "user":
        user_employee_id = user_service.get_employee_id_by_user_id(g.user_id)
        if not user_employee_id or user_employee_id != employee_id:
            return jsonify({"error": "Forbidden"}), 403

    # Получаем скидки
    discounts = rate_service.get_discounts_by_employee_id(employee_id)
    if "message" in discounts:
        return jsonify({"error": discounts["message"]}), 404
    return jsonify({"employee_id": employee_id, "discounts": discounts}), 200
