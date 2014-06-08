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
