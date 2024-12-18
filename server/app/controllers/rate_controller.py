from flask import Blueprint, jsonify
from app.services.rate_service import RateService

rate_bp = Blueprint("rate", __name__)
rate_service = RateService()


@rate_bp.route("/", methods=["GET"])
def get_all_rates():
    """Возвращает все тарифы."""
    rates = rate_service.get_all_rates()
    return jsonify([rate.to_dict() for rate in rates]), 200


@rate_bp.route("/employee/<int:employee_id>/discounts", methods=["GET"])
def get_discounts_by_employee(employee_id):
    """
    Возвращает скидки на типы звонков по ID сотрудника.
    """
    discounts = rate_service.get_discounts_by_employee_id(employee_id)
    if "message" in discounts:
        return jsonify({"error": discounts["message"]}), 404
    return jsonify({"employee_id": employee_id, "discounts": discounts}), 200
