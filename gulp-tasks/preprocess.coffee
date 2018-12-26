###
#
# Preprocessor
# @desc : Compile stuff
# @author: Nilaf Talapady
# @company: Moonraft Innovation Pvt Ltd
#
###


jade         = require('jade')
gulpJade     = require('gulp-jade')
typeset      = require('gulp-typeset')

coffee       = require('gulp-coffee')
sass         = require('gulp-sass')
browserSync  = require('browser-sync')
autoprefixer = require('autoprefixer-core')
sourcemaps   = require('gulp-sourcemaps')
postcss      = require('gulp-postcss')
px2rem       = require('gulp-pixrem')
react        = require('gulp-react')
copy         = require('gulp-copy')

usemin       = require("gulp-usemin")
minifyCss    = require('gulp-minify-css')
uglify       = require('gulp-uglify')
wait         = require('gulp-wait')


# For jade compile
gulp.task "JadeCompile", ->

    # Pass data to jade files (from a json)
    data = CONFIG.jadeData
    srcFolder =[ "#{CONFIG.SOURCE_FOLDER}/markup/**/*.jade"]

    watch(srcFolder,{ignoreInitial: false},batch( (events, done)->
        gulp.src(srcFolder)
            .pipe(filter(['**/*','!**/_*.jade']))
            .pipe(gulpJade(data:data,jade:jade))
            .on('error', (err)->
                gutil.log("Jade Error:#{err.message}")
                return notify().write("Jade Error: #{err.message}")
            )
            .pipe gulp.dest(CONFIG.DEST_FOLDER)
            .pipe browserSync.reload({stream:true})

    ))

    return



# Sass stuff
gulp.task "SASSCompile", ->
    srcFolder = "#{CONFIG.SOURCE_FOLDER}/styles/**/*.scss"
    watch(srcFolder,{ignoreInitial: false},batch( (events, done)->
        gulp.src([srcFolder])
            .pipe(sass(
                # on error, log and notify
                onError: (err) ->
                    gutil.log("SASS Error: #{err.message}")
                    return notify().write("SASS Error: #{err.message}")
            ))
            .pipe(filter('**/*.css')) # Filtering stream to only css files
            .pipe(px2rem())
            .pipe(postcss([autoprefixer(CONFIG.autoprefixerSupport)]))
            .pipe(gulp.dest(CONFIG.DEST_FOLDER+"/styles"))
            .pipe browserSync.reload({stream:true})
    ))
    return


# Coffeescript stuff
gulp.task "CoffeeCompile", ->
    srcFolder = ["#{CONFIG.SOURCE_FOLDER}/scripts/**/*.coffee"]

    watch(srcFolder,{verbose:true,ignoreInitial: false},batch( (events, done)->
        gulp.src(srcFolder)
            .pipe(sourcemaps.init())
            .pipe( coffee().on('error', (err)->
                    gutil.log("Coffee Error: #{err.message}")
                    notify().write("Coffee Error: #{err.message}")
                    done()
                    return
            ))
            .pipe(sourcemaps.write())
            .pipe gulp.dest(CONFIG.DEST_FOLDER+"/scripts")
            .pipe browserSync.reload({stream:true})
    ))
    return

# React JSX to js
gulp.task "ReactCompile", ->
    srcFolder = ["#{CONFIG.SOURCE_FOLDER}/scripts/**/*.jsx"]
    gulp.src(srcFolder)
        .pipe(watch(srcFolder))
        .pipe(sourcemaps.init())
        .pipe react()
        .on('error', (err)->
            gutil.log("React Error: #{err.message}")
            return notify().write("React Error: #{err.message}")
        )
        .pipe(sourcemaps.write())
        .pipe gulp.dest(CONFIG.DEST_FOLDER+"/scripts")
        .pipe browserSync.reload({stream:true})

    return

# Copy images, fonts
gulp.task "CopyAssets", ->
    srcFolder = ["images/**/*","fonts/**/*","scripts/**/*.js"]
    watch srcFolder,cwd:CONFIG.SOURCE_FOLDER
        .pipe(debug())
        .pipe(copy(CONFIG.DEST_FOLDER))

    return

# Copy bower
gulp.task "CopyBower", ->
    srcFolder = ["bower/**/*"]
    gulp.src srcFolder
        .pipe(plumber())
        .pipe(watch(srcFolder))
        .pipe(copy(CONFIG.DEST_FOLDER))

    return


# minify css, js etc...
gulp.task "usemin", ->
    pathToIndexHtml = "#{CONFIG.DEST_FOLDER}/index.html"
    gulp.src [pathToIndexHtml]
        .pipe(wait(1000))
        .pipe(usemin(
            css: [
                minifyCss()
            ]
            js:[
                uglify()
                "concat"
            ]
        ))
        .pipe(wait(1000))
        .pipe gulp.dest(CONFIG.DEST_FOLDER)
