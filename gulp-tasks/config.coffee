###
#
# CONFIGURATION
# @desc : config
# @author: Nilaf Talapady
# @company: Moonraft Innovation Pvt Ltd
#
###

CONFIG = {}

# Folders
CONFIG.DEST_FOLDER   = "./build"
CONFIG.SOURCE_FOLDER = "./src"
CONFIG.RELEASE_FOLDER = "./release"

# browser support needed . Check https://github.com/ai/browserslist#queries
CONFIG.autoprefixerSupport = {browsers:['> 1%', 'last 3 versions', 'Firefox ESR', 'Opera 12.1', 'ie 9']}

# pass data to be accessed inside jade files
CONFIG.jadeData = {'name':'Grant Elliot'}

module.exports = CONFIG

