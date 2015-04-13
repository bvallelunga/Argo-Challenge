# Import NPM Modules
config              = require "./config"
express             = require "express"
app                 = express()

# Express Config
app.set "view engine", "html"
app.set "view options", layout: true
app.set "view cache", true
app.set "x-powered-by", false

# Direct Assests
app.use "/", require('serve-static') "#{__dirname}/src"
app.use "/javascript", require('serve-static') "#{__dirname}/src/javascript"
app.use "/images", require('serve-static') "#{__dirname}/src/images"
app.use "/css", require('serve-static') "#{__dirname}/src/css"
app.use "/audio", require('serve-static') "#{__dirname}/src/audio"

# Start Listening to Port
app.listen process.env.PORT or config.general.port
