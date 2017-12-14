process.env.NODE_ENV = 'development'

require('colors')
require('dotenv').config()

var
  path = require('path'),
  express = require('express'),
  webpack = require('webpack'),
  env = require('./env-utils'),
  config = require('../config'),
  opn = require('opn'),
  proxyMiddleware = require('http-proxy-middleware'),
  webpackConfig = require('./webpack.dev.conf'),
  cookieParser = require('cookie-parser'),
  bodyParser = require('body-parser'),
  session = require('express-session'),
  passport = require('passport'),
  request = require('request'),
  OAuth2Strategy = require('passport-oauth2'),
  YahooFantasy = require('yahoo-fantasy'),
  APP_KEY = process.env.APP_KEY,
  APP_SECRET = process.env.APP_SECRET,

  app = express(),
  port = process.env.PORT || config.dev.port,
  uri = 'http://localhost:' + port

console.log(' Starting dev server with "' + (process.argv[2] || env.platform.theme).bold + '" theme...')
console.log(' Will listen at ' + uri.bold)
if (config.dev.openBrowser) {
  console.log(' Browser will open when build is ready.\n')
}

var compiler = webpack(webpackConfig)

// Define HTTP proxies to your custom API backend
// https://github.com/chimurai/http-proxy-middleware
var proxyTable = config.dev.proxyTable

var devMiddleware = require('webpack-dev-middleware')(compiler, {
  publicPath: webpackConfig.output.publicPath,
  quiet: true
})

var hotMiddleware = require('webpack-hot-middleware')(compiler, {
  log: function () {}
})

// force page reload when html-webpack-plugin template changes
compiler.plugin('compilation', function (compilation) {
  compilation.plugin('html-webpack-plugin-after-emit', function (data, cb) {
    hotMiddleware.publish({ action: 'reload' })
    cb()
  })
})

passport.serializeUser(function(user, done) {
  done(null, user)
});

passport.deserializeUser(function(obj, done) {
  done(null, obj)
});

passport.use(
  new OAuth2Strategy({
    authorizationURL: 'https://api.login.yahoo.com/oauth2/request_auth',
    tokenURL: 'https://api.login.yahoo.com/oauth2/get_token',
    clientID: APP_KEY,
    clientSecret: APP_SECRET,
    callbackURL: uri + '/auth/yahoo/callback'
  }, function(accessToken, refreshToken, params, profile, done) {
    
    var options = {
      url: 'https://social.yahooapis.com/v1/user/' + params.xoauth_yahoo_guid + '/profile?format=json',
      method: 'get',
      json: true,
      auth: {
        'bearer': accessToken
      }
    }

    request(options, function (error, response, body) {
      if (!error && response.statusCode == 200) {
        var userObj = {
          id: body.profile.guiid,
          name: body.profile.nickname,
          avatar: body.profile.image.imageUrl,
          accessToken: accessToken,
          refreshToken: refreshToken
        }

        app.yf.setUserToken(accessToken)

        return done(null, userObj)
      }
    })
  }
))

app.yf = new YahooFantasy(APP_KEY, APP_SECRET);

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(session({ 
  secret: 'neon slippers',
  resave: false,
  saveUninitialized: true 
}))

app.use(passport.initialize())
app.use(passport.session())

// proxy requests like API. See /config/index.js -> dev.proxyTable
// https://github.com/chimurai/http-proxy-middleware
Object.keys(proxyTable).forEach(function (context) {
  var options = proxyTable[context]
  if (typeof options === 'string') {
    options = { target: options }
  }
  app.use(proxyMiddleware(context, options))
})

// handle fallback for HTML5 history API
app.use(require('connect-history-api-fallback')())

// serve webpack bundle output
app.use(devMiddleware)

// enable hot-reload and state-preserving
// compilation error display
app.use(hotMiddleware)

// serve pure static assets
var staticsPath = path.posix.join(webpackConfig.output.publicPath, 'statics/')
app.use(staticsPath, express.static('./src/statics'))

// try to serve Cordova statics for Play App
app.use(express.static(env.platform.cordovaAssets))

app.get('/userinfo', checkAuth, function(req, res) {
  res.json(req.userObj)
})

app.get('/auth/yahoo',
passport.authenticate('oauth2', { failureRedirect: '/login' }),
function(req, res, user) {
  res.redirect('/')
})

app.get('/auth/yahoo/callback',
passport.authenticate('oauth2', { failureRedirect: '/login' }),
function(req, res) {
  res.redirect(req.session.redirect || '/')
}
)

app.get('/logout', function(req, res){
req.logout()
res.redirect(req.session.redirect || '/')
})

function checkAuth(req, res, next) {
var userObj

if (req.isAuthenticated()) {
  userObj = {
    name: req.user.name,
    avatar: req.user.avatar
  }
} else {
  userObj = null
}

req.userObj = userObj

next()
}

// catch 404 and forward to error handler
app.use(function(req, res, next) {
var err = new Error('Not Found')
err.status = 404
next(err)
})

// error handler
app.use(function(err, req, res, next) {
// set locals, only providing error in development
res.locals.message = err.message
res.locals.error = req.app.get('env') === 'development' ? err : {}

// render the error page
res.status(err.status || 500)
console.log(error.status)
})

module.exports = app.listen(port, function (err) {
  if (err) {
    console.log(err)
    process.exit(1)
  }

  // open browser if set so in /config/index.js
  if (config.dev.openBrowser) {
    devMiddleware.waitUntilValid(function () {
      opn(uri)
    })
  }
})
