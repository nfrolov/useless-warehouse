function worker() {
  return allow().worker();
}

function client() {
  return allow().client();
}

function allow() {
  var checks = [];
  var middleware = function (req, res, next) {
    var granted = false;
    for (var i in checks) {
      if (checks[i](req, res) === true) {
        granted = true;
        break;
      }
    }
    if (!granted) {
      return res.send(403, 'Access denied');
    }
    next();
  };

  middleware.client = function () {
    checks.push(function (req, res) {
      return !!(req.account && req.account.client);
    });
    return middleware;
  };

  middleware.worker = function () {
    checks.push(function (req, res) {
      return !!(req.account && req.account.worker);
    });
    return middleware;
  };

  middleware.and = function (cb) {
    checks.push(cb);
    return middleware;
  };

  return middleware;
}

exports.worker = worker;
exports.client = client;
