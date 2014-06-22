var async = require('async'),
    express = require('express'),
    moment = require('moment'),
    bcrypt = require('bcrypt'),
    workerDao = require('../daos/worker');

var router = express.Router();

router.get('/workers', workerOnly, function (req, res, next) {
  workerDao.findAll(function (err, workers) {
    if (err) return next(err);
    res.render('workers/index', {
      workers: workers
    });
  });
});

router.get('/workers/:id/edit', workerOnly, function (req, res, next) {
  var id = req.params.id;
  workerDao.get(id, function (err, worker) {
    if (err) return next(err);
    if (!worker) {
      return res.send(404, 'Worker does not exist');
    }
    res.render('workers/edit', {
      worker: worker
    });
  });
});

router.put('/workers/:id', workerOnly, function (req, res, next) {
  var id = req.params.id,
      worker = createWorker(req.body, id),
      errors = validateWorker(worker);

  if (errors.length) {
    res.render('workers/edit', {
      worker: worker,
      errors: errors
    });
  } else {
    async.waterfall([
      function (cb) {
        if (!worker.password) {
          return cb(null, null);
        }
        bcrypt.hash(worker.password, 8, cb);
      },
      function (hash, cb) {
        worker.password = hash;
        workerDao.update(id, worker, cb);
      }
    ], function (err, hash) {
      if (err) return next(err);
      res.redirect('/workers');
    });
  }
});

function createWorker(params, id) {
  params = params || {};
  return {
    id: id,
    username: params.username || "",
    password: params.password || null,
    name: params.name || ""
  };
}

function validateWorker(worker) {
  var errors = [];

  if (!worker.username) {
    errors.push("Username is required");
  }
  if (!worker.name) {
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
