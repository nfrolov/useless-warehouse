var async = require('async'),
    query = require('../utils/query');

exports.create = function (invoice, cb) {
  var queryString = '' +
    '    INSERT INTO warehouse.invoice (order_id, amount, due_date) ' +
    '    VALUES ($1, $2, $3) ' +
    ' RETURNING invoice_id id, created_at ';
  var params = [
    invoice.order_id,
    invoice.amount,
    invoice.due_date
  ];

  query(queryString, params, function (err, rows) {
    if (err) return cb(err);
    invoice.id = rows[0].id;
    invoice.created_at = rows[0].created_at;
    cb(null, invoice);
  });
};

exports.findByClient = function (client_id, cb) {
  var queryString = '' +
    ' SELECT i.invoice_id id, i.order_id, o.client_id, ' +
    '        i.amount, i.due_date, ' +
    '        i.created_at, i.paid_at, ' +
    '        (i.paid_at IS NULL AND i.due_date < now()) overdue ' +
    '   FROM warehouse.invoice i ' +
    '   JOIN warehouse.order o ON (o.order_id = i.order_id) ' +
    '  WHERE o.client_id = $1 ' +
    '  ORDER BY i.due_date DESC ';

  query(queryString, [client_id], function (err, rows) {
    cb(err, rows);
  });
};

exports.findAll = function (cb) {
  var queryString = '' +
    ' SELECT i.invoice_id id, i.order_id, o.client_id, ' +
    '        i.amount, i.due_date, ' +
    '        i.created_at, i.paid_at, ' +
    '        (i.paid_at IS NULL AND i.due_date < now()) overdue ' +
    '   FROM warehouse.invoice i ' +
    '   JOIN warehouse.order o ON (o.order_id = i.order_id) ' +
    '  ORDER BY i.due_date DESC ';

  query(queryString, [], function (err, rows) {
    cb(err, rows);
  });
};

exports.markPaid = function (id, cb) {
  var queryString = '' +
    ' UPDATE warehouse.invoice ' +
    '    SET paid_at = now() ' +
    '  WHERE paid_at IS NULL AND invoice_id = $1 ';

  query(queryString, [id], function (err, rows, raw) {
    cb(err, raw && raw.rowCount);
  });
};
