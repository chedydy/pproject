var express = require('express');
var router = express.Router();
var admin = require("firebase-admin");

router.post('/', function (req, res) {
    admin.auth().getUser(req.body.token).then((user) => {
        res.json({ name: user.displayName, photoUrl: user.photoURL });
    }).catch(() => {
        res.status(500).send('User not registered');
    });
});

module.exports = router;