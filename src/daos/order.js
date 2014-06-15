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
