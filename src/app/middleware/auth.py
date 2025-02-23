from flask import request, jsonify
import os
from functools import wraps
from app.flask import app


def require_api_key(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        api_key = os.environ.get("API_KEY")
        if not api_key:
            return jsonify({"error": "API key is not configured."}), 500

        # Récupérer la clé d'API de l'en-tête de la requête
        request_api_key = request.headers.get("X-API-Key")
        if not request_api_key or request_api_key != api_key:
            return jsonify({"error": "Unauthorized access."}), 401

        return app.ensure_sync(f)(*args, **kwargs)

    return decorated
