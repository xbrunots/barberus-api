
module.exports = app => {

  const controller = app.controllers.querys;


  app.route('/api/v1/financials')
    .get(controller.getFinancials)
    .post(controller.getFinancials)
  app.route('/api/v1/financials/:start')
    .get(controller.getFinancials)
    .post(controller.getFinancials)


  app.route('/api/v1/calendars')
    .get(controller.listCalendar)
    .post(controller.listCalendar)
  app.route('/api/v1/calendars/:start')
    .get(controller.listCalendar)
    .post(controller.listCalendar)


  app.route('/api/v1/cart_items/:id')
    .get(controller.openCalendar)
    .post(controller.openCalendar)


  app.route('/api/v1/clients')
    .get(controller.listClients)
    .post(controller.insertClient)
  app.route('/api/v1/clients/:id')
    .get(controller.openClient)
    .post(controller.openClient)

  app.route('/api/v1/products/:filterId')
    .get(controller.getProducts)
  app.route('/api/v1/products')
    .get(controller.getProducts)
    .post(controller.setProducts)
  // .put(controller.setProducts)

  app.route('/api/v1/update/:table')
    .post(controller.changeAnyData)


  app.route('/api/v1/users')
    .post(controller.insertUser)

}