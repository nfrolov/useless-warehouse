var controllers = require('./controllers');

module.exports = function (app) {

  app.get('/conninfo', controllers.utils.conninfo);

};
