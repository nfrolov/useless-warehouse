var query = require('../utils/query');

exports.find = function (cb) {
  var queryString = '' +
    ' SELECT category_id id, name ' +
    '   FROM warehouse.category ' +
    '  ORDER BY name ';
  query(queryString, [], function (err, rows) {
    cb(err, rows);
  });
};
