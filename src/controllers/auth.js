var async = require('async'),
    express = require('express'),
    accountDao = require('../daos/account'),
    clientDao = require('../daos/client'),
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

router.get('/signup', function (req, res) {
  res.render('auth/signup', {
    client: createClient()
  });
});

router.post('/signup', function (req, res, next) {
  var client = createClient(req.body),
      errors = validateClient(client);

  if (errors.length) {
    res.render('auth/signup', {
      client: client,
      errors: errors
    });
  } else {
    async.waterfall([
      function (cb) {
        bcrypt.hash(client.password, 8, cb);
      },
      function (hash, cb) {
        client.password = hash;
        clientDao.create(client, cb);
      }
    ], function (err) {
      if (err) return next(err);
      res.redirect('/signin');
    });
  }
});

function createClient(params) {
  params = params || {};
  return {
    name: params.name || '',
    username: params.username || '',
    password: params.password || ''
  };
}

function validateClient(client) {
  var errors = [];

  if (!client.name) {
    errors.push("Name is required");
  }
  if (!client.username) {
    errors.push("Username is required");
  }
  if (!client.password) {
    errors.push("Password is required");
  }

  return errors;
}

exports.router = router;
