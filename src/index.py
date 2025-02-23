from app.flask import app
from app.routes import health_bp, gen_image_personality_bp

# Register blueprints
app.register_blueprint(health_bp)
app.register_blueprint(gen_image_personality_bp)

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=7777)
