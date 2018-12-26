###
#
# Globals
# @desc : global variables to share between modules
# @author: Nilaf Talapady
# @company: Moonraft Innovation Pvt Ltd
#
###

GLOBAL.gutil       = require('gulp-util')
GLOBAL.runSequence = require('run-sequence')
GLOBAL.filter      = require('gulp-filter')
GLOBAL.gulp        = require('gulp')
GLOBAL.browserSync = require('browser-sync')
GLOBAL.notify      = require("gulp-notify")
GLOBAL.watch       = require('gulp-watch')
GLOBAL.batch       = require('gulp-batch')
GLOBAL.filter      = require('gulp-filter')
GLOBAL.debug       = require('gulp-debug')
GLOBAL.plumber     = require('gulp-plumber')
GLOBAL.rimraf      = require('gulp-rimraf')


GLOBAL.CONFIG      = require('./config.coffee')
