var async = require('async'),
    _ = require('lodash'),
    express = require('express'),
    allow = require('../utils/allow'),
    productDao = require('../daos/product'),
    orderDao = require('../daos/order');

var router = express.Router();

router.get('/store', allow.client(), function (req, res, next) {
  productDao.find(function (err, products) {
    if (err) return next(err);
    res.render('store/index', {
      products: products
    });
  });
});

router.get('/store/basket', allow.client(), function (req, res, next) {
  var basket = req.session.basket || {};

  async.waterfall([
    function (cb) {
      var ids = Object.keys(basket);
      if (ids.length) {
        productDao.find({id: ids}, cb);
      } else {
        cb(null, []);
      }
    }
  ], function (err, products) {
    if (err) return next(err);
    products.forEach(function (prod) {
      prod.quantity = Number(basket[prod.id].quantity);
      prod.total_price = (prod.price * prod.quantity).toFixed(2);
    });
    res.render('store/basket', {
      basket: products
    });
  });
});

router.patch('/store/basket', allow.client(), function (req, res, next) {
  var product_id = req.body.product_id,
      quantity = Number(req.body.quantity);

  productDao.get(product_id, function (err, product) {
    if (err) return next(err);

    var basket = req.session.basket || {};

    if (basket[product_id]) {
      quantity += Number(basket[product_id].quantity);
    }

    if (quantity) {
      basket[product_id] = {
        id: product.id,
        price: product.price,
        quantity: quantity
      };
    } else {
      delete basket[product_id];
    }
    req.session.basket = basket;

    res.redirect('/store/basket');
  });
});

router.post('/store/order', allow.client(), function (req, res, next) {
  var basket = req.session.basket || {};
  var order = {
    client_id: req.account.id,
    products: _.values(basket)
  };

  async.waterfall([
    function (cb) {
      orderDao.create(order, cb);
    },
    function (order, cb) {
      async.each(order.products, function (prod, cb) {
        productDao.substractQuantity(prod.id, prod.quantity, cb);
      }, cb);
    }
  ], function (err) {
    if (err) return next(err);
    req.session.basket = {};
    res.redirect('/orders/' + order.id);
  });
});

exports.router = router;
