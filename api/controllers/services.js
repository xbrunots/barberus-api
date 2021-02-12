module.exports = app => {
  const controller = {};
  const sqlData = app.data.orm;

  controller.select = (req, res) => {
    var table = req.params.table
    var key = req.body

    if (table == undefined) {
      res.status(400).json({ error: "Parametros inválidos!" });
      return
    }

    console.log(req.userEmail)

    sqlData.Select(table, key, function (success, result) {
      if (!success) {
        res.status(400).json({ error: result });
        return
      }
      res.status(200).json(result);
    })
  }

  controller.selectById = (req, res) => {
    var id = req.params.id
    var table = req.params.table

    if (table == undefined) {
      res.status(400).json({ error: "Parametros inválidos!" });
      return
    }

    sqlData.SelectById(table, id, function (success, result) {
      if (!success) {
        res.status(400).json({ error: result });
        return
      }
      res.status(200).json(result);
    })
  }


  controller.insert = (req, res) => {

    var json = req.body
    var table = req.params.table

    if (json == undefined || table == undefined) {
      res.status(400).json({ error: "Parametros inválidos!" });
      return
    }

    sqlData.Insert(table, json, function (success, result) {
      if (!success) {
        res.status(400).json({ error: result });
        return
      }
      res.status(200).json(result);
    })
  }

  controller.update = (req, res) => {
    var json = req.body
    var id = req.params.id
    var table = req.params.table

    if (json == undefined || id == undefined || table == undefined) {
      res.status(400).json({ error: "Parametros inválidos!" });
      return
    }

    sqlData.Update(table, id, json, function (success, result) {
      if (!success) {
        res.status(400).json({ error: result });
        return
      }
      res.status(200).json(result);
    })
  }


  controller.delete = (req, res) => {
    var id = req.params.id
    var table = req.params.table

    if (id == undefined || table == undefined) {
      res.status(400).json({ error: "Parametros inválidos!" });
      return
    }

    sqlData.Delete(table, id, function (success, result) {
      if (!success) {
        res.status(400).json({ error: result });
        return
      }
      res.status(200).json(result);
    })
  }

  return controller;
}