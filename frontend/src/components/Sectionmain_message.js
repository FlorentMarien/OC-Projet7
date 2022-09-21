import '../styles/Sectionmain_message.css'
import { useState,useEffect } from 'react'
import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';
import Sectionmain_recherche from './Sectionmain_recherche'
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import IconButton from '@mui/material/IconButton';
import Sectionmain_aside from './Sectionmain_aside';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { createTheme,ThemeProvider } from '@mui/material/styles';

library.add(fas);
const theme = createTheme({
	palette: {
		neutral:{
			color:'#fff',
		},
		text:{
			primary:'#fff', // 
			secondary:'#aaa', //
		},
	},
  });
function Sectionmain_message({auth,setAuth,indexPage,setindexPage,profilData,setprofilData}) {
	const [targetRechercheUser,settargetRechercheUser]=useState({userid:undefined});
  const [listMessage,setlistMessage]=useState([null]);
  let chat;
  let objectUser={ userId:auth[1], destuserId:targetRechercheUser.userid,};
  function getBackMessage(){
    let reply;
    console.log(listMessage);
    if(listMessage.length > 0 && listMessage[0]!==null){
      listMessage.forEach(element => {
          let parametre;
          if(element.userId===auth[1]) parametre="privateMessage_user";
          else parametre="privateMessage_destuser";
          reply=
            <>
            {reply}
            <div className={parametre}>
              <p>{element.message}</p>
            </div>
            </>;
      });
    }
    return reply;
    
  }
  async function getPrivatemessage(objectUser){
		return await fetch("http://localhost:3000/api/privatemessage/get",{
			headers: {
				'Authorization': "Bearer "+auth[2],
				'Accept': 'application/json',
				'Content-Type': 'application/json',
			},
			method: 'POST',
			body:objectUser,
		  })
		  .then(function(res) { 
			if (res.ok) {
			  return res.json();
			}
		  })
		  .then(function(result) {
			return result;
		  })
		  .catch(function(err) {
			// Une erreur est survenue
		  });
	}
  useEffect(() => {
    if(listMessage.length>0){
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
          chat.destuserId = targetRechercheUser.userid;
      
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
          /*chat.socket.addEventListener("close", () => {
            chat.controls();
            alert("Websocket connection lost!");
          });*/
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
          row.className = msg['userId']===auth[1] ? 'privateMessage_user' : 'privateMessage_destuser';
          row.innerHTML = `<div class="chatName">${msg["name"]}</div> <div class="chatMsg">${msg["msg"]}</div>`;
          chat.ewrap.appendChild(row);
      
          // AUTO SCROLL TO BOTTOM MAY NOT BE THE BEST...
          window.scrollTo(0, document.body.scrollHeight);
        }
      };
      chat.init();
      console.log(chat);
    return () => {
      chat.socket.close();
    };
    }
	}, [listMessage])

  useEffect(() => {
    console.log(chat);
    if(targetRechercheUser.userid!==undefined){
      getPrivatemessage(JSON.stringify(objectUser)).then((res)=>{
        setlistMessage([...res.conversation]);
      });
    }
    
	}, [targetRechercheUser])
	
  return (
        <>
        {
          targetRechercheUser.userid === undefined ?
          <section id="section_recherche">
            <Sectionmain_aside key={10} auth={auth} setAuth={setAuth} indexPage={indexPage} setindexPage={setindexPage} targetRechercheUser={targetRechercheUser} settargetRechercheUser={settargetRechercheUser}/>
          </section>
          :
          <>
          <section>
            <IconButton className="buttonback_nav" onClick={(e)=>settargetRechercheUser({...targetRechercheUser,userid:undefined})} color="primary" aria-label="Back" component="label">
              <KeyboardBackspaceIcon />
            </IconButton>
            
            <div id="chatShow">
              {getBackMessage()}
            </div>
            <form id="chatForm" onSubmit={(e)=>{e.preventDefault(); return chat.send()}}>
              <ThemeProvider theme={theme}>
                <TextField className="message_inputtext" color="neutral" type="text" id="chatMsg" label="Message" variant="filled" defaultValue="Votre Message?"/>
                <Button variant="contained" id="chatGo" type="submit" value="Go">Go</Button>
              </ThemeProvider>
            </form>
            </section>
          </>
        }
        </>
	)
  
}

export default Sectionmain_message