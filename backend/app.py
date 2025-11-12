from flask import Flask, request, jsonify
from flask_cors import CORS
from voice_authentication import VoiceAuthenticator
import os
import tempfile

# ----------------------------------------
# Flask setup
# ----------------------------------------
app = Flask(__name__)
CORS(app)
voice_auth = VoiceAuthenticator()


@app.route("/")
def home():
    return jsonify({"message": "✅ Voice Authentication API is running"})


# ----------------------------------------
# Registration Endpoint
# ----------------------------------------
@app.route("/register", methods=["POST"])
def register():
    student_id = request.form.get("student_id")
    audio_file = request.files.get("audio")

    print("➡ Received register request for:", student_id)
    if not student_id or not audio_file:
        print("⚠ Missing student ID or audio file")
        return jsonify({
            "success": False,
            "message": "Missing student ID or audio file"
        }), 400

    # Save the uploaded .wav temporarily
    with tempfile.NamedTemporaryFile(delete=False, suffix=".wav") as tmp:
        audio_file.save(tmp.name)
        tmp_path = tmp.name

    print(f"📁 Saved temp file: {tmp_path}, size: {os.path.getsize(tmp_path)} bytes")

    # Run the registration
    success = voice_auth.register_from_file(student_id, tmp_path)

    # Remove temp file
    try:
        os.remove(tmp_path)
    except Exception as e:
        print("⚠ Could not remove temp file:", e)

    # Convert NumPy bool_ → Python bool
    success = bool(success)

    print("✅ Registration result:", success)
    return jsonify({
        "success": success,
        "message": "Voice registered successfully!" if success else "Registration failed."
    })


# ----------------------------------------
# Verification Endpoint
# ----------------------------------------
@app.route("/verify", methods=["POST"])
def verify():
    student_id = request.form.get("student_id")
    audio_file = request.files.get("audio")

    print("➡ Received verify request for:", student_id)
    if not student_id or not audio_file:
        print("⚠ Missing student ID or audio file")
        return jsonify({
            "success": False,
            "message": "Missing student ID or audio file"
        }), 400

    # Save uploaded .wav temporarily
    with tempfile.NamedTemporaryFile(delete=False, suffix=".wav") as tmp:
        audio_file.save(tmp.name)
        tmp_path = tmp.name

    print(f"📁 Saved temp file: {tmp_path}, size: {os.path.getsize(tmp_path)} bytes")

    # Run verification
    success = voice_auth.verify_from_file(student_id, tmp_path)

    # Remove temp file
    try:
        os.remove(tmp_path)
    except Exception as e:
        print("⚠ Could not remove temp file:", e)

    # Convert NumPy bool_ → Python bool
    success = bool(success)

    print("✅ Verification result:", success)
    return jsonify({
        "success": success,
        "message": "Verification successful!" if success else "Verification failed."
    })


# ----------------------------------------
# Run the server
# ----------------------------------------
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
