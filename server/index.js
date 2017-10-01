var express = require('express');
var app = express();
var expressWs = require('express-ws')(app);
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var router = express.Router();

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
app.use('/chedy', function(req,res) {
    res.send('ceva');
});
router.ws('/', function (ws, req, res) {
    var webSockets = ws;
    ws.on('error', function (error) { console.log(error); });
    ws.on('message', function (msg) {
        //var plantMap = JSON.parse(msg);
        var message_to_client = {
            data:"Connection with the server established"
          }
        ws.send(JSON.stringify(message_to_client)); 
    });
});
app.use('/chedyws', router);
app.set('port', 80);

var server = app.listen(app.get('port'), function() {
    console.log('Express server listening on port ' + server.address().port);
});
