var express = require('express');
var router = express.Router();
var admin = require("firebase-admin");

router.post('/', function (req, res) {

    admin.auth().getUser(req.body.idToken)
        .then(function (user) {
            console.log(user);
            usersRef = admin.database().ref('/users');
            usersRef.child(req.body.idToken).set({
                name: user.displayName,
                pushtoken: req.body.pushToken

            });
            res.json({ idToken: req.body.idToken });

        }).catch(function (error) {
            console.log(error);
            res.status(500).send('Authentication failed.');
        });

});

module.exports = router;