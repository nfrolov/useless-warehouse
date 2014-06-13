var express = require('express'),
    morgan = require('morgan'),
    app = express(),
    cookieParser = require('cookie-parser'),
    cookieSession = require('cookie-session'),
    bodyParser = require('body-parser'),
    methodOverride = require('method-override'),
    routes = require('./routes');

app.enable('trust proxy');
app.enable('case sensitive routing');
app.enable('strict routing');

app.set('views', __dirname + '/views');
app.set('view engine', 'jade');

app.use(morgan('short'));
app.use(cookieParser());
app.use(cookieSession({secret: process.env.COOKIE_SECRET}));
app.use(bodyParser());
app.use(methodOverride(function (req, res) {
  if (req.body && typeof req.body === 'object' && req.body._method) {
    var method = req.body._method;
    delete req.body._method;
    return method;
  }
}));
app.use(express.static(__dirname + '/../public'));

routes(app);

app.use(function (err, req, res, next) {
  res.status(500).render('error/internal', {error: err});
});

app.listen(process.env.PORT || 5000);
