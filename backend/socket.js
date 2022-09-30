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
    //console.log(message);
    //console.log(message);
    //let objectmessage=message.toString();
    let objectmessage= JSON.parse(message);
    if(objectmessage.state === "sendfile"){
      //GESTION IMAGE
      //console.log(objectmessage.file);
      //console.log(objectmessage.userId);
      //console.log(objectmessage.destuserId);
      
      //users[objectmessage.userId].send(message);
      //users[objectmessage.destuserId].send(message);
    }
    objectmessage={
      ...objectmessage,
      dateTime:Date.now(),
    };
    for (let u in users) { 
        if(u === objectmessage.destuserId || u === objectmessage.userId){
            if(objectmessage.state==="open" ){
              users[u].send(message);
            }
            if(u === objectmessage.destuserId && objectmessage.state==="close" ){
              users[u].send(message);
            }
            if(objectmessage.state==="sendfile"){
              //ajout api a voir
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
  socket.on("upload", (file, callback) => {
    console.log(file); // <Buffer 25 50 44 ...>

    // save the content to the disk, for example
    /*writeFile("/tmp/upload", file, (err) => {
      callback({ message: err ? "failure" : "success" });
    });*/
  });
});