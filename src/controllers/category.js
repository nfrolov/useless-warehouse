var async = require('async'),
    express = require('express'),
    allow = require('../utils/allow'),
    categoryDao  = require('../daos/category');

var router = express.Router();

router.get('/categories', allow.worker(), function (req, res, next) {
  categoryDao.find(function (err, categories) {
    if (err) return next(err);
    res.render('categories/index', {
      categories: categories
    });
  });
});

router.get('/categories/new', allow.worker(), function (req, res) {
  res.render('categories/new', {
    category: createCategory()
  });
});

router.post('/categories', allow.worker(), function (req, res, next) {
  var category = createCategory(req.body),
      errors = validateCategory(category);

  if (errors.length) {
    res.render('categories/new', {
      category: category,
      errors: errors
    });
  } else {
    categoryDao.create(category, function (err) {
      if (err) return next(err);
      res.redirect('/categories');
    });
  }
});

router.get('/categories/:id/edit', allow.worker(), function (req, res, next) {
  var id = req.params.id;

  categoryDao.get(id, function (err, category) {
    if (err) return next(err);
    if (!category) {
      return res.send(404, 'Category does not exist');
    }
    res.render('categories/edit', {
      category: category
    });
  });
});

router.put('/categories/:id', allow.worker(), function (req, res, next) {
  var id = req.params.id,
      category = createCategory(req.body, id),
      errors = validateCategory(category);

  if (errors.length) {
    res.render('categories/edit', {
      category: category,
      errors: errors
    });
  } else {
    categoryDao.update(id, category, function (err) {
      if (err) return next(err);
      res.redirect('/categories');
    });
  }
});

router.delete('/categories/:id', allow.worker(), function (req, res, next) {
  var id = req.params.id;

  categoryDao.remove(id, function (err, removed) {
    if (err) return next(err);
    if (!removed) {
      return res.send(404, 'Category does not exist');
    }
    res.redirect('/categories');
  });
});

function createCategory(params, id) {
  params = params || {};
  return {
    id: id,
    name: params.name || ""
  };
}

function validateCategory(cat) {
  var errors = [];

  if (cat.name.length === 0) {
    errors.push("Name is required");
  }
  if (cat.name.length > 200) {
    errors.push("Name is too long, maximum is 200 characters");
  }

  return errors;
}

exports.router = router;
