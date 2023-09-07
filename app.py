from flask import Flask, render_template, request, url_for, jsonify
import time

app = Flask(__name__, static_url_path="/static")


@app.route("/")
def index():
    return render_template("index.html")


@app.route("/api/compress", methods=["POST"])
def compress():
    # image = request.form.get("image")
    time.sleep(1)

    image_filename = "aaron.jpg"
    image_url = url_for("static", filename=image_filename)

    return jsonify({"image_url": image_url})
