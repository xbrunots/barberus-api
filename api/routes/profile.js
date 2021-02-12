module.exports = app => {
  const controller = app.controllers.profile;
  app.route('/api/v1/profile')
    .get(controller.selectProfile)
    .post(controller.selectProfile)
    .put(controller.updateProfile)
}