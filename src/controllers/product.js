var async = require('async'),
    express = require('express'),
    allow = require('../utils/allow'),
    productDao = require('../daos/product'),
    categoryDao  = require('../daos/category');

var router = express.Router();

router.get('/products', allow.worker(), function (req, res, next) {
  productDao.find(function (err, products) {
    if (err) return next(err);
    res.render('products/index', {
      products: products
    });
  });
});

router.get('/products/new', allow.worker(), function (req, res) {
  categoryDao.find(function (err, categories) {
    if (err) return next(err);
    res.render('products/new', {
      categories: categories,
      product: createProduct()
    });
  });
});

router.post('/products', allow.worker(), function (req, res, next) {
  var product = createProduct(req.body),
      errors = validateProduct(product);

  if (errors.length) {
    categoryDao.find(function (err, categories) {
      if (err) return next(err);
      res.render('products/new', {
        categories: categories,
        product: product,
        errors: errors
      });
    });
  } else {
    productDao.create(product, function (err) {
      if (err) return next(err);
      res.redirect('/products');
    });
  }
});

router.get('/products/:id/edit', allow.worker(), function (req, res, next) {
  var id = req.params.id;

  async.waterfall([
    function (cb) {
      categoryDao.find(cb);
    },
    function (categories, cb) {
      res.locals.categories = categories;
      productDao.get(id, cb);
    }
  ], function (err, product) {
    if (err) return next(err);
    if (!product) {
      return res.send(404, 'Product does not exist');
    }
    res.render('products/edit', {
      product: product
    });
  });
});

router.put('/products/:id', allow.worker(), function (req, res, next) {
  var id = req.params.id,
      product = createProduct(req.body, id),
      errors = validateProduct(product);

  if (errors.length) {
    categoryDao.find(function (err, categories) {
      if (err) return next(err);
      res.render('products/edit', {
        categories: categories,
        product: product,
        errors: errors
      });
    });
  } else {
    productDao.update(id, product, function (err) {
      if (err) return next(err);
      res.redirect('/products');
    });
  }
});

router.delete('/products/:id', allow.worker(), function (req, res, next) {
  var id = req.params.id;

  productDao.remove(id, function (err, removed) {
    if (err) return next(err);
    if (!removed) {
      return res.send(404, 'Product does not exist');
    }
    res.redirect('/products');
  });
});

function createProduct(params, id) {
  params = params || {};
  return {
    id: id,
    category_id: params.category_id && +params.category_id || null,
    name: params.name || "",
    description: params.description || "",
    price: params.price && +params.price || null,
    quantity: params.quantity && +params.quantity || null
  };
}

function validateProduct(prod) {
  var errors = [];

  if (!prod.category_id) {
    errors.push("Category is required");
  }
  if (!prod.name) {
    errors.push("Name is required");
  }
  if (prod.name.length > 300) {
    errors.push("Name is too long, maximum is 300 characters");
  }
  if (!prod.description) {
    errors.push("Description is required");
  }
  if (!prod.price) {
    errors.push("Price is required");
  }
  if (prod.price < 0) {
    errors.push("Price should be positive");
  }
  if (!prod.quantity) {
    errors.push("Quantity is required");
  }
  if (prod.quantity < 0) {
    errors.push("Quantity should be positive");
  }

  return errors;
}

exports.router = router;
