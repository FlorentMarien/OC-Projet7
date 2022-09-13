import '../styles/Sectionmain_message.css'
import { useState,useEffect } from 'react'
import Sectionmain_recherche from './Sectionmain_recherche'
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import IconButton from '@mui/material/IconButton';

function Sectionmain_message({auth,setAuth,indexPage,setindexPage,targetRechercheUser,settargetRechercheUser,profilData,setprofilData}) {
	const [targetUser,settargetUser]=useState("");
  let testListMessage=["Hello","it's","Me"];
  let testListAnswer=["test","1","3","5"];
  let chat;
  function getBackMessage(){
    let reply;
    for(let x=0;x<testListMessage.length;x++){
        reply=(
          <>
          {reply}
          <span className='message_private-user'>
           {testListMessage[x]}
          </span>
          <span className='message_private-useranswer'>
          {testListAnswer[x]} 
         </span>
          </>
        );
    }
    return reply;
  }
  //window.addEventListener("DOMContentLoaded", chat.init);
  useEffect(() => {
    //chat.init();
	}, [indexPage])
  useEffect(() => {
    //console.log(targetUser);
    
      chat = {
        // (A) INIT CHAT
        name : null, // USER'S NAME
        userId: null,
        destuserId: null,
        socket : null, // CHAT WEBSOCKET
        ewrap : null, // HTML CHAT HISTORY
        emsg : null, // HTML CHAT MESSAGE
        ego : null, // HTML CHAT GO BUTTON
        init : () => {
          // (A1) GET HTML ELEMENTS
          chat.ewrap = document.getElementById("chatShow");
          chat.emsg = document.getElementById("chatMsg");
          chat.ego = document.getElementById("chatGo");
      
          // (A2) USER'S NAME
          chat.name = profilData.name + " " +profilData.prename;
          if (chat.name === null || chat.name === "") { chat.name = "Mysterious"; }
    
          // ID
          chat.userId = auth[1];
          chat.destuserId = targetUser.userid;
      
          // (A3) CONNECT TO CHAT SERVER
          chat.socket = new WebSocket("ws://localhost:8086?id="+auth[1]);
      
          // (A4) ON CONNECT - ANNOUNCE "I AM HERE" TO THE WORLD
          chat.socket.addEventListener("open", () => {
            chat.controls(1);
            chat.send("Joined the chat room.");
          });
      
          // (A5) ON RECEIVE MESSAGE - DRAW IN HTML
          chat.socket.addEventListener("message", (evt) => {
            chat.draw(evt.data);
          });
      
          // (A6) ON ERROR & CONNECTION LOST
          chat.socket.addEventListener("close", () => {
            chat.controls();
            alert("Websocket connection lost!");
          });
          chat.socket.addEventListener("error", (err) => {
            chat.controls();
            console.log(err);
            alert("Websocket connection error!");
          });
        },
      
        // (B) TOGGLE HTML CONTROLS
        controls : (enable) => {
          if (enable) {
            chat.emsg.disabled = false;
            chat.ego.disabled = false;
          } else {
            chat.emsg.disabled = true;
            chat.ego.disabled = true;
          }
        },
      
        // (C) SEND MESSAGE TO CHAT SERVER
        send : (msg) => {
          if (msg === undefined) {
            msg = chat.emsg.value;
            chat.emsg.value = "";
          }
          chat.socket.send(JSON.stringify({
            name: chat.name,
            userId: chat.userId,
            destuserId: chat.destuserId,
            msg: msg
          }));
          return false;
        },
      
        // (D) DRAW MESSAGE IN HTML
        draw : (msg) => {
          // (D1) PARSE JSON
          msg = JSON.parse(msg);
          
      
          // (D2) CREATE NEW ROW
          let row = document.createElement("div");
          row.className = "chatRow";
          row.innerHTML = `<div class="chatName">${msg["name"]}</div> <div class="chatMsg">${msg["msg"]}</div>`;
          chat.ewrap.appendChild(row);
      
          // AUTO SCROLL TO BOTTOM MAY NOT BE THE BEST...
          window.scrollTo(0, document.body.scrollHeight);
        }
      };
    
    chat.init();
	}, [targetUser])
  
	
  return (
    <>
      
      <section>
        <>
        {
        targetUser.userid === "" &&
        <Sectionmain_recherche auth={auth} setAuth={setAuth} indexPage={targetUser} setindexPage={settargetUser}/>
        }
          <IconButton onClick={(e)=>settargetUser({...targetUser,userid:""})} color="primary" aria-label="Back" component="label">
								<KeyboardBackspaceIcon/>
					</IconButton>
          <div id="chatShow">
            {getBackMessage()}
          </div>
          <form id="chatForm" onSubmit={(e)=>{e.preventDefault(); return chat.send()}}>
            <input id="chatMsg" type="text" required disabled/>
            <input id="chatGo" type="submit" value="Go" disabled/>
          </form>
        </>
      </section>
      
    </>
	)
}

export default Sectionmain_message