var express = require('express'),
    morgan = require('morgan'),
    app = express();

app.use(morgan('short'));
app.use(express.static(__dirname + '/public'));

app.listen(process.env.PORT || 5000);
