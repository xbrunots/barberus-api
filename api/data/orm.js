
const Store = require('openrecord/store/mysql')

const store = new Store({
    host: 'us-cdbr-east-03.cleardb.com',
    user: 'b8ea104fdb605e',
    password: 'e60fb8a1',
    database: 'heroku_9b72993a4442b93',
    autoLoad: true
})

store.ready(async () => {
    const users = await store.Model('users').find(1)
    console.log(users)
})

module.exports = {
    userData: function (callback) {
        store.ready(async () => {
            var user = await store.Model('users').find(1)
            callback(user)
        })
    },
    set: function () {

    }
}