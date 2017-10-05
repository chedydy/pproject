var express = require('express');
var router = express.Router();
var admin = require("firebase-admin");
var authorization = require('./authorization');
var Expo = require('expo-server-sdk');
var _ = require('lodash');
router.ws('/', function (ws, req) {
    global.webSocket = ws;
    ws.on('error', function (error) { console.log(error); });
    ws.on('message', function (msg) {
        var data = JSON.parse(msg);
        switch (data.type) {
            case 'available':
                admin.database().ref('/queue').child(data.body.id).set({
                    reservedBy: '',
                    reserved: false,
                    available: true
                });
                admin.database().ref("/users").once('value', function (snapshot) {
                    if (snapshot.val()) {
                        var users = snapshot.val();
                        users = _.map(users, (val, uid) => {
                            return { name: val.name, uid: uid, pushtoken: val.pushtoken };
                        });
                        let messages = [];
                        for (var index = 0; index < users.length; index++) {
                            if (!Expo.isExpoPushToken(users[index].pushtoken)) {
                                console.error(`Push token ${users[index].pushtoken} is not a valid Expo push token`);
                                continue;
                            }
                            messages.push({
                                to: users[index].pushtoken,
                                sound: 'default',
                                body: `A coffee is available. Tap to reserve it`,
                                data: {
                                    type: 'reserve', body: {
                                        coffeeId: data.body.id
                                    }
                                },
                            })
                        }
                        let expo = new Expo();
                        let chunks = expo.chunkPushNotifications(messages);
                        var promises = chunks.map(function (chunk) {
                            return expo.sendPushNotificationsAsync(chunk).then((receipts) => { console.log(receipts); });
                        });
                        Promise.all(promises).then(function (results) {
                            console.log('users notified');
                        }).catch((error) => { console.error(error); });
                    }
                });
                break;
            case 'completed':
                admin.database().ref('/queue').child(data.body.id).remove();
                let historyItem = {
                    reservedBy: data.body.reservedBy,
                    completedOn: new Date().toString(),
                };
                admin.database().ref('/history').child(data.body.id).set(historyItem);
                break;
        }
    });
});

router.post('/request-trade', authorization, function (req, res) {
    admin.database().ref("/queue").once('value', function (snapshot) {
        if (snapshot.val()) {
            var queue = snapshot.val();
            var targetedCoffee = queue[req.body.id];
            var targetedTradeUid = targetedCoffee.reservedById;
            admin.database().ref("/users").once('value', function (snapshot) {
                if (snapshot.val()) {
                    var users = snapshot.val();
                    var user = users[targetedTradeUid];
                    var targetedTradePushToken = user.pushtoken;
                    let expo = new Expo();
                    if (!Expo.isExpoPushToken(targetedTradePushToken)) {
                        console.error(`Push token ${targetedTradePushToken} is not a valid Expo push token`);
                        res.status(500).send(`Push token ${targetedTradePushToken} is not a valid Expo push token`);
                        return;
                    }
                    let messages = [];
                    messages.push({
                        to: targetedTradePushToken,
                        sound: 'default',
                        body: `${req.user.displayName} asked you for the reserved coffee. Do you accept the trade?`,
                        data: {
                            type: 'trade', body: {
                                coffeeId: req.body.id,
                                userId: req.uid,
                                name: req.user.displayName
                            }
                        },
                    })
                    let chunks = expo.chunkPushNotifications(messages);
                    for (let chunk of chunks) {
                        try {
                            expo.sendPushNotificationsAsync(chunk);
                        } catch (error) {
                            console.error(error);
                        }
                    }
                    res.send("ok");
                } else {
                    console.error("User not found in the database.");
                    res.status(500).send("User not found in the database.");
                }
            });
        } else {
            console.error("Coffee was allready taken.");
            res.status(500).send("Coffee was allready taken.");
        }
    });

});

router.post('/complete-trade', authorization, function (req, res) {
    admin.database().ref('/queue').child(req.body.coffeeId).child('reservedBy').set(req.body.name);

    admin.database().ref("/users").once('value', function (snapshot) {
        if (snapshot.val()) {
            var users = snapshot.val();
            var user = users[req.body.userId];
            var targetedTradePushToken = user.pushtoken;
            let expo = new Expo();
            if (!Expo.isExpoPushToken(targetedTradePushToken)) {
                console.error(`Push token ${targetedTradePushToken} is not a valid Expo push token`);
                res.status(500).send(`Push token ${targetedTradePushToken} is not a valid Expo push token`);
                return;
            }
            let messages = [];
            messages.push({
                to: targetedTradePushToken,
                sound: 'default',
                body: `${req.user.displayName} has accepted your trade`,
                data: {
                    type: 'trade-complete'
                },
            })
            let chunks = expo.chunkPushNotifications(messages);
            for (let chunk of chunks) {
                try {
                    expo.sendPushNotificationsAsync(chunk);
                } catch (error) {
                    console.error(error);
                }
            }
            res.send("ok");
        } else {
            console.error("User not found in the database.");
            res.status(500).send("User not found in the database.");
        }
    });

    if (global.websocket) {
        global.websocket.send(JSON.stringify({ id: req.body.id, reservedBy: req.body.name }));
    }
});

router.post('/reserve', authorization, function (req, res) {
    let queueRef = admin.database().ref("/queue");
    queueRef.once('value', function (snapshot) {
        if (snapshot.val()) {
            var queue = snapshot.val();
            var coffee = queue[req.body.id];
            if (!coffee.available) {
                res.status(500).send('Coffee was already reserved');
            }
            else {
                queueRef.child(req.body.id).set({
                    reservedBy: req.user.displayName,
                    reservedById: req.uid,
                    reserved: true,
                    available: false
                });
                if (global.websocket) {
                    global.websocket.send(JSON.stringify({ id: req.body.id, reservedBy: req.user.displayName }));
                }
                res.send('ok');
            }
        } else {
            console.error("Coffee was allready taken.");
            res.status(500).send("Coffee was allready taken.");
        }
    });


});
module.exports = router;