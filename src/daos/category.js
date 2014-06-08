var query = require('../utils/query');

exports.create = function (category, cb) {
  var queryString = '' +
    '    INSERT INTO warehouse.category (name) ' +
    '    VALUES ($1) ' +
    ' RETURNING category_id id ';
  query(queryString, [category.name], function (err, rows) {
    if (err) return cb(err);
    category.id = rows[0].id;
    cb(null, category);
  });
};

exports.update = function (id, category, cb) {
  var queryString = '' +
    ' UPDATE warehouse.category ' +
    '    SET name = $2 ' +
    '  WHERE category_id = $1 ';
  query(queryString, [id, category.name], function (err, rows) {
    cb(err, category);
  });
};

exports.get = function (id, cb) {
  var queryString = '' +
    ' SELECT category_id id, name ' +
    '   FROM warehouse.category ' +
    '  WHERE category_id = $1 ';
  query(queryString, [id], function (err, rows) {
    cb(err, rows[0]);
  });
};

exports.find = function (cb) {
  var queryString = '' +
    ' SELECT category_id id, name ' +
    '   FROM warehouse.category ' +
    '  ORDER BY name ';
  query(queryString, [], function (err, rows) {
    cb(err, rows);
  });
};

exports.remove = function (id, cb) {
  var queryString = '' +
    ' DELETE FROM warehouse.category ' +
    '  WHERE category_id = $1 ';
  query(queryString, [id], function (err, rows, raw) {
    cb(err, raw.rowCount);
  });
};
