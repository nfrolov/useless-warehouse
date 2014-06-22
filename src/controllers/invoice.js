var async = require('async'),
    express = require('express'),
    invoiceDao = require('../daos/invoice');

var router = express.Router();

router.get('/invoices', workerOnly, function (req, res, next) {
  invoiceDao.findAll(function (err, invoices) {
    if (err) return next(err);
    res.render('invoices/index', {
      invoices: invoices
    });
  });
});

router.post('/invoices/:id/paid', workerOnly, function (req, res, next) {
  invoiceDao.markPaid(req.params.id, function (err, marked) {
    if (err) return next(err);
    res.redirect('/invoices');
  });
});

function workerOnly(req, res, next) {
  if (req.account && req.account.worker) {
    return next();
  }
  res.send(403, 'Access denied');
}

exports.router = router;
