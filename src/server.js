var express = require('express'),
    morgan = require('morgan'),
    app = express(),
    routes = require('./routes');

app.enable('trust proxy');
app.enable('case sensitive routing');
app.enable('strict routing');

app.set('views', __dirname + '/views');
app.set('view engine', 'jade');

app.use(morgan('short'));
app.use(express.static(__dirname + '/../public'));

routes(app);

app.listen(process.env.PORT || 5000);
