const express = require('express');
const bodyParser = require('body-parser');
const config = require('config');
const consign = require('consign');
const jwt = require('../middlewares/jwt');
var cookieParser = require('cookie-parser')
const cors = require('cors');

module.exports = () => {
  const app = express();

  var corsOptions = {
    origin: 'http://localhost:3000',
    optionsSuccessStatus: 200
  }

  app.use(cors(corsOptions));

  // Cookies
  app.use(cookieParser())

  // SETANDO VARIÁVEIS DA APLICAÇÃO
  app.set('port', process.env.PORT || config.get('server.port'));

  // middlewares
  app.use(bodyParser.json());
  app.use(jwt.refreshToken)

  consign({ cwd: 'api' })
    .then('data')
    .then('controllers')
    .then('routes')
    .into(app);

  return app;
};