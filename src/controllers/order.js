var async = require('async'),
    express = require('express'),
    productDao = require('../daos/product'),
    orderDao  = require('../daos/order');

var router = express.Router();

router.get('/orders', workerOnly, function (req, res, next) {
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

router.post('/orders/:id/ship', workerOnly, function (req, res, next) {
  orderDao.ship(req.order.id, function (err) {
    if (err) return next(err);
    res.redirect('/orders');
  });
});

router.get('/orders/:id', ownerOrWorker, function (req, res, next) {
  var order = req.order;

  order.products.forEach(function (prod) {
    prod.total_price = (prod.quantity * prod.price).toFixed(2);
  });
  order.total_price = order.products.reduce(function (acc, prod) {
    return acc + Number(prod.total_price);
  }, 0).toFixed(2);

  res.render('orders/view', {
    order: order
  });
});

function workerOnly(req, res, next) {
  if (req.account && req.account.worker) {
    return next();
  }
  res.send(403, 'Access denied');
}

function ownerOrWorker(req, res, next) {
  var acc = req.account;
  if (acc && (acc.worker || acc.id === req.order.client_id)) {
    return next();
  }
  res.send(403, 'Access denied');
}

exports.router = router;
