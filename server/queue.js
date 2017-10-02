var express = require('express');
var router = express.Router();
var admin = require("firebase-admin");

router.get('/', function (req, res) {
    admin.database().ref("/queue").once('value', function(snapshot) {
        if(snapshot.val()){
            res.send(snapshot.val());
        }
    });
});

module.exports = router;