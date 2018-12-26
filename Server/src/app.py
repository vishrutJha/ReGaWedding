# setup flask and db here
import os
from flask import Flask
from flask.ext.sqlalchemy import SQLAlchemy
import datetime
import sqlalchemy as sa
from sqlalchemy_continuum import make_versioned, versioning_manager
from sqlalchemy import UniqueConstraint

from sqlalchemy_continuum.plugins import PropertyModTrackerPlugin

# property tracker
versioning_manager.plugins.append(PropertyModTrackerPlugin())

# for versioning data
make_versioned(user_cls=None)


static_folder = os.getcwd()+'/static'
# static_folder = '/' + os.getcwd()+'/static'

# configure flask
app = Flask(__name__, static_url_path='/' + static_folder)
app.config['SECRET_KEY'] = 'secret!'
app.config['STATIC_FOLDER']  = static_folder
app.debug = True
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+mysqldb://root:password@localhost:3306/tmobiledashboard'
db = SQLAlchemy(app)


# Configure dictionary
class Dictionary(db.Model):
    __tablename__ = 'dictionary'
    __versioned__ = {}

    id 			 = db.Column(db.Integer, 	 nullable=False, primary_key=True, autoincrement=True)
    widget_id 	 = db.Column(db.String(100), nullable=False)
    key 		 = db.Column(db.String(100), nullable=False)
    value   	 = db.Column(db.TEXT, 		 nullable=False)
    author  	 = db.Column(db.String(100), nullable=True )
    last_updated = db.Column(db.DateTime,    nullable=False, onupdate=datetime.datetime.utcnow, default=datetime.datetime.utcnow)

    __table_args__ = (
            UniqueConstraint("widget_id", "key"),
            {'extend_existing': True}
        )
    def __init__(self, widget_id, key):
        self.widget_id = widget_id
        self.key       = key
    def __repr__(self):
        return '<Id %r>' % self.id

# sqlalchemy_continuum
sa.orm.configure_mappers()

db.create_all()
