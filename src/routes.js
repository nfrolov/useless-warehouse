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

};

function workerOnly(req, res, next) {
  if (req.account.worker) {
    next();
  } else {
    res.send(403, 'Access denied');
    next('route');
  }
}
