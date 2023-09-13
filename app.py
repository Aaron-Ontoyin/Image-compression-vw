from flask import Flask, render_template, request, jsonify, send_file
from PIL import Image
from io import BytesIO
import tempfile
import os

from utilities import compress_image


app = Flask(__name__, static_url_path="/static")

imageData = None

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/api/compress", methods=["POST"])
def process_image():
    if "image" not in request.files:
        return jsonify({"error": "No file part"})

    file = request.files["image"]

    if file.filename == "":
        return jsonify({"error": "No selected file"})

    if file:
        try:
            image = Image.open(file)
            settings = request.form


            image_format = settings.get("image_format", "JPEG")
            compression_magnitude = int(settings.get("compression_magnitude", 100))
            resolution1 = int(settings.get("resolution1", image.width))
            resolution2 = int(settings.get("resolution2", image.height))
            resolution = (resolution1, resolution2)
            meta_data_preservation = settings.get("meta_data_preservation", "Preserve")
            color_space = settings.get("color_space", "RGB")

            img_io = BytesIO()
            compressed_image = compress_image(
                output_path=img_io,
                image_format=image_format,
                compression_magnitude=compression_magnitude,
                resolution=resolution,
                meta_data_preservation=meta_data_preservation,
                color_space=color_space,
                img=image,
            )
            
            global imageData

            with tempfile.NamedTemporaryFile(delete=False) as temp_file:
                compressed_image.save(temp_file, format=image_format)
            size_in_bytes = os.path.getsize(temp_file.name)

            imageData = {
                "size": size_in_bytes,
                "format": image_format,
                "height": compressed_image.height,
                "width": compressed_image.width,
            }
            os.remove(temp_file.name)

            img_io.seek(0)

            download_name = "compressed_image." + image_format.lower()
            mimetype = "image/" + image_format.lower()
            return send_file(img_io, mimetype=mimetype, download_name=download_name)
        

        except Exception as e:
            print(e)
            return jsonify({"error": str(e)})

@app.route("/api/image-data", methods=["GET",])
def get_image_data():
    global imageData

    return jsonify(imageData)