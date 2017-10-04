var express = require('express');
var app = express();
var expressWs = require('express-ws')(app);
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var admin = require("firebase-admin");
var serviceAccount = require("./key.json");
var registerRoutes = require('./register');
var historyRoutes = require('./history');
var deviceRoutes = require('./device');
var authorization = require('./authorization');
var queueRoutes=require('./queue');
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://coffeequeue-1bf68.firebaseio.com"
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));

app.use(cookieParser());
app.use(function (req, res, next) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader('Access-Control-Allow-Methods', 'POST,GET,OPTIONS,PUT,DELETE');
    res.setHeader("Access-Control-Allow-Headers", "Authorization, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Request-Method, Access-Control-Request-Headers, Access-Control-Allow-Headers");
    next();
});
app.use(function (req, res, next) {
    var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    console.log('Client IP:', ip);
    next();
});
app.use('/chedy', function (req, res) {
    res.send('ceva');
});
app.use('/register', registerRoutes);
app.use('/device', deviceRoutes);
app.use('/queue',authorization, queueRoutes);
app.use('/history',authorization, historyRoutes);
app.set('port', 5000);

var server = app.listen(app.get('port'), function () {
    console.log('Express server listening on port ' + server.address().port);
});
