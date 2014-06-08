var controllers = require('./controllers');

module.exports = function (app) {

  app.use(controllers.auth.inject);

  app.get('/conninfo', controllers.utils.conninfo);

  app.get('/', controllers.welcome.index);

  app.get('/signin', controllers.auth.form);
  app.post('/signin', controllers.auth.signin);
  app.get('/signout', controllers.auth.signout);

  app.get('/categories', controllers.category.index);
  app.get('/categories/new', controllers.category.new);
  app.post('/categories', controllers.category.create);
  app.get('/categories/:id/edit', controllers.category.edit);
  app.put('/categories/:id', controllers.category.update);

};
