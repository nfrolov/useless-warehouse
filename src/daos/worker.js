var async = require('async'),
    query = require('../utils/query');

exports.get = function (id, cb) {
  var queryString = '' +
    ' SELECT w.worker_id id, w.name, ' +
    '        a.username, a.password ' +
    '   FROM warehouse.worker w ' +
    '   JOIN warehouse.account a ON (a.account_id = w.worker_id) ' +
    '  WHERE worker_id = $1 ';
  query(queryString, [id], function (err, rows) {
    cb(err, rows[0]);
  });
};

exports.findAll = function (cb) {
  var queryString = '' +
    ' SELECT w.worker_id id, w.name, ' +
    '        a.username, a.password ' +
    '   FROM warehouse.worker w ' +
    '   JOIN warehouse.account a ON (a.account_id = w.worker_id) ' +
    '  ORDER BY a.username ';

  query(queryString, [], function (err, rows) {
    cb(err, rows);
  });
};

exports.update = function (id, worker, cb) {
  var updateAccountQuery = '' +
    ' UPDATE warehouse.account ' +
    '    SET username = $2, password = coalesce($3, password) ' +
    '  WHERE account_id = ( SELECT worker_id ' +
    '                         FROM warehouse.worker ' +
    '                        WHERE worker_id = $1 ) ';
  var updateWorkerQuery = '' +
    ' UPDATE warehouse.worker ' +
    '    SET name = $2 ' +
    '  WHERE worker_id = $1 ';

  async.waterfall([
    function (cb) {
      var params = [id, worker.username, worker.password];
      query(updateAccountQuery, params, cb);
    },
    function (rows, raw, cb) {
      var params = [id, worker.name];
      query(updateWorkerQuery, params, cb);
    }
  ], function (err) {
    cb(err, worker);
  });
};
