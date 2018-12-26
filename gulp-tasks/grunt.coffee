###
#
# GRUNT
# @desc : Run grunt tasks from gulp
# @authors: Nilaf Talapady, Sunil Fernandes
# @company: Moonraft Innovation Pvt Ltd
#
###

config       = require('./config.coffee')

gulp_grunt 	 = require('gulp-grunt')

tasks = gulp_grunt.tasks(
		# base: require('path').join(__dirname, 'relativePathToGruntFile')

		base: null # this is just the directory that your Gulpfile is in
		prefix: 'grunt-'
	)


# example
# if grunt has task 'sass:dist'
# run it as 'grunt-sass:dist'