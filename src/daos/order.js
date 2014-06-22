var async = require('async'),
    query = require('../utils/query');

exports.create = function (order, cb) {
  var insertOrderQuery = '' +
    '    INSERT INTO warehouse.order (client_id) ' +
    '    VALUES ($1) ' +
    ' RETURNING order_id id, created_at ';
  var insertOrderProductQuery = '' +
    '    INSERT INTO warehouse.order_product ' +
    '           (order_id, product_id, quantity, price) ' +
    '    VALUES ($1, $2, $3, $4) ';

  async.waterfall([
    function (cb) {
      query(insertOrderQuery, [order.client_id], cb);
    },
    function (rows, raw, cb) {
      order.id = rows[0].id;
      order.created_at = rows[0].created_at;
      async.each(order.products, function (product, cb) {
        query(insertOrderProductQuery, [
          order.id,
          product.id,
          product.quantity,
          product.price
        ], cb);
      }, cb);
    }
  ], function (err) {
    cb(err, order);
  });
};

exports.get = function (id, cb) {
  var selectOrderQuery = '' +
    ' SELECT o.order_id id, o.client_id, ' +
    '        o.created_at, o.sent_at, o.shipped_at, ' +
    '        o.note, ' +
    '        ( SELECT SUM(op.price * op.quantity) ' +
    '            FROM warehouse.order_product op ' +
    '           WHERE op.order_id = o.order_id ) total_price ' +
    '   FROM warehouse.order o ' +
    '  WHERE o.order_id = $1 ';
  var selectOrderProductsQuery = '' +
    ' SELECT op.product_id id, op.price, op.quantity, ' +
    '        p.name, op.price * op.quantity total_price ' +
    '   FROM warehouse.order_product op ' +
    '   JOIN warehouse.product p ON (p.product_id = op.product_id) ' +
    '  WHERE op.order_id = $1 ';

  query(selectOrderQuery, [id], function (err, rows) {
    if (err) return cb(err);
    if (!rows[0]) return cb();

    var order = rows[0];

    query(selectOrderProductsQuery, [order.id], function (err, rows) {
      if (err) return cb(err);
      order.products = rows || [];
      cb(null, order);
    });
  });
};

exports.find = function (conditions, cb) {
  if ('function' === typeof conditions) {
    cb = conditions;
    conditions = {};
  }

  var params = [];
  var queryString = '' +
    ' SELECT order_id id, client_id, ' +
    '        created_at, sent_at, shipped_at, ' +
    '        note ' +
    '   FROM warehouse.order ';

  queryString += buildWhere(conditions, params);
  queryString += ' ORDER BY created_at DESC ';

  query(queryString, params, function (err, rows) {
    cb(err, rows);
  });
};

exports.ship = function (id, cb) {
  var queryString = '' +
    ' UPDATE warehouse.order ' +
    '    SET shipped_at = now() ' +
    '  WHERE shipped_at IS NULL ' +
    '    AND order_id = $1 ';
  query(queryString, [id], function (err, rows, raw) {
    var shipped = raw.rowCount > 0;
    cb(err, shipped);
  });
};

function buildWhere(conditions, params) {
  var where = [], field;

  for (field in conditions) {
    where.push(field + ' = $' + (params.length + 1));
    params.push(conditions[field]);
  }

  if (where.length) {
    return ' WHERE ' + where.join(' AND ');
  }

  return '';
}
