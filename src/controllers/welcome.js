var express = require('express');

var router = express.Router();

router.get('/', function (req, res) {
  if (req.account.id) {
    res.render('welcome/index');
  } else {
    res.render('welcome/index-noauth');
  }
});

exports.router = router;
