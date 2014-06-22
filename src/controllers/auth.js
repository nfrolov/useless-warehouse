var async = require('async'),
    express = require('express');
    accountDao = require('../daos/account'),
    bcrypt = require('bcrypt');

exports.inject = function (req, res, next) {
  req.account = res.locals.account = {
    id: req.session.account_id,
    username: req.session.username,
    worker: 'worker' === req.session.role,
    client: 'client' === req.session.role
  };
  next();
};

var router = express.Router();

router.get('/signin', function (req, res) {
  res.render('auth/signin');
});

router.post('/signin', function (req, res, next) {
  var username = req.body.username,
      password = req.body.password;

  async.waterfall([
    function (cb) {
      accountDao.findByUsername(username, cb);
    },
    function (account, cb) {
      if (!account) {
        return cb(null, false);
      }
      bcrypt.compare(password, account.password, function (err, matches) {
        if (err) return cb(err);
        cb(null, matches, account);
      });
    }
  ], function (err, matches, account) {
    if (err) return next(err);
    if (matches) {
      req.session.account_id = account.account_id;
      req.session.role = account.worker_id === null ? 'client' : 'worker';
      req.session.username = account.username;
      res.redirect('/');
    } else {
      res.render('auth/signin', {
        message: 'Wrong password or username'
      });
    }
  });
});

router.get('/signout', function (req, res) {
  req.session = null;
  res.redirect('/');
});

exports.router = router;
