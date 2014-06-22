var async = require('async'),
    express = require('express'),
    allow = require('../utils/allow'),
    invoiceDao = require('../daos/invoice');

var router = express.Router();

router.get('/invoices', allow.worker(), function (req, res, next) {
  invoiceDao.findAll(function (err, invoices) {
    if (err) return next(err);
    res.render('invoices/index', {
      invoices: invoices
    });
  });
});

router.post('/invoices/:id/paid', allow.worker(), function (req, res, next) {
  invoiceDao.markPaid(req.params.id, function (err, marked) {
    if (err) return next(err);
    res.redirect('/invoices');
  });
});

exports.router = router;
