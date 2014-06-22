var async = require('async'),
    express = require('express'),
    allow = require('../utils/allow'),
    orderDao = require('../daos/order'),
    invoiceDao = require('../daos/invoice');

var router = express.Router();

router.get('/profile/orders', allow.client(), function (req, res, next) {
  var id = req.account.id;
  orderDao.find({client_id: id}, function (err, orders) {
    res.render('profile/orders', {
      orders: orders
    });
  });
});

router.get('/profile/invoices', allow.client(), function (req, res, next) {
  var id = req.account.id;
  invoiceDao.findByClient(id, function (err, invoices) {
    if (err) return next(err);
    res.render('profile/invoices', {
      invoices: invoices
    });
  });
});

exports.router = router;
