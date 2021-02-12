
require("dotenv-safe").config();
const md5 = require("md5");
const Store = require('openrecord/store/mysql')

const store = new Store({
    host: process.env.SQL_HOST,
    user: process.env.SQL_USER,
    password: process.env.SQL_PASSWORD,
    database: process.env.SQL_DB,
    autoLoad: true
})

module.exports = {
    Login: function (_email, _password, callback) {
        store.ready(async () => {
            var data = await store.Model('users').where({ email: _email, password: _password }).first()
            if (data == undefined) {
                callback(false, "Combinação de email e senha erradas.")
                return
            }
            callback(true, data)
        }).catch(function (e) {
            callback(false, e)
        })
    },
    SelectById: function (table, id, callback) {
        store.ready(async () => {
            var data = await store.Model(table).where({ id: id })
            if (data == undefined) {
                callback(false, "Esse usuario não existe")
                return
            }
            callback(true, data)
        }).catch(function (e) {
            callback(false, e)
        })
    },
    Select: function (table, key, callback) {
        store.ready(async () => {
            var data = await store.Model(table).where(key)
            if (data == undefined) {
                callback(false, "Esse usuario não existe")
                return
            }

            callback(true, data)
        }).catch(function (e) {
            callback(false, e)
        })
    },
    Insert: function (table, json, callback) {
        store.ready(async () => {

            var data = await store.Model(table).create(json)
            if (data == undefined) {
                callback(false, "Falha na tentativa de inserção!")
                return
            }

            callback(true, data)
        }).catch(function (e) {
            callback(false, e)
        })
    },
    Update: function (table, id, newData, callback) {
        store.ready(async () => {
            var data = await store.Model(table).find(id)
            if (data == undefined) {
                callback(false, "Falha na tentativa de update!")
                return
            }

            data.set(newData)
            var result = await data.save()
            if (result == undefined) {
                callback(false, "Falha na tentativa de update!")
                return
            }

            callback(true, result)
        }).catch(function (e) {
            callback(false, e)
        })
    },
    Delete: function (table, id, callback) {
        store.ready(async () => {
            var data = await store.Model(table).find(id)
            if (data == undefined) {
                callback(false, "Falha na tentativa de exclusão!")
                return
            }

            var result = await data.destroy()
            if (result == undefined) {
                callback(false, "Falha na tentativa de exclusão!")
                return
            }

            callback(true, result)
        }).catch(function (e) {
            callback(false, e)
        })
    },
    GetCalendars: function (id, callback) {
        store.ready(async () => {

            var data = await store.Model("calendars")
                .include(['calendars.id', 'clients.whatsapp', 'clients.name', 'calendars.date', 'calendars.hour', 'calendars.comments', 'services.status', 'services.price', 'calendars.time'])
                .join('JOIN services ON calendars.service_id = services.id')
                .join('JOIN clients ON calendars.client_id = clients.id')

            if (data == undefined) {
                callback(false, "Falha ao tentar efetuar a consulta no banco de dados")
                return
            }
            callback(true, data)
        }).catch(function (e) {
            callback(false, e)
        })
    },
}