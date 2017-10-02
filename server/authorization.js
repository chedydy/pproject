var admin = require("firebase-admin");
function authorization(req, res, next) {
    if (req.method == 'OPTIONS') {
        next();
    } else {
        var token = req.headers['authorization'];
        if (token) {
            admin.auth().getUser(token)
                .then(function (user) {
                    req.uid = token;
                    req.user = user;
                    next();
                }).catch(function (error) {
                    console.log(error);
                    res.status(401).send('Unauthorized');
                });
        } else {
            res.status(400).send('Token not found in request');
        }
    }
}

module.exports = authorization;