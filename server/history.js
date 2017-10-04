var express = require('express');
var router = express.Router();
var admin = require("firebase-admin");

router.get('/', function (req, res) {
    admin.database().ref("/history").once('value', function(snapshot) {
        if(snapshot.val()){
            res.json(snapshot.val());
        }
    });
});

module.exports = router;