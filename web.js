var express = require('express'),
    morgan = require('morgan'),
    app = express();

app.enable('case sensitive routing');
app.enable('strict routing');

app.use(morgan('short'));
app.use(express.static(__dirname + '/public'));

app.listen(process.env.PORT || 5000);
