#!/bin/bash
# declare STRING variable

export PATH=$PATH:/usr/local/mysql/bin
sudo /usr/local/mysql/support-files/mysql.server stop
sudo /usr/local/mysql/support-files/mysql.server start
BASEDIR=$(dirname $0)
cd $BASEDIR
. venv/bin/activate
python main.py
