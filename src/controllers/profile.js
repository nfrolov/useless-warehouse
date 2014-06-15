var async = require('async'),
    express = require('express'),
    orderDao = require('../daos/order');

var router = express.Router();

router.get('/profile/orders', clientOnly, function (req, res, next) {
  var id = req.account.id;
  orderDao.find({client_id: id}, function (err, orders) {
    res.render('profile/orders', {
      orders: orders
    });
  });
});

function clientOnly(req, res, next) {
  var cid = req.params.cid;
  if (req.account && req.account.client) {
    return next();
  }
  res.send(403, 'Access denied');
}

exports.router = router;
