import os
from flask import Flask, render_template, jsonify, request, abort

app = Flask(__name__, template_folder='.', static_url_path='/src', static_folder='src')

# Google Sheets API Setup
import gspread
from google.oauth2.credentials import Credentials

if os.path.exists('credentials.json'):
    credential = Credentials.from_authorized_user_file("credentials.json",
                                                              ['https://www.googleapis.com/auth/spreadsheets.readonly'])
client = gspread.authorize(credential)
gsheet = client.open("Información de contacto (Respuestas)")

# prevent cached responses
if app.config["DEBUG"]:
    @app.after_request
    def after_request(response):
        response.headers["Cache-Control"] = "no-cache, no-store, must-revalidate, public, max-age=0"
        response.headers["Expires"] = 0
        response.headers["Pragma"] = "no-cache"
        return response

# An example GET Route to get all reviews
@app.route('/all_reviews', methods=["GET"])
def all_reviews():
    return jsonify(gsheet.get_all_records())

# An example POST Route to add a review
@app.route('/add_review', methods=["POST"])
def add_review():
    req = request.get_json()
    row = [req["rut"]]
    gsheet.insert_row(row, 3)  # since the first row is our title header
    return jsonify(gsheet.get_all_records())

@app.route('/')
def index():
    return render_template('index.html')