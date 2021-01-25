const uuidv4 = require('uuid/v4');
const user = require('../routes/user');
const dataBase = require('../data/orm');

module.exports = app => {
  const customerWalletsDB = app.data.usersMock;

  const controller = {};

  const {
    customerWallets: customerWalletsMock,
  } = customerWalletsDB;

  controller.listUsers = (req, res) => {
    dataBase.userData(function (users) {
      res.status(200).json(users);
    })
  }


  controller.insertUser = (req, res) => {
    customerWalletsMock.data.push({
      id: uuidv4(),
      parentId: uuidv4(),
      name: req.body.name,
      birthDate: req.body.birthDate,
      cellphone: req.body.cellphone,
      phone: req.body.phone,
      email: req.body.email,
      occupation: req.body.occupation,
      state: req.body.state,
    });

    res.status(201).json(customerWalletsMock);
  };

  controller.removeUser = (req, res) => {
    const {
      customerId,
    } = req.params;

    const foundCustomerIndex = customerWalletsMock.data.findIndex(customer => customer.id === customerId);

    if (foundCustomerIndex === -1) {
      res.status(404).json({
        message: 'Cliente não encontrado na base.',
        success: false,
        customerWallets: customerWalletsMock,
      });
    } else {
      customerWalletsMock.data.splice(foundCustomerIndex, 1);
      res.status(200).json({
        message: 'Cliente encontrado e deletado com sucesso!',
        success: true,
        customerWallets: customerWalletsMock,
      });
    }
  };

  controller.updateUser = (req, res) => {
    const {
      customerId,
    } = req.params;

    const foundCustomerIndex = customerWalletsMock.data.findIndex(customer => customer.id === customerId);

    if (foundCustomerIndex === -1) {
      res.status(404).json({
        message: 'Cliente não encontrado na base.',
        success: false,
        customerWallets: customerWalletsMock,
      });
    } else {
      const newCustomer = {
        id: customerId,
        parentId: req.body.parentId,
        name: req.body.name,
        birthDate: req.body.birthDate,
        cellphone: req.body.cellphone,
        phone: req.body.phone,
        email: req.body.email,
        occupation: req.body.occupation,
        state: req.body.state,
        createdAt: new Date()
      };

      customerWalletsMock.data.splice(foundCustomerIndex, 1, newCustomer);

      res.status(200).json({
        message: 'Cliente encontrado e atualizado com sucesso!',
        success: true,
        customerWallets: customerWalletsMock,
      });
    }
  }

  return controller;
}