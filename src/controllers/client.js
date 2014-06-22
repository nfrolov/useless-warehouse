var async = require('async'),
    express = require('express'),
    moment = require('moment'),
    bcrypt = require('bcrypt'),
    clientDao = require('../daos/client');

var router = express.Router();

router.get('/clients', workerOnly, function (req, res, next) {
  clientDao.findAll(function (err, clients) {
    if (err) return next(err);
    res.render('clients/index', {
      clients: clients
    });
  });
});

router.get('/clients/:id/edit', workerOnly, function (req, res, next) {
  var id = req.params.id;
  clientDao.get(id, function (err, client) {
    if (err) return next(err);
    if (!client) {
      return res.send(404, 'Client does not exist');
    }
    res.render('clients/edit', {
      client: client
    });
  });
});

router.put('/clients/:id', workerOnly, function (req, res, next) {
  var id = req.params.id,
      client = createClient(req.body, id),
      errors = validateClient(client);

  if (errors.length) {
    res.render('clients/edit', {
      client: client,
      errors: errors
    });
  } else {
    async.waterfall([
      function (cb) {
        if (!client.password) {
          return cb(null, null);
        }
        bcrypt.hash(client.password, 8, cb);
      },
      function (hash, cb) {
        client.password = hash;
        clientDao.update(id, client, cb);
      }
    ], function (err, hash) {
      if (err) return next(err);
      res.redirect('/clients');
    });
  }
});

function createClient(params, id) {
  params = params || {};
  return {
    id: id,
    username: params.username || "",
    password: params.password || null,
    name: params.name || "",
    credit_limit: params.credit_limit && +params.credit_limit || null
  };
}

function validateClient(client) {
  var errors = [];

  if (!client.username) {
    errors.push("Username is required");
  }
  if (!client.name) {
    errors.push("Name is required");
  }

  return errors;
}

function workerOnly(req, res, next) {
  if (req.account && req.account.worker) {
    return next();
  }
  res.send(403, 'Access denied');
}

exports.router = router;
