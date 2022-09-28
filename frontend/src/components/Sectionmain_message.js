import '../styles/Sectionmain_message.css'
import { useState,useEffect, useRef } from 'react'
import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';
import Sectionmain_recherche from './Sectionmain_recherche'
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import IconButton from '@mui/material/IconButton';
import Sectionmain_aside from './Sectionmain_aside';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { createTheme,ThemeProvider } from '@mui/material/styles';
import DeleteIcon from '@mui/icons-material/Delete';
import PhotoCamera from '@mui/icons-material/PhotoCamera';

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
  //let chat = useRef();
  let [chat,setchat]=useState(({
    // (A) INIT CHAT
    name : null, // USER'S NAME
    userId: null,
    destuserId: null,
    imageUrl:null,
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
    isWrite : (bool) =>{
      chat.socket.send(JSON.stringify({
        state:"isWrite",
        isWrite: bool.isWrite,
        userId: chat.userId,
        destuserId: chat.destuserId,
        msg: "",
      }));

      return false;
    },
    // (C) SEND MESSAGE TO CHAT SERVER
    send : (msg) => {
      if (msg === undefined) {
        msg = chat.emsg.value;
        chat.emsg.value = "";
      }
      /*
      let objectForm= new FormData();
      
      objectForm.append('message',JSON.stringify({
        name: chat.name,
        userId: chat.userId,
        destuserId: chat.destuserId,
        msg: msg,
      })); */
      //objectForm.append('image',chat.imageUrl);
      
      chat.socket.send(JSON.stringify({
        state:"send",
        name: chat.name,
        userId: chat.userId,
        destuserId: chat.destuserId,
        msg: msg,
        imageUrl: chat.imageUrl,
      }));
      
      //console.log(objectForm);
      //chat.socket.send(objectForm);
      return false;
    },
  
    // (D) DRAW MESSAGE IN HTML
    draw : (msg) => {
      // (D1) PARSE JSON
      msg = JSON.parse(msg);
      if(msg.state==="send"){
        let row = document.createElement("div");
        row.className = msg['userId']===auth[1] ? 'privateMessage_user' : 'privateMessage_destuser';
        row.innerHTML = `<div class="chatName">${msg["name"]}</div> <div class="chatMsg">${msg["msg"]}</div>`;
        chat.ewrap.appendChild(row);
        document.getElementById("iswrite").style.display="none";
      }
      if(msg.state==="isWrite"){
        console.log(msg.isWrite);
        if(msg.isWrite === true){
          document.getElementById("iswrite").style.display="block";
        }else{
          document.getElementById("iswrite").style.display="none";
        }
      }
      // (D2) CREATE NEW ROW
      
      
      // AUTO SCROLL TO BOTTOM MAY NOT BE THE BEST...
      window.scrollTo(0, document.body.scrollHeight);
    }
  }));
	const [targetRechercheUser,settargetRechercheUser]=useState({userid:undefined});
  const [targetPage,settargetPage]=useState(0);
  const [listMessage,setlistMessage]=useState([null]);
  const [listPreviewMessage,setlistPreviewMessage]=useState([null]);
  const [formFile,setformFile]=useState("");
  let objectUser={ userId:auth[1], destuserId:targetRechercheUser.userid};
  function getimgpreview(){
		let urlFile = URL.createObjectURL(formFile);
		return (
		<div>
		<span className='container_uploadimg'>
		<img src={urlFile} alt={"Photo de "+ profilData.name + " " + profilData.prename}/>
		
		<IconButton onClick={(e)=>setformFile("")} color="primary" aria-label="delete picture" component="label">
			<DeleteIcon/>
		</IconButton>
		</span>
		</div>
		)
	}
  function getIntervalDate(dateTime){
		dateTime=Math.round((new Date(Date.now()) - new Date(dateTime).getTime())/1000);
		if(dateTime<60) return "Posté il y a "+dateTime+" secondes";
		else if (dateTime>=60 && dateTime<3600) return "Posté il y a "+Math.round(dateTime/60)+" minutes";
		else if (dateTime>=3600 && dateTime<(3600*24)) return "Posté il y a "+Math.round(dateTime/3600)+" heures";
		else if (dateTime>=(3600*24)) return "Posté il y a "+Math.round(dateTime/(3600*24))+" jours";
		else return "Erreur";
	}
  function getBackMessage(){
    let reply;
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
  function getPreviewMessage(){
    let reply;
      listPreviewMessage.forEach(element => {
          let parametre="lastprivateMessage_user";
          reply=
            <>
            {reply}
            <div className={parametre} destuserId={auth[1]===element.userId ? element.destuserId : element.userId} onClick={(e)=>
              {
                if(auth[1]===element.userId){
                  settargetRechercheUser({...targetRechercheUser,userid:element.destuserId});
                }else{
                  settargetRechercheUser({...targetRechercheUser,userid:element.userId});
                }
              }}>
              <div className='message_container_img'>
                <img src={element.profilimageUrl}></img>
              </div>
              <div className='message_container_info'>
                <p>{element.profilname + " " + element.profilprename}</p>
                <p>{element.message}</p>
                <p>{getIntervalDate(element.dateTime)}</p>
              </div>
              
            </div>
            </>;
      });
      reply=(
        <div className='message_historique'>
          {reply}
        </div>
      );
    return reply;
  }
  async function getLastmessage(objectUser){
		return await fetch("http://localhost:3000/api/privatemessage/getlastmessage",{
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
    chat.imageUrl=formFile;
  }, [formFile])
  useEffect(() => {
    if(targetRechercheUser.userid!==undefined){
      getPrivatemessage(JSON.stringify(objectUser)).then((res)=>{
        setlistMessage([...res.conversation]);
        chat.init();
        chat.destuserId=targetRechercheUser.userid;
      });
    }else{
      getLastmessage(JSON.stringify({userId:auth[1]})).then((res)=>{
        setlistPreviewMessage([...res.conversation]);
      });
    }
    return() => {
      if(chat.socket !== null){
        chat.socket.close();
      }
    }
	}, [targetRechercheUser])
	
  return (
        <>
        {
          targetRechercheUser.userid === undefined ?
            <section id="section_privatemessage">
              {
              (listPreviewMessage.length > 0 && listPreviewMessage[0] !== null) &&
              <>
              <div id="privatemessage_previewmessage" className={targetPage === 1 && "grow0_4 paddingright10"}>
              <div className='previewmessage_addbutton'>
              <Button className='message_buttonrechercheuser' onClick={(e)=>{let open=0; if(targetPage===0){open=1;}else{open=0;}settargetPage(open)}}>+</Button>
              </div>
              {getPreviewMessage()}
              
              </div>
              </>
              }
              <div id="privatemessage_rechercheuser" className={targetPage === 1 && "grow0_6 paddingleft10"}>
                {
                targetPage===1 &&
                <Sectionmain_aside key={10} auth={auth} setAuth={setAuth} indexPage={indexPage} setindexPage={setindexPage} targetRechercheUser={targetRechercheUser} settargetRechercheUser={settargetRechercheUser}/>
                }
              </div>
            </section>

          :
          <>
          <section>
            
            
            <div id="chatShow">
              {getBackMessage()}
              
            </div>
            <div id="iswrite" className='privateMessage_destuser'><p>L'utilisateur est en train d'écrire...</p></div>
            <form id="chatForm" onSubmit={(e)=>{e.preventDefault(); if(chat!==undefined) return chat.send()}}>
              
              <ThemeProvider theme={theme}>
                <IconButton onClick={(e)=>settargetRechercheUser({...targetRechercheUser,userid:undefined})} color="primary" aria-label="Back" component="label">
                  <KeyboardBackspaceIcon />
                </IconButton>
                <div className='sendreply_uploadimg'>
                    {
                    formFile === "" ?
                      <IconButton color="primary" aria-label="upload picture" component="label">
                        <input hidden accept="image/*" onChange={(e)=>setformFile(e.target.files[0])} type="file" id="formFile"/>
                        <PhotoCamera />
                      </IconButton>
                    : 
                      getimgpreview()
                    }
                </div>
                <TextField className="message_inputtext" color="neutral" type="text" id="chatMsg" label="Message" variant="filled" defaultValue="Votre Message?" onChange={(e)=>{e.target.value.length > 0 ? chat.isWrite({isWrite:true}) : chat.isWrite({isWrite:false})}}/>
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