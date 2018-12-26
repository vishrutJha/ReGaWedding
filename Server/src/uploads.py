import os
from flask import Flask, render_template, send_from_directory, request, redirect, url_for, json
from app import app
import werkzeug

UPLOAD_FOLDER = os.getcwd()+'/uploads'
ALLOWED_EXTENSIONS = set([ 'png', 'jpg', 'jpeg', 'gif'])

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

@app.route('/uploads/<filename>')
def uploaded_file(filename):
    return send_from_directory(app.config['UPLOAD_FOLDER'],
                               filename)



def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1] in ALLOWED_EXTENSIONS

@app.route('/uploads', methods=['POST'])
def upload_file():
    file = request.files['file']
    if file and allowed_file(file.filename):
        try:
            import random
            filename = werkzeug.secure_filename(file.filename)
            filename, file_extension = os.path.splitext(filename)
            filename = filename + str(random.randint(1, 10000000)) + file_extension
            file.save(os.path.join(app.config['UPLOAD_FOLDER'],  filename))
            return json.dumps({'filename':filename})

        except Exception as e:
            app.logger.error(e)
            return InvalidUsage('Server error'+e.message, status_code=500)

    else:
        raise InvalidUsage('No file found', status_code=410)
