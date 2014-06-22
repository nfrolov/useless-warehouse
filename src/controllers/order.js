var async = require('async'),
    express = require('express'),
    moment = require('moment'),
    allow = require('../utils/allow'),
    productDao = require('../daos/product'),
    orderDao  = require('../daos/order'),
    invoiceDao = require('../daos/invoice');

var router = express.Router();

router.get('/orders', allow.worker(), function (req, res, next) {
  orderDao.find(function (err, orders) {
    if (err) return next(err);
    res.render('orders/index', {
      orders: orders
    });
  });
});

router.param('id', function (req, res, next, id) {
  orderDao.get(id, function (err, order) {
    if (err) return next(err);
    if (!order) {
      return res.send(404, 'Order does not exist');
    }
    req.order = order;
    next();
  });
});

router.post('/orders/:id/ship', allow.worker(), function (req, res, next) {
  var order = req.order;

  async.waterfall([
    function (cb) {
      orderDao.ship(order.id, cb);
    },
    function (shipped, cb) {
      if (!shipped) return cb();
      var invoice = newInvoiceForOrder(order);
      invoiceDao.create(invoice, cb);
    }
  ], function (err) {
    if (err) return next(err);
    res.redirect('/orders');
  });
});

router.get('/orders/:id', allow.worker().and(owner), function (req, res, next) {
  res.render('orders/view', {
    order: req.order
  });
});

function owner(req, res) {
  return req.account && req.account.id === req.order.client_id;
}

function newInvoiceForOrder(order) {
  return {
    order_id: order.id,
    due_date: moment().add('days', 7).toDate(),
    amount: order.total_price
  };
}

exports.router = router;
