module.exports = app => {
  const controller = app.controllers.customerWallets;

  app.route('/v1/login')
    .get(controller.listCustomerWallets)
    .post(controller.saveCustomerWallets);

  app.route('/v1/login/:customerId')
    .delete(controller.removeCustomerWallets)
    .put(controller.updateCustomerWallets);
}