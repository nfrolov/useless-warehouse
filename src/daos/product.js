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

exports.find = function (conditions, cb) {
  if ('function' === typeof conditions) {
    cb = conditions;
    conditions = {};
  }

  var params = [];
  var queryString = '' +
    ' SELECT product_id id, category_id, name, description, ' +
    '        price, quantity ' +
    '   FROM warehouse.product ';

  queryString += buildWhere(conditions, params);
  queryString += ' ORDER BY name ';

  query(queryString, params, function (err, rows) {
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

exports.substractQuantity = function (id, amount, cb) {
  var queryString = '' +
    '    UPDATE warehouse.product ' +
    '       SET quantity = quantity - $2 ' +
    '     WHERE product_id = $1 ' +
    ' RETURNING quantity ';
  query(queryString, [id, amount], function (err, rows, raw) {
    if (err) return cb(err);
    var quantity = rows[0] && rows[0].quantity;
    cb(err, quantity);
  });
};

// FIXME extract
function buildWhere (conditions, params) {
  var where = [], field, value;

  for (field in conditions) {
    value = conditions[field];
    if ('id' === field) {
      field = 'product_id';
    }
    if (Array.isArray(value)) {
      where.push(field + ' IN (' + value.map(Number).join(', ') + ')');
    } else {
      where.push(field + ' = $' + (params.length + 1));
      params.push(value);
    }
  }

  if (where.length) {
    return ' WHERE ' + where.join(' AND ');
  }

  return '';
}
