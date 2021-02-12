module.exports = app => {
  const loginCtrl = app.controllers.login;

  app.route('/api/v1/login')
    .post(loginCtrl.auth);

  app.route('/api/v1/register')
    .post(loginCtrl.register);

  app.route('/api/v1/logout')
    .post(loginCtrl.logout)
    .get(loginCtrl.logout);

  app.route('/api/v1/logoff')
    .post(loginCtrl.logout)
    .get(loginCtrl.logout);

}