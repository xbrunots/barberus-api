require("dotenv-safe").config();
const jwt = require('jsonwebtoken');
const configs = require('../config/default.json');

module.exports = {
    refreshToken: function (req, res, next) {
        var pathRoute = req.path.toString().split("/api/" + configs.api.version)[1]
        if (!configs.api.public_routes.includes(pathRoute)) {
            const tokenHeader = req.headers['token'];
            const tokenCookie = req.cookies.token;
            var token = ""

            if (!tokenHeader) {
                if (!tokenCookie) {
                    return res.status(401).json({ error: 'Acesso negado, essa area da API necessita de Token de acesso' });
                } else {
                    token = tokenCookie
                }
            } else {
                token = tokenHeader
            }

            jwt.verify(token, process.env.SECRET, function (err, decoded) {
                if (err) {
                    return res.status(500).json({ error: 'Seu token expirou, refaça o login' });
                }

                req.userId = decoded.id;
                req.userName = decoded.name;
                req.userEmail = decoded.email;
                req.userWhatsapp = decoded.whatsapp;
                req.userPercent = decoded.percent;
                req.userType = decoded.type;
                req.userPhoto = decoded.photo;
                req.userComments = decoded.comments;
                req.userStatus = decoded.status;
                req.userOwner = decoded.owner;
                next();
            });
        } else {
            next();
        }
    }
}
