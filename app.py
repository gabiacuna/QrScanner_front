import os
from flask import Flask, render_template, jsonify, request, abort

app = Flask(__name__, template_folder='.', static_url_path='/static', static_folder='static')

# prevent cached responses
if app.config["DEBUG"]:
    @app.after_request
    def after_request(response):
        response.headers["Cache-Control"] = "no-cache, no-store, must-revalidate, public, max-age=0"
        response.headers["Expires"] = 0
        response.headers["Pragma"] = "no-cache"
        return response

@app.route('/')
def index():
    return render_template('index.html')
