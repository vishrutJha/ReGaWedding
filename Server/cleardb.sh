#!/bin/bash
export PATH=$PATH:/usr/local/mysql/bin
clear;
while true; do
    read -p "Do you wish to clear the database? Type Y or N" yn
    case $yn in
        [Yy]* ) clear;sudo /usr/local/mysql/support-files/mysql.server stop;sudo /usr/local/mysql/support-files/mysql.server start;echo "Type MySQL database root password";mysql -u root -p  -Bse "drop database tmobiledashboard;create database tmobiledashboard;";break;;
        [Nn]* ) exit;;
        * ) echo "    ";;
    esac
done
