const { Console } = require('console');
const url = require('url');
const Privatemessage = require('./controllers/privatemessage');
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
    let message = msg.toString();
    //let objectmessage=message.toString();
    let objectmessage= JSON.parse(message);
    if(objectmessage.imageUrl !== ""){
      //GESTION IMAGE
      
    }
    objectmessage={
      ...objectmessage,
      dateTime:Date.now(),
    }
    for (let u in users) { 
        if(u === objectmessage.destuserId || u === objectmessage.userId){
            if(objectmessage.state==="open" ){
              users[u].send(message);
            }
            if(u === objectmessage.destuserId && objectmessage.state==="close" ){
              users[u].send(message);
            }
            if(objectmessage.state==="send" && u===objectmessage.userId){
              Privatemessage.sendMessage(objectmessage);
            }
            if(objectmessage.state==="isWrite" && u===objectmessage.destuserId /* Seulement destuserid a ajouter*/){
              users[u].send(message);
            }else if(objectmessage.state==="send"){
              users[u].send(message);
            }
        }
    }
  });
});