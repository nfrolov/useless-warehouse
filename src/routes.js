var controllers = require('./controllers');

module.exports = function (app) {

  app.use(controllers.auth.inject);

  app.use(controllers.utils.router);
  app.use(controllers.welcome.router);
  app.use(controllers.auth.router);
  app.use(controllers.category.router);
  app.use(controllers.product.router);
  app.use(controllers.store.router);
  app.use(controllers.profile.router);
  app.use(controllers.order.router);
  app.use(controllers.invoice.router);
  app.use(controllers.client.router);
  app.use(controllers.worker.router);

};
