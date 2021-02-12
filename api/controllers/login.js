
const md5 = require('md5')
const jwt = require('jsonwebtoken');
require("dotenv-safe").config();
const cookieParser = require('cookie-parser')

module.exports = app => {
  const controller = {};
  const sqlData = app.data.orm;
  const sqlQuery = app.data.sql;

  controller.auth = (req, res) => {
    var email = req.body.email
    var password = req.body.password

    if (email == undefined || password == undefined) {
      res.status(400).json({ error: "Email ou senha inválidos!" });
      return
    }

    sqlData.Login(email, md5(password), function (success, result) {

      if (!success) {
        res.status(400).json({ error: result });
        return
      }

      var userData = {
        "id": result.attributes.id,
        "name": result.attributes.name,
        "email": result.attributes.email,
        "whatsapp": result.attributes.whatsapp,
        "percent": result.attributes.percent,
        "type": result.attributes.type,
        "photo": result.attributes.photo,
        "comments": result.attributes.comments,
        "status": result.attributes.status,
        "owner": result.attributes.parent_id == null,
      }

      const token = jwt.sign(userData, process.env.SECRET, {
        expiresIn: process.env.TOKEN_LIFE
      });

      res.cookie('token', token);

      res.status(200).json({ token: token });
    })
  }


  controller.register = (req, res) => {
    var email = req.body.email
    var password = req.body.password
    var confirm_password = req.body.confirm_password

    if (email == undefined || password == undefined || confirm_password == undefined) {
      res.status(400).json({ error: "Email ou senhas inválidas!" });
      return
    }

    if (password != confirm_password) {
      res.status(400).json({ error: "As senhas são diferentes!" });
      return
    }

    sqlQuery.Register(email, md5(password), function (success, result) {

      if (!success) {
        res.status(400).json({ error: result });
        return
      }

      console.log(result)

      res.status(200).json({ success: true });
    })
  }

  controller.logout = (req, res) => {
    cookie = req.cookies;
    for (var prop in cookie) {
      if (!cookie.hasOwnProperty(prop)) {
        continue;
      }
      res.cookie(prop, '', { expires: new Date(0) });
    }

    res.json({ token: null });
  }


  return controller;
}