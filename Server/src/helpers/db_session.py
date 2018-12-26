import re
import sqlalchemy.exc
import functools

from flask import abort


event_listners = []


class NastyError(Exception):
    def __init__(self,msg,code,log=''):
        Exception.__init__(self, msg)
        self.msg  = msg
        self.code = code
        self.log  = log


def on_session_commit(action_func):
    @functools.wraps(action_func)
    def on_commit(*args, **kwargs):
        print func.__name__ + " was called"
        return func(*args, **kwargs)

    event_listners.append(action_func)

    # print event_listners
    return action_func


def session_commit():
    from app import db
    field  = ''
    code   = ''
    try:
        db.session.commit()

    except sqlalchemy.exc.IntegrityError, exc:
        reason = exc.message
        msg    = reason

        db.session.rollback()

        # for duplicate
        matchObj = re.search(r'Duplicate entry \'(.*)\' for key \'(.*)\'', reason, re.M|re.I)
        if matchObj:
            # Eg. Duplicate entry 'hari@moonraft.com' for key 'email'
            field =  matchObj.group(2)
            msg   = "%s already exists" % field
            code  = "%s_DUPLICATE"  % field


        # foreign key fails
        matchObj = re.search(r'Cannot add or update a child row: a foreign key constraint fails \(`vector`.`(.*)`, CONSTRAINT `(.*)` FOREIGN KEY \(`(.*)`\) REFERENCES', reason, re.M|re.I)
        if matchObj:
            # Eg.Cannot add or update a child row: a foreign key constraint fails (`vector`.`rafter`, CONSTRAINT `fk_rafter$context` FOREIGN KEY (`context_id`) REFERENCES `context` (`label`) ON DELETE NO ACTION ON UPDATE CASCADE)
            field =  matchObj.group(3)
            msg   = "%s invalid data" % field
            code  = "%s_INVALID"  % field

        raise NastyError(msg,code,reason)


    except sqlalchemy.exc.OperationalError, exc:
        reason = exc.message
        msg    = reason

        rollback_session = True
        db.session.rollback()

        matchObj = re.search(r'Field \'(.*)\' doesn\'t have a default value', reason, re.M|re.I)

        # Duplicate Entry
        if matchObj:
            # Eg. Duplicate entry 'hari@moonraft.com' for key 'email'
            field =  matchObj.group(1)
            msg   = "%s is duplicated" % field
            code  = "%s_DUPLICATE"  % field

        # Column null
        matchObj = re.search(r'Column \'(.*)\' cannot be null', reason, re.M|re.I)
        if matchObj:
            # ( "Column 'stream_id' cannot be null")
            field =  matchObj.group(1)
            msg   = "%s is empty" % field
            code  = "%s_EMPTY"  % field

        # Incorrect Values
        matchObj = re.search(r'Incorrect integer value: \'(.*)\' for column \'(.*)\' at', reason, re.M|re.I)
        if matchObj:
            #  "Incorrect integer value: 'India' for column 'location_id' at row 1")
            field =  matchObj.group(2)
            msg   = "%s invalid data, Incorrect integer value" % field
            code  = "%s_INVALID"  % field

        # raise NastyError(msg,code,reason)

        matchObj = re.search(r'CODE:{(.*)}, MESSAGE:{(.*)}', reason, re.M|re.I)
        # 'CODE:{allocation_overlap}, MESSAGE:{Allocation Overlap}
        if matchObj:
            code =  matchObj.group(1)
            msg  =  matchObj.group(2)

        matchObj = re.search(r'\'\((.*)\), \((.*)\)\'', reason, re.M|re.I)
        # (allocation_overlap), (Allocation Overlap)
        if matchObj:
            code =  matchObj.group(1)
            msg  =  matchObj.group(2)

        # if rollback_session == True:
        #     db.session.rollback()
        raise NastyError(msg,code,reason)


    except sqlalchemy.exc.DataError, exc:
        reason = exc.message
        msg    = reason

        db.session.rollback()

        # for invalid data
        # Exception raised for errors that are due to problems with the processed data like division by zero, numeric value out of range, etc.
        matchObj = re.search(r'Data truncated for column \'(.*)\'', reason, re.M|re.I)
        if matchObj:
            field =  matchObj.group(1)
            msg   = "%s invalid data" % field
            code  = "%s_INVALID"  % field

        matchObj = re.search(r'Data too long for column \'(.*)\'', reason, re.M|re.I)
        # (_mysql_exceptions.DataError) (1406, "Data too long for column 'reason_whom' at row 1")
        if matchObj:
            field =  matchObj.group(1)
            msg   = "%s data too long" % field
            code  = "%s_INVALID"  % field

        matchObj = re.search(r'CODE:{(.*)}, MESSAGE:{(.*)}', reason, re.M|re.I)
        if matchObj:
            code =  matchObj.group(1)
            msg  =  matchObj.group(2)

        matchObj = re.search(r'\'\((.*)\), \((.*)\)', reason, re.M|re.I)
        if matchObj:
            code =  matchObj.group(1)
            msg  =  matchObj.group(2)

        raise NastyError(msg,code,reason)


    except sqlalchemy.exc.ProgrammingError, exc:
        reason = exc.message
        msg    = reason

        db.session.rollback()

        # for invalid data
        # This exception is raised on programming errors, for example when you have a syntax error in your SQL or a table was not found.
        matchObj = re.search(r'You have an error in your SQL syntax; check the manual that corresponds to your MySQL server version for the right syntax to use near (.*)\) \[SQL ', reason, re.M|re.I)
        if matchObj:
            field =  matchObj.group(1)
            msg   = "%s invalid data" % field
            code  = "%s_INVALID"  % field


        raise NastyError(msg,code,reason)
