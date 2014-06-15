var query = require('../utils/query');

exports.create = function (product, cb) {
  var queryString = '' +
    '    INSERT INTO warehouse.product ' +
    '           (category_id, name, description, price, quantity) ' +
    '    VALUES ($1, $2, $3, $4, $5) ' +
    ' RETURNING product_id id ';
  var params = [
    product.category_id,
    product.name,
    product.description,
    product.price,
    product.quantity
  ];
  query(queryString, params, function (err, rows) {
    if (err) return cb(err);
    product.id = rows[0].id;
    cb(null, product);
  });
};

exports.update = function (id, product, cb) {
  var queryString = '' +
    ' UPDATE warehouse.product ' +
    '    SET category_id = $2, name = $3, description = $4, ' +
    '        price = $5, quantity = $6 ' +
    '  WHERE product_id = $1 ';
  var params = [
    product.id,
    product.category_id,
    product.name,
    product.description,
    product.price,
    product.quantity
  ];
  query(queryString, params, function (err, rows) {
    cb(err, product);
  });
};

exports.get = function (id, cb) {
  var queryString = '' +
    ' SELECT product_id id, category_id, name, description, ' +
    '        price, quantity ' +
    '   FROM warehouse.product ' +
    '  WHERE product_id = $1 ';
  query(queryString, [id], function (err, rows) {
    cb(err, rows[0]);
  });
};

exports.find = function (cb) {
  var queryString = '' +
    ' SELECT product_id id, category_id, name, description, ' +
    '        price, quantity ' +
    '   FROM warehouse.product ' +
    '  ORDER BY name ';
  query(queryString, [], function (err, rows) {
    cb(err, rows);
  });
};

exports.remove = function (id, cb) {
  var queryString = '' +
    ' DELETE FROM warehouse.product ' +
    '  WHERE product_id = $1 ';
  query(queryString, [id], function (err, rows, raw) {
    cb(err, raw.rowCount);
  });
};
