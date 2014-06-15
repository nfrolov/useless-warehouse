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
    ' SELECT order_id id, client_id, ' +
    '        created_at, sent_at, shipped_at, ' +
    '        note ' +
    '   FROM warehouse.order ' +
    '  WHERE order_id = $1 ';
  var selectOrderProductsQuery = '' +
    ' SELECT op.product_id id, op.price, op.quantity, ' +
    '        p.name ' +
    '   FROM warehouse.order_product op ' +
    '   JOIN warehouse.product p ON (p.product_id = op.product_id) ' +
    '  WHERE order_id = $1 ';
  var order;

  async.waterfall([
    function (cb) {
      query(selectOrderQuery, [id], cb);
    },
    function (rows, raw, cb) {
      order = rows[0];
      query(selectOrderProductsQuery, [order.id], cb);
    },
    function (rows, raw, cb) {
      order.products = rows;
      cb();
    }
  ], function (err) {
    cb(err, order);
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
  query(queryString, [id], cb);
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
