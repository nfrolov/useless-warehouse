var express = require('express'),
    morgan = require('morgan'),
    app = express(),
    cookieParser = require('cookie-parser'),
    cookieSession = require('cookie-session'),
    bodyParser = require('body-parser'),
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
app.use(express.static(__dirname + '/../public'));

routes(app);

app.listen(process.env.PORT || 5000);
