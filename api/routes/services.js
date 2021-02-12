
module.exports = app => {

  const controller = app.controllers.services;

  app.route('/api/orm/:table/:id')
    .get(controller.selectById)

  app.route('/api/orm/:table')
    .post(controller.insert)
    .get(controller.select)

  app.route('/api/orm/:table/:id')
    .put(controller.update)

  app.route('/api/orm/:table/:id')
    .delete(controller.delete)
}