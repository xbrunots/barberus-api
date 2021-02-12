
require("dotenv-safe").config();
const { call } = require("body-parser");
const mysql = require('mysql2');

const pool = mysql.createPool({
    host: process.env.SQL_HOST,
    user: process.env.SQL_USER,
    password: process.env.SQL_PASSWORD,
    database: process.env.SQL_DB,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

function checkEmailExist(email, callback) {
    pool.getConnection(function (err, conn) {
        if (err) { callback(false, err); return }
        conn.query('select COUNT(email)  as size FROM users WHERE email = "' + email + '"  ',
            function (err, results, fields) {
                if (err) { callback(true, "Ops... algo deu errado, tente novamente mais tarde..."); return }
                console.log(results)
                if (results[0].size == 0)
                    callback(false, "O e-mail " + email + " não possue cadastro!");
                else
                    callback(true, "O e-mail " + email + " já faz parte dos Barberus!");
            }
        );
        pool.releaseConnection(conn);
    })
}

function getCurrentUuser(id, callback) {
    pool.getConnection(function (err, conn) {
        if (err) { callback(false, err); return }
        conn.query('select *,  NULL AS `password` FROM users WHERE id = ' + id,
            function (err, results, fields) {
                if (err) { callback(false, "Ops... algo deu errado, tente novamente mais tarde..."); return }
                callback(true, results)
            }
        );
        pool.releaseConnection(conn);
    })
}

module.exports = {
    ListCalendar: function (id, start, callback) {
        pool.getConnection(function (err, conn) {
            if (err) { callback(false, err); return }

            var between = ""
            if (start != undefined && start != null && start.indexOf(":") != -1) {
                between = " and calendars.`date` BETWEEN " + start.split(":")[0] + " AND " + start.split(":")[1]
            }

            var query = " SELECT calendars.`id`, calendars.`id` AS calendars_id, clients.`whatsapp`, clients.`name` AS clients_name, calendars.`date`, " +
                "      calendars.`hour`, calendars.`comments`, services.`name`, calendars.`status`, services.`price`,  services.`time`" +
                "      FROM calendars " +
                "      INNER JOIN services ON  calendars.`service_id` = services.`id` " +
                "      INNER JOIN clients ON  calendars.`client_id` = clients.`id` " +
                "      WHERE calendars.`user_id` = " + id + between + " order by calendars.`id` desc"



            conn.query(query,
                function (err, results, fields) {
                    if (err) { callback(false, err); return }

                    callback(true, results);
                }
            );
            pool.releaseConnection(conn);
        })
    },
    ListCalendarForClients: function (user_id, client_id, callback) {
        pool.getConnection(function (err, conn) {
            if (err) { callback(false, err); return }

            var query = " SELECT calendars.`id`, calendars.`id` AS calendars_id, clients.`whatsapp`, clients.`name` AS clients_name, calendars.`date`, " +
                "      calendars.`hour`, calendars.`comments`, services.`name`, calendars.`status`, services.`price`,  services.`time`" +
                "      FROM calendars " +
                "      INNER JOIN services ON  calendars.`service_id` = services.`id` " +
                "      INNER JOIN clients ON  calendars.`client_id` = clients.`id` " +
                "      WHERE calendars.`client_id` = " + client_id + " and  calendars.`user_id` = " + user_id + " order by calendars.`id` desc"



            conn.query(query,
                function (err, results, fields) {
                    if (err) { callback(false, err); return }

                    callback(true, results);
                }
            );
            pool.releaseConnection(conn);
        })
    },
    OpenCalendar: function (id, callback) {

        pool.getConnection(function (err, conn) {
            if (err) { callback(false, err); return }
            conn.query(" SELECT cart_items.`id` AS cart_item_id, products.title, products.price, products.photo, products.um FROM cart_items " +
                "INNER JOIN products ON  cart_items.product_id = products.id WHERE cart_items.calendar_id = " + id + " order by calendars.`id` desc",
                function (err, results, fields) {
                    if (err) { callback(false, err); return }
                    callback(true, results);
                }
            );
            pool.releaseConnection(conn);
        })
    },

    SelectProfile: function (id, callback) {
        getCurrentUuser(id, function (success, userData) {
            if (success) {
                pool.getConnection(function (err, conn) {
                    if (err) { callback(false, err); return }
                    conn.query("SELECT * FROM clients  WHERE user_id =  " + id + "  ORDER BY id desc",
                        function (err, results, fields) {
                            if (err) { callback(false, err); return }

                            conn.query("SELECT *,  NULL AS `password` FROM users WHERE parent_id IS not NULL AND parent_id = " + id + " AND STATUS != 2 or  parent_id IS NULL AND id = " + id + " AND STATUS != 2   ORDER BY id desc",
                                function (err, barbersData, fields) {
                                    if (err) { callback(false, err); return }
                                    var barbersDataResult = barbersData
                                    var userDataResult = userData
                                    barbersDataResult.password = null
                                    userDataResult.password = null

                                    var data = {
                                        profile: userDataResult,
                                        clients: results,
                                        barbers: barbersDataResult,
                                        services: null
                                    }

                                    conn.query("SELECT * FROM services WHERE user_id = " + id,
                                        function (servicesErr, services, fields) {
                                            if (servicesErr) { callback(false, err); return }
                                            data.services = services
                                            callback(true, data);
                                        }
                                    );
                                }
                            );

                        }
                    );

                    //SELECT * FROM services WHERE user_id = 1
                    pool.releaseConnection(conn);
                })
            } else {
                callback(false, "Token inválido, refaça o login!");
            }
        })
    },
    OpenClient: function (userId, client_id, callback) {

        pool.getConnection(function (err, conn) {
            if (err) { callback(false, err); return }
            conn.query(" SELECT * FROM instabarbers WHERE user_id = " + userId + " and client_id= " + client_id + " order by `id` desc",
                function (err, results, fields) {
                    if (err) { callback(false, err); return }
                    callback(true, results);
                }
            );
            pool.releaseConnection(conn);
        })
    },
    UpdateAnyData: function (where, table, json, callback) {
        var str = ""
        var strWhere = ""

        Object.keys(where).forEach(function (keys) {
            strWhere += " `" + keys + "`" + " = '" + where[keys] + "' AND"
        });
        strWhere = strWhere.trim() + "$"
        var whereString = strWhere.replace("AND$", "")


        Object.keys(json).forEach(function (keys) {
            str += "`" + keys + "`" + " = '" + json[keys] + "',"
        });
        str = str.trim() + "$"
        var setUpdates = str.replace(",$", "")

        var sqlQueryStr = " UPDATE " + table + " SET " + setUpdates + " WHERE " + whereString
        //column1=value, column2=value2,...
        console.log(sqlQueryStr)

        pool.getConnection(function (err, conn) {
            if (err) { callback(false, err); return }
            conn.query(sqlQueryStr,
                function (err, results, fields) {
                    if (err) { callback(false, err); return }
                    callback(true, results);
                }
            );
            pool.releaseConnection(conn);
        })
    },
    UpdateProfile: function (id, json, callback) {

        var str = ""

        Object.keys(json).forEach(function (keys) {
            str += "`" + keys + "`" + " = '" + json[keys] + "',"
        });
        str = str.trim() + "$"
        var setUpdates = str.replace(",$", "")

        //column1=value, column2=value2,...
        console.log(setUpdates)

        pool.getConnection(function (err, conn) {
            if (err) { callback(false, err); return }
            conn.query(" UPDATE users SET " + setUpdates + " where id = " + id,
                function (err, results, fields) {
                    if (err) { callback(false, err); return }
                    callback(true, results);
                }
            );
            pool.releaseConnection(conn);
        })
    },
    GetClients: function (id, callback) {

        pool.getConnection(function (err, conn) {
            if (err) { callback(false, err); return }
            conn.query(" SELECT * FROM clients WHERE user_id = " + id + "  ORDER BY id desc",
                function (err, results, fields) {
                    if (err) { callback(false, err); return }
                    callback(true, results);
                }
            );
            pool.releaseConnection(conn);
        })
    },

    SetProducts: function (id, json, callback) {
        pool.getConnection(function (err, conn) {
            if (err) { callback(false, err); return }
            conn.query('INSERT into products(user_id, title, description, price, photo, qtd, um, createAt) ' +
                ' VALUES(' + id + ', "' + json.title + '", "' + json.description + '", ' + parseFloat(json.price) + ', "' + json.photo + '", "' + json.qtd + '", "' + json.um + '", now()) ',
                function (err, results, fields) {
                    if (err) { callback(false, err); return }
                    callback(true, results);
                }
            );
            pool.releaseConnection(conn);
        })
    },
    InsertClient: function (json, callback) {
        checkEmailExist(json.email, function (exist, message) {
            if (!exist) {
                pool.getConnection(function (err, conn) {
                    if (err) { callback(false, err); return }
                    conn.query('INSERT into clients(user_id, name, email, whatsapp, birth_date, comments) ' +
                        ' VALUES(' + json.user_id + ', "' + json.name + '", "' + json.email + '", "' + json.whatsapp + '", ' + json.birth_date + ', "' + json.comments + '") ',
                        function (err, results, fields) {
                            if (err) { callback(false, err); return }
                            callback(true, results);
                        }
                    );
                    pool.releaseConnection(conn);
                })
            } else {
                callback(false, message);
            }
        })


    },
    InsertUser: function (json, callback) {
        checkEmailExist(json.email, function (exist, message) {
            if (!exist) {
                pool.getConnection(function (err, conn) {
                    if (err) { callback(false, err); return }
                    conn.query('INSERT into users(parent_id, name, email, whatsapp, birth_date, comments, percent, photo) ' +
                        ' VALUES(' + json.parent_id + ', "' + json.name + '", "' + json.email + '", "' + json.whatsapp + '", ' + json.birth_date + ', "' + json.comments + '", ' + json.percent + ', "' + json.photo + '") ',
                        function (err, results, fields) {
                            if (err) { callback(false, err); return }
                            callback(true, results);
                        }
                    );
                    pool.releaseConnection(conn);
                })
            } else {
                callback(false, message);
            }
        })


    },
    GetProducts: function (id, filterId, callback) {
        var filters = " "
        if (filterId != null && filterId != undefined) {
            //1 = all
            //2 = active
            //3 = inactive
            //4 = stok loss
            switch (parseInt(filterId)) {
                case 1:
                    filters = " "
                    break;
                case 2:
                    filters = " and status = 1 "
                    break;
                case 3:
                    filters = " and status = 0 "
                    break;
                case 4:
                    filters = " and qtd < 5 "
                    break;
                default:
                    filters = " "
                    break;
            }
        }

        var queryString = " SELECT * FROM PRODUCTS WHERE user_id = " + id + filters + " order by id desc"

        console.log(filterId)
        console.log(queryString)

        pool.getConnection(function (err, conn) {
            if (err) { callback(false, err); return }

            conn.query(queryString,
                function (err, results, fields) {
                    if (err) { callback(false, err); return }
                    callback(true, results);
                }
            );
            pool.releaseConnection(conn);
        })
    },

    GetFinancials: function (id, start, callback) {
        var between = ""
        if (start != undefined && start != null && start.indexOf(":") != -1) {
            between = " and financials.`date` BETWEEN " + start.split(":")[0] + " AND " + start.split(":")[1] + " "
        }
        var query = " select * from financials where user_id = " + id + between + " order by financials.id desc"
        console.log(query)

        pool.getConnection(function (err, conn) {
            if (err) { callback(false, err); return }
            conn.query(query,
                function (err, results, fields) {
                    if (err) { callback(false, err); return }
                    callback(true, results);
                }
            );
            pool.releaseConnection(conn);
        })
    },
    Register: function (email, password, callback) {

        var json = {
            email: email,
            password: password
        }

        checkEmailExist(email, function (exist, message) {
            if (!exist) {
                pool.getConnection(function (err, conn) {
                    if (err) { callback(false, err); return }
                    conn.query(' insert into users (email, password) values ("' + email + '","' + password + '") ',
                        function (err, results, fields) {
                            if (err) { callback(false, err); return }
                            callback(true, results);
                        }
                    );
                    pool.releaseConnection(conn);
                })

            } else {
                callback(false, message);
            }
        })


    }
}