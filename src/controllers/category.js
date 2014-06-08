var async = require('async'),
    categoryDao  = require('../daos/category');

exports.index = function (req, res) {
  categoryDao.find(function (err, categories) {
    if (err) {
      return res.send(500, err.toString());
    }
    res.render('categories/index', {
      categories: categories
    });
  });
};

exports.new = function (req, res) {
  res.render('categories/new', {
    category: createCategory()
  });
};

exports.create = function (req, res) {
  var category = createCategory(req.body),
      errors = validateCategory(category);

  if (errors.length) {
    res.render('categories/new', {
      category: category,
      errors: errors
    });
  } else {
    categoryDao.create(category, function (err) {
      if (err) {
        return res.send(500, err.toString());
      }
      res.redirect('/categories');
    });
  }
};

exports.edit = function (req, res) {
  var id = req.params.id;

  categoryDao.get(id, function (err, category) {
    if (err) {
      return res.send(500, err.toString());
    }
    if (!category) {
      res.send(404, 'Category does not exist');
    }
    res.render('categories/edit', {
      category: category
    });
  });
};

exports.update = function (req, res) {
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
      if (err) {
        return res.end(500, err.toString());
      }
      res.redirect('/categories');
    });
  }
};

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
