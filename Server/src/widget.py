from flask import Flask, render_template, send_from_directory, request
from flask.ext.sqlalchemy import SQLAlchemy
from sqlalchemy_continuum import version_class

from app import app, Dictionary, db
from helpers.db_session import session_commit,NastyError
from flask import json

from helpers import json
import datetime


def deleteall():
    result = 'Failed'
    msg    = 'deleteall data Failed'






    try:
        from sqlalchemy import create_engine
        engine     = create_engine('mysql+mysqldb://root:password@localhost:3306/tmobiledashboard')
        no_of_tbls = len(db.metadata.sorted_tables)

        # for tbl in reversed(db.metadata.sorted_tables):
        #     app.logger.debug('table')
        #     connection = engine.connect()
        #     connResult = connection.execute(tbl.select())
        #     # fully read result sets
        #     connResult.fetchall()
        #     # close connections
        #     connection.close()
        #     # now locks are removed
        #     tbl.drop(engine)

        db.drop_all()
        db.create_all()
        result  = 'Success'
        msg     = 'Deleted ' + str(no_of_tbls) + ' tables'
    except Exception, e:
        raise e
        pass
    return json.jsonify({'code':result,'result':result,'msg':msg})


def init():
    widget = Dictionary.query.filter_by(widget_id='app', key='all_widgets').scalar()

    msg    = 'Widgets Data Already Exist'
    result = 'Success'

    if widget == None:
        widget = Dictionary('app','all_widgets')

        values = {
            "theme" : "Dark",
            "gridData" : [
                {
                    "type" : "tall"
                },
                {
                    "type" : "tall"
                },
                {
                    "type" : "tall"
                },
                {
                    "type" : "sidebar"
                },
                {
                    "type" : "wide"
                }
            ]
        }

        widget.value     = json.jsonify(values)
        widget.author    = 'admin'

        db.session.add(widget)
        db.session.commit()

        msg    = 'Widgets Data Added'
    return json.jsonify({'code':result,'result':result,'msg':msg})



def create(data):
    widget_id = data.get('widget_id')
    key       = data.get('key')


    widget = Dictionary.query.filter_by(widget_id=widget_id, key=key).scalar()


    is_widget_add = False
    if widget == None:
        is_widget_add = True
        widget = Dictionary(widget_id,key)


    # widget.id        = data.get('id',        widget.id)
    widget.widget_id = data.get('widget_id', widget.widget_id)
    widget.key       = data.get('key',       widget.key)
    widget.value     = json.jsonify(data.get('value'))
    widget.author    = data.get('author',    widget.author)

    if is_widget_add == True:
        db.session.add(widget)
    try:
        db.session.commit()
    except Exception as e:
        print e

    return True


def get_all(args):
    from app import db
    widgets = Dictionary.query.all()
    return json.jsonify(widgets)


def get(widget_id, key):

    history = request.args.get('history')

    if history == "true":
        OutputClass = version_class(Dictionary)
    else:
        OutputClass = Dictionary

    query = db.session.query(OutputClass).filter_by(widget_id=widget_id, key=key)

    if history == "true":
        query = query.filter(OutputClass.value_mod)
        query = query.order_by(OutputClass.last_updated.desc())

        date_before= request.args.get('datebefore')
        if date_before != None:
            query = query.filter(OutputClass.last_updated <= date_before)

        limit = request.args.get('limit')
        if limit != None:
            query = query.limit(limit)

    results = query.all()
    if len(results) == 0:
        raise NastyError("not_found", "No results found")

    return json.jsonify(results)
