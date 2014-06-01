var query = require('../utils/query');

exports.findByUsername = function (username, cb) {
  var queryString = '' +
    '    SELECT a.username, a.password, ' +
    '           a.account_id, c.client_id, w.worker_id ' +
    '      FROM warehouse.account a ' +
    ' LEFT JOIN warehouse.client c ON c.client_id = a.account_id ' +
    ' LEFT JOIN warehouse.worker w ON w.worker_id = a.account_id ' +
    '     WHERE a.username = $1 ';
  query(queryString, [username], function (err, result) {
    if (err) return cb(err);
    var account = result && result[0];
    cb(null, account);
  });
};

