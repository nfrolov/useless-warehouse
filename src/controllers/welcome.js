exports.index = function (req, res) {
  if (req.session.account_id) {
    res.render('welcome/index', {
      username: req.session.username
    });
  } else {
    res.render('welcome/index-noauth');
  }
};
