from flask_socketio import SocketIO, emit
from flask import json
from app import app

socketio = SocketIO(app)

@socketio.on('connect', namespace='/api/remote')
def test_connect():
    emit('my response', {'data': 'Connected', 'count': 0})

@socketio.on('user_details', namespace='/api/remote')
def handle_userdetails_event(data):
    print('Client Connected ' + data['clientName'])


@socketio.on('refresh_client_request', namespace='/api/remote')
def refresh_clients(data):
    print('Refresh All Clients')
    emit('refresh_clients',data, broadcast=True)
    return json.dumps({"message":"success"})


@socketio.on('remote_action', namespace='/api/remote')
def handle_userdetails_event(data):
    print('Remote Action ',data)
    emit('remote_reaction',data, broadcast=True)

@socketio.on('my event', namespace='/api/remote')
def handle_my_custom_event(json):
    print('received json:  ' + str(json))
