module.exports = app => {
  const controller = app.controllers.user;

  app.route('/api/v1/login')
    .get(controller.listUsers)
    .post(controller.insertUser);

  app.route('/api/v1/login/:customerId')
    .delete(controller.removeUser)
    .put(controller.updateUser);
}