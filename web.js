var express = require('express'),
    morgan = require('morgan'),
    static = require('serve-static'),
    app = express();

app.use(morgan('short'));
app.use(static(__dirname + '/public'));

app.listen(process.env.PORT || 5000);
