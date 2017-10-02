var express = require('express');
var router = express.Router();
var admin = require("firebase-admin");
var authorization = require('./authorization');
var Expo = require('expo-server-sdk');
var _ = require('lodash');
var websocket;
router.ws('/', function (ws, req) {
    webSocket = ws;
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
                        const users = _.map(users, (val, uid) => {
                            return { ...val, uid };
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
                                    coffeeId: data.body.id
                                },
                            })
                        }
                        let chunks = expo.chunkPushNotifications(messages);
                        (async () => {
                            for (let chunk of chunks) {
                                try {
                                    let receipts = await expo.sendPushNotificationsAsync(chunk);
                                    console.log(receipts);
                                } catch (error) {
                                    console.error(error);
                                }
                            }
                        })();
                    }
                });
                break;
            case 'completed':
                admin.database().ref('/queue').child(data.body.id).remove();
                admin.database().ref('/history').child(data.body.id).set({
                    reservedBy: data.body.reservedBy,
                    completedOn: new Date(),
                });
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
                            coffeeId: targetedCoffee.reservedById,
                            userId: targetedTradeUid
                        },
                    })
                    let chunks = expo.chunkPushNotifications(messages);
                    (async () => {
                        for (let chunk of chunks) {
                            try {
                                let receipts = await expo.sendPushNotificationsAsync(chunk);
                                console.log(receipts);
                            } catch (error) {
                                console.error(error);
                            }
                        }
                    })();
                }
            });
        }
    });

});

router.post('/complete-trade', authorization, function (req, res) {
    admin.database().ref('/queue').child(req.body.id).child('reservedBy').set(req.body.reservedBy);
    if (websocket) {
        websocket.send(JSON.stringify({ id: req.body.id, reservedBy: req.body.reservedBy }));
    }
});
router.post('/reserve', authorization, function (req, res) {
    admin.database().ref('/queue').child(req.body.id).set({
        reservedBy: req.user.displayName,
        reservedById: req.uid,
        reserved: true,
        available: false
    });
    if (websocket) {
        websocket.send(JSON.stringify({ id: req.body.id, reservedBy: req.user.displayName }));
    }
    res.send('ok');
});
module.exports = router;