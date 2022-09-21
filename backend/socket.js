const url = require('url');
// (A) INIT + CREATE WEBSOCKET SERVER AT PORT 8080
var ws = require("ws"),
    wss = new ws.Server({ port: 8086 }),
    users = {};
// (B) ON CLIENT CONNECT
wss.on("connection", (socket, req) => {
  // (B1) REGISTER CLIENT
  let id = url.parse(req.url, true).query.id;
  while (true) {
    if (!users.hasOwnProperty(id)) { users[id] = socket; break;}
    id++;
  }

  // (B2) DEREGISTER CLIENT ON DISCONNECT
  socket.on("close", () => { delete users[id]; });

  // (B3) FORWARD MESSAGE TO ALL ON RECEIVING MESSAGE
  socket.on("message", (msg) => {
    
    //console.log(msg.toString());
    let message = msg.toString();
    let objectmessage=JSON.parse(message);
    //console.log(objectmessage.name);
    for (let u in users) { 

        if(u === objectmessage.destuserId || u === objectmessage.userId){
            users[u].send(message);
        }
    }
  });
});