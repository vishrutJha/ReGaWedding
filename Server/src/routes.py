import os
from flask import Flask, render_template, send_from_directory
from flask.ext.sqlalchemy import SQLAlchemy
from flask_socketio import SocketIO, emit

from app import app, db
import uploads
from helpers.errorhandler import InvalidUsage
from remote import socketio
from widget import create, get_all, get, init, deleteall

from flask import request, json

@app.route("/")
def index():
    return send_from_directory(app.config['STATIC_FOLDER'],'index.html')


@app.route("/builder")
def builder():
    return send_from_directory(app.config['STATIC_FOLDER'],'builder.html')


@app.route("/display")
def display():
    return send_from_directory(app.config['STATIC_FOLDER'],'tv.html')


@app.route("/api/widgets")
def get_all_widgets():
    args = request.args
    return get_all(args)

@app.route("/api/deleteall")
def delete_all():
    return deleteall()




@app.route("/api/widgets", methods=['POST'])
def create_widget():
    data = json.loads(request.data)
    if isinstance(data, list):
        for entry in data:
            create(entry)

    else:
        create(data)
    return json.jsonify({"result":"success"})


@app.route("/api/widgets/<widget_id>/<key>")
def get_widget(widget_id, key):
    return (get(widget_id, key))


@app.route('/<path:path>')
def static_proxy(path):
    return send_from_directory(app.config['STATIC_FOLDER'],path)


init()
