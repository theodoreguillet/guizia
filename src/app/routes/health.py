from flask import Blueprint, jsonify

health_bp = Blueprint("health", __name__)


@health_bp.route("/health", methods=["GET"])
def route_handler():
    return jsonify({"status": "Service is running"}), 200
