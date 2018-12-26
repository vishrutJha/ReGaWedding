###
#
# Analyse
# @desc : code,project analysers  
# @author: Nilaf Talapady
# @company: Moonraft Innovation Pvt Ltd
#
###

config       = require('./config.coffee')
stylestats   = require('gulp-stylestats')

# using browsersync
gulp.task "cssAnalyse", ->
    gulp.src("#{config.SOURCE_FOLDER}/styles/*.css")
	    .pipe(stylestats())
    return
