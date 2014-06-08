exports.index = function (req, res) {
  if (req.account.id) {
    res.render('welcome/index');
  } else {
    res.render('welcome/index-noauth');
  }
};
