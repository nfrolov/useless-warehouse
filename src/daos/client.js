var async = require('async'),
    query = require('../utils/query');

exports.get = function (id, cb) {
  var queryString = '' +
    ' SELECT c.client_id id, c.name, c.credit_limit, ' +
    '        a.username, a.password ' +
    '   FROM warehouse.client c ' +
    '   JOIN warehouse.account a ON (a.account_id = c.client_id) ' +
    '  WHERE client_id = $1 ';
  query(queryString, [id], function (err, rows) {
    cb(err, rows[0]);
  });
};

exports.findAll = function (cb) {
  var queryString = '' +
    ' SELECT c.client_id id, c.name, c.credit_limit, ' +
    '        a.username, a.password ' +
    '   FROM warehouse.client c ' +
    '   JOIN warehouse.account a ON (a.account_id = c.client_id) ' +
    '  ORDER BY a.username ';

  query(queryString, [], function (err, rows) {
    cb(err, rows);
  });
};

exports.update = function (id, client, cb) {
  var updateAccountQuery = '' +
    ' UPDATE warehouse.account ' +
    '    SET username = $2, password = coalesce($3, password) ' +
    '  WHERE account_id = ( SELECT client_id ' +
    '                         FROM warehouse.client ' +
    '                        WHERE client_id = $1 ) ';
  var updateClientQuery = '' +
    ' UPDATE warehouse.client ' +
    '    SET name = $2, credit_limit = $3 ' +
    '  WHERE client_id = $1 ';

  async.waterfall([
    function (cb) {
      var params = [id, client.username, client.password];
      query(updateAccountQuery, params, cb);
    },
    function (rows, raw, cb) {
      var params = [id, client.name, client.credit_limit];
      query(updateClientQuery, params, cb);
    }
  ], function (err) {
    cb(err, client);
  });
};
