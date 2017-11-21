var WebSocket = require("ws");
var ws = new WebSocket("ws://52.164.252.68:3000/device");
ws.on("open", function open() {
  console.log("1. New coffee");
  console.log("2. Pickup coffee");
  var stdin = process.openStdin();

  stdin.addListener("data", function(d) {
    var option = d.toString().trim();
    switch (option) {
      case "1":
        ws.send(JSON.stringify({ type: "available", body: { id: "test3" } }));
        break;
      case "2":
        ws.send(
          JSON.stringify({
            type: "completed",
            body: { id: "test4", reservedBy: "Cineva Smecher 2" }
          })
        );
        break;
      default:
        console.log("incorrect option");
        break;
    }
  });
});

ws.on("message", function incoming(data) {
  console.log(data);
});
