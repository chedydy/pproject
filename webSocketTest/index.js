var WebSocket = require('ws');
var ws = new WebSocket('ws://localhost:3000/device');
ws.on('open', function open() {
  ws.send(JSON.stringify({ type:'available',body:{id:'test3'} }));
  //ws.send(JSON.stringify({ type:'completed',body:{id:'test2',reservedBy:'Cineva Smecher'} }));
});

ws.on('message', function incoming(data) {
  console.log(data);
});
