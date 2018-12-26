###
#
# Starts here
# @desc : All tasks
# @author: Nilaf Talapady
# @company: Moonraft Innovation Pvt Ltd
#
###

gulp         = require('gulp')

copy         = require('gulp-copy')

globals      = require('./globals.coffee')

preprocessor = require('./preprocess.coffee')
gulpGrunt    = require('./grunt.coffee')
server       = require('./server.coffee')


runSequence  = require('run-sequence')

gulp.task 'clean',(cb)->
    gulp.src(CONFIG.DEST_FOLDER)
        .pipe(rimraf())

# default task
gulp.task 'default', ->
    runSequence 'clean',['JadeCompile','SASSCompile','CoffeeCompile','ReactCompile','CopyAssets','CopyBower'],->
        runSequence 'browserSync'


gulp.task 'basic',(callback)->
    runSequence(['JadeCompile','SASSCompile','CoffeeCompile','ReactCompile','CopyAssets'],callback)

gulp.task 'release', [] , (cb)->
    CONFIG.DEST_FOLDER = CONFIG.RELEASE_FOLDER
    runSequence('basic','browserSync','usemin')
    # runSequence 'basic','browserSync','usemin',->
    #     gutil.log("Gulp Release Complete")
    #     cb()
