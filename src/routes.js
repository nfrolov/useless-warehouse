var controllers = require('./controllers');

module.exports = function (app) {

  app.use(controllers.auth.inject);

  app.get('/conninfo', controllers.utils.conninfo);

  app.get('/', controllers.welcome.index);

  app.get('/signin', controllers.auth.form);
  app.post('/signin', controllers.auth.signin);
  app.get('/signout', controllers.auth.signout);

  app.get('/categories', workerOnly, controllers.category.index);
  app.get('/categories/new', workerOnly, controllers.category.new);
  app.post('/categories', workerOnly, controllers.category.create);
  app.get('/categories/:id/edit', workerOnly, controllers.category.edit);
  app.put('/categories/:id', workerOnly, controllers.category.update);
  app.delete('/categories/:id', workerOnly, controllers.category.destroy);

  app.get('/products', workerOnly, controllers.product.index);
  app.get('/products/new', workerOnly, controllers.product.new);
  app.post('/products', workerOnly, controllers.product.create);
  app.get('/products/:id/edit', workerOnly, controllers.product.edit);
  app.put('/products/:id', workerOnly, controllers.product.update);
  app.delete('/products/:id', workerOnly, controllers.product.destroy);

  app.use(controllers.store.router);
  app.use(controllers.profile.router);
  app.use(controllers.order.router);
  app.use(controllers.invoice.router);

};

function workerOnly(req, res, next) {
  if (req.account.worker) {
    next();
  } else {
    res.send(403, 'Access denied');
    next('route');
  }
}
