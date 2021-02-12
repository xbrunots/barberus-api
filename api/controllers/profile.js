
module.exports = app => {
  const controller = {};
  const sqlData = app.data.sql;

  controller.selectProfile = (req, res) => {

    sqlData.SelectProfile(req.userId, function (success, result) {
      if (!success) {
        res.status(400).json({ error: result });
        return
      }

      res.status(200).json(result);

    })
  }

  controller.updateProfile = (req, res) => {

    sqlData.UpdateProfile(req.userId, req.body, function (success, result) {
      if (!success) {
        res.status(400).json({ error: result });
        return
      }

      res.status(200).json(result);

    })

  }

  return controller;
}