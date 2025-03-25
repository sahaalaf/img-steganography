from flask import Flask, request, send_file, jsonify
from flask_cors import CORS
from PIL import Image
import numpy as np
import io
import os

app = Flask(__name__)
CORS(app) 

UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

def encode_image(cover_img, secret_img):
    cover = Image.open(cover_img).convert("RGB")
    secret = Image.open(secret_img).convert("RGB")

    secret = secret.resize(cover.size, Image.Resampling.LANCZOS)

    cover_arr = np.array(cover)
    secret_arr = np.array(secret)
    encoded_arr = (cover_arr & 0xFE) | (secret_arr >> 7)

    encoded_img = Image.fromarray(encoded_arr)
    img_io = io.BytesIO()
    encoded_img.save(img_io, "PNG")
    img_io.seek(0)
    return img_io

def extract_image(encoded_img):
    encoded = Image.open(encoded_img).convert("RGB")
    encoded_arr = np.array(encoded)

    extracted_arr = (encoded_arr & 0x01) * 255
    extracted_img = Image.fromarray(extracted_arr)

    img_io = io.BytesIO()
    extracted_img.save(img_io, "PNG")
    img_io.seek(0)
    return img_io

@app.route("/encode", methods=["POST"])
def encode():
    cover_img = request.files["cover"]
    secret_img = request.files["secret"]

    encoded_img = encode_image(cover_img, secret_img)
    return send_file(encoded_img, mimetype="image/png", as_attachment=True, download_name="encoded.png")

@app.route("/decode", methods=["POST"])
def decode():
    encoded_img = request.files["encoded"]

    extracted_img = extract_image(encoded_img)
    return send_file(extracted_img, mimetype="image/png", as_attachment=True, download_name="extracted.png")

if __name__ == "__main__":
    app.run(debug=True)
