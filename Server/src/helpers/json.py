# JSON Utilities
#
# author: Nilaf Talapady
#

from flask import json
import datetime
from sqlalchemy import Integer, String, Numeric, Table, Column
import decimal
from decimal import Decimal
from sqlalchemy.ext.declarative import DeclarativeMeta
from sqlalchemy.orm import joinedload, load_only, Load, defer
from sqlalchemy.inspection import inspect
import re, ast, datetime



camel_pat = re.compile(r'([A-Z])')
under_pat = re.compile(r'_([a-z])')

def underscore_to_camel(name):
    return under_pat.sub(lambda x: x.group(1).upper(), name)

def camel_to_underscore(name):
    return camel_pat.sub(lambda x: x.group(1).upper(), name)


def obj_to_dict(obj):
    d = {}
    for column in obj.__table__.columns:
        d[column.name] = str(getattr(obj, column.name))
    return d

def convert_json(obj):
    from app import db

    if isinstance(obj, list):
        json_list = []
        for entry in obj:
            entry_json = convert_json(entry) if isinstance(entry,dict) else entry
            json_list.append(entry_json)
        return json_list

    # if isinstance(obj,db.Model):
    #     obj = obj_to_dict(obj)
    new_obj = {}
    for k, v in obj.iteritems():
        # new_obj[underscore_to_camel(k)] = convert_json(v) if isinstance(v,dict) else v

        if isinstance(v,list):
            v_list = []
            for entry in v:
                entry  = convert_json(entry) if isinstance(entry,dict) else entry
                v_list.append(entry)
            new_obj[underscore_to_camel(k)] = v_list
        elif isinstance(v,dict):
            new_obj[underscore_to_camel(k)] = convert_json(v)
        else:
            new_obj[underscore_to_camel(k)] = v
        # new_obj[underscore_to_camel(k)] = convert_json(v,underscore_to_camel) if isinstance(v,dict) else v
    return new_obj

class JsonEncoder(json.JSONEncoder):
    def default(self, obj):
        from app import db

        if isinstance(obj, datetime.datetime):
            return obj.isoformat()


        elif isinstance(obj, datetime.date):
            return obj.isoformat()

        elif isinstance(obj, Decimal):
            return (str(obj) for obj in [obj])

        elif isinstance(obj.__class__, DeclarativeMeta):
                # an SQLAlchemy class
                fields = {}
                skip_fields_list = ['SHORT_VERSION','RELATIONSHIPS']

                for field in [x for x in dir(obj) if not x.startswith('_') and not x.startswith('dictalchemy_') and x != 'metadata' and not x.startswith('query')]:
                    data = obj.__getattribute__(field)
                    field = underscore_to_camel(field)
                    # print field
                    if field == 'isComplete':
                        fields[field] = False if data == 0 else True
                        continue


                    if field in skip_fields_list:
                        continue

                    try:

                        # if isinstance(data,list):
                        #     obj_list = []
                        #     for entry in data:
                        #         obj_list.append(convert_json(entry))
                        #     data = list(obj_list)
                        json.dumps(data)
                        fields[field] = data
                    except TypeError:


                        if isinstance(data,list):
                            fields[field] =  list(data)
                        elif isinstance(data,db.Model):
                            fields[field] = convert_json(data.asdict())
                        # elif isinstance(data,dict):
                        #     fields[field] = convert_json(data)

                        elif isinstance(data, datetime.date):
                            fields[field] = data.isoformat()

                        elif isinstance(data, Decimal):
                            fields[field] = (str(data) for data in [data])

                        else:
                            # print "skip ",field,data,type(data)

                            if isinstance(data, decimal.Decimal):
                                print "it is decimal"

                # a json-encodable dict
                return fields


        else:
            return json.JSONEncoder.default(self, obj)

    def encode(self, obj):
        if isinstance(obj,dict):
            obj = convert_json(obj)
        return super(JsonEncoder, self).encode(obj)

def jsonify(data):
    return json.dumps(data,cls=JsonEncoder)
