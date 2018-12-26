###
#
# SERVER
# @desc : run a server
# @author: Nilaf Talapady
# @company: Moonraft Innovation Pvt Ltd
#
###

config       = require('./config.coffee')

# using browsersync
gulp.task "browserSync", ->
    browserSync(
        server:
            baseDir: config.DEST_FOLDER

        browser: "google chrome"
        # proxy:'localhost:5000'
    )
    return
