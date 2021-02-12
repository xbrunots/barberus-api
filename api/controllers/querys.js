module.exports = app => {
  const controller = {};
  const sqlData = app.data.sql;

  controller.listCalendar = (req, res) => {
    var id = req.userId
    var start = req.params.start

    if (id == undefined) {
      res.status(400).json({ error: "Parametros inválidos!" });
      return
    }

    if (start == undefined) {
      start = ""
    }


    sqlData.ListCalendar(id, start, function (success, result) {
      if (!success) {
        res.status(400).json({ error: result });
        return
      }

      const sum = result.reduce((a, { price }) => a + price, 0);

      var resultData = {
        infos: {
          rows: result.length,
          moneyTotal: sum
        },
        data: result
      }

      res.status(200).json(resultData);
    })
  }


  controller.getProducts = (req, res) => {
    var id = req.userId

    if (id == undefined) {
      res.status(400).json({ error: "Parametros inválidos!" });
      return
    }

    sqlData.GetProducts(id, req.params.filterId, function (success, result) {
      if (!success) {
        res.status(400).json({ error: result });
        return
      }

      const sum = result.reduce((a, { price }) => a + price, 0);

      var resultData = {
        infos: {
          rows: result.length,
          moneyTotal: sum
        },
        data: result
      }

      res.status(200).json(resultData);
    })
  }

  controller.listClients = (req, res) => {
    var id = req.userId

    if (id == undefined) {
      res.status(400).json({ error: "Parametros inválidos!" });
      return
    }

    sqlData.GetClients(id, function (success, result) {
      if (!success) {
        res.status(400).json({ error: result });
        return
      }

      var resultData = {
        infos: {
          rows: result.length,
        },
        data: result
      }

      res.status(200).json(resultData);
    })
  }

  controller.setProducts = (req, res) => {
    var id = req.userId

    if (id == undefined) {
      res.status(400).json({ error: "Parametros inválidos!" });
      return
    }


    sqlData.SetProducts(id, req.body, function (success, result) {
      if (!success) {
        res.status(400).json({ error: result });
        return
      }

      res.status(200).json(result);
    })
  }

  controller.openCalendar = (req, res) => {
    var id = req.params.id

    if (id == undefined) {
      res.status(400).json({ error: "Parametros inválidos!" });
      return
    }

    sqlData.OpenCalendar(id, function (success, result) {
      if (!success) {
        res.status(400).json({ error: result });
        return
      }
      res.status(200).json(result);
    })
  }

  controller.getFinancials = (req, res) => {
    var id = req.userId
    var start = req.params.start

    if (id == undefined) {
      res.status(400).json({ error: "Parametros inválidos!" });
      return
    }
    if (start == undefined) {
      start = ""
    }
    sqlData.GetFinancials(id, start, function (success, result) {
      if (!success) {
        res.status(400).json({ error: result });
        return
      }

      const sum = result.reduce((a, { price }) => a + price, 0);

      var resultData = {
        infos: {
          rows: result.length,
          moneyTotal: sum
        },
        data: result
      }

      res.status(200).json(resultData);
    })
  }

  controller.insertClient = (req, res) => {
    var userId = req.userId

    var dataJson = req.body
    dataJson.user_id = userId


    if (dataJson.email == undefined || dataJson.email == null) {
      res.status(400).json({ error: "Email inválido!" });
      return
    }
    if (dataJson.name == undefined || dataJson.name == null || dataJson.name.trim().length < 5) {
      res.status(400).json({ error: "Esse nome é inválido ou está incompleto!" });
      return
    }
    if (dataJson.whatsapp == undefined || dataJson.whatsapp == null) {
      res.status(400).json({ error: "Whatsapp inválido!" });
      return
    }
    if (dataJson.birth_date == undefined || dataJson.birth_date == null) {
      res.status(400).json({ error: "Data de nascimneto inválida!" });
      return
    }


    sqlData.InsertClient(dataJson, function (success, result) {
      if (!success) {
        res.status(400).json({ error: result });
        return
      }

      res.status(200).json(result);
    })
  }

  //  SELECT * FROM instabarbers where client_id = 1 insertClient
  controller.openClient = (req, res) => {
    var userId = req.userId
    var client_id = req.params.id

    if (client_id == undefined) {
      res.status(400).json({ error: "Parametros inválidos!" });
      return
    }

    sqlData.ListCalendarForClients(userId, client_id, function (ok, calendar) {
      if (!ok) {
        res.status(400).json({ error: calendar });
        return
      }

      sqlData.OpenClient(userId, client_id, function (success, result) {
        if (!success) {
          res.status(400).json({ error: result });
          return
        }

        var resultData = {
          calendar: {
            rows: calendar.length,
            data: calendar
          },
          instabarber: {
            rows: result.length,
            data: result
          }
        }

        res.status(200).json(resultData);
      })

    })
  }

  controller.changeAnyData = (req, res) => {
    var table = req.params.table
    var body = req.body.set
    var where = req.body.where

    sqlData.UpdateAnyData(where, table, body, function (success, result) {
      if (!success) {
        res.status(400).json({ error: result });
        return
      }

      res.status(200).json(result);

    })
  }


  controller.insertUser = (req, res) => {
    var userId = req.userId

    var dataJson = req.body
    dataJson.parent_id = userId


    if (dataJson.email == undefined || dataJson.email == null) {
      res.status(400).json({ error: "Email inválido!" });
      return
    }
    if (dataJson.name == undefined || dataJson.name == null || dataJson.name.trim().length < 5) {
      res.status(400).json({ error: "Esse nome é inválido ou está incompleto!" });
      return
    }
    if (dataJson.whatsapp == undefined || dataJson.whatsapp == null) {
      res.status(400).json({ error: "Whatsapp inválido!" });
      return
    }
    if (dataJson.birth_date == undefined || dataJson.birth_date == null) {
      res.status(400).json({ error: "Data de nascimneto inválida!" });
      return
    }

    if (dataJson.percent == undefined || dataJson.percent == null) {
      res.status(400).json({ error: "Comissão inválida!" });
      return
    }


    sqlData.InsertUser(dataJson, function (success, result) {
      if (!success) {
        res.status(400).json({ error: result });
        return
      }

      res.status(200).json(result);
    })
  }


  return controller;
}