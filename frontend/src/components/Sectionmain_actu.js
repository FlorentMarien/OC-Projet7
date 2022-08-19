import '../styles/Sectionmain_actu.css'
import { useState,useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { library } from '@fortawesome/fontawesome-svg-core'
import { fas } from '@fortawesome/free-solid-svg-icons'
import Message from './Message'
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { createTheme,ThemeProvider } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import PhotoCamera from '@mui/icons-material/PhotoCamera';

library.add(fas)
const theme = createTheme({
	palette: {
		neutral:{
			color:'#fff',
		},
		text:{
			primary:'#fff', // 
			secondary:'#aaa', //
		},
		/*primary:{
			main:'#000', // Button color
		}*/
	},
  });
function Sectionmain_actu({auth,setAuth,indexPage,setindexPage}) {
	const [listMessage,setListMessage] = useState([]);
	const [listAnswer,setListAnswer] = useState([0]);
	const [targetMessage,settargetMessage] = useState(0);
	const [formText,setformText] = useState("Votre message ?");
	const [formFile,setformFile] = useState("");


	function getreply2(messageid,replyLevel,reply){
		if(listMessage.length!==0){
			let parametre = {
				sendMessageGloabal:1,
				buttonCommentaire:1,
				sendReply:1,
				
			}
			if(messageid === "all"){
				parametre={
					...parametre,
					buttonCommentaire:1,
					sendReply:0,
					replyLevel:replyLevel
				}
				let blockactusend=(
					<div id="blockactu">
						<div id="blockactu_send">
							<form>
							<ThemeProvider theme={theme}>
							<TextField color="neutral" className="formText" label="Message" onChange={(e)=>setformText(e.target.value)} value={formText} multiline/>
							<div>
								<IconButton color="primary" aria-label="upload picture" component="label">
									<input hidden accept="image/*" onChange={(e)=>setformFile(e.target.files[0])} type="file" id="formFile"/>
									<PhotoCamera />
								</IconButton>
								<Button color="primary" variant="contained" onClick={(e)=>sendMessage(e,false)}>Envoyer</Button>
							</div>
							</ThemeProvider>
							</form>
						</div>
					</div>);
				
				listMessage.forEach(element => {
					reply=(
					<>
						{reply}
						{<Message parametre={parametre} element={element} auth={auth} setListMessage={setListMessage} listMessage={listMessage} setListAnswer={setListAnswer} listAnswer={listAnswer} settargetMessage={settargetMessage} targetMessage={targetMessage}/>}
					</>)
				});
				reply=
				<section>
					{blockactusend}
					<div className='blockactu_fil'>
						{reply}
					</div>
				</section>
			}
			if(messageid === "one"){
				parametre={
					buttonCommentaire:1,
					sendReply:1,
					replyLevel:replyLevel
				};
				listMessage.forEach(element => {
					if(element._id===targetMessage){
						reply=(
							<>
							<button onClick={()=>settargetMessage(0)}>Retour</button>
							<Message parametre={parametre} element={element} auth={auth} setListMessage={setListMessage} listMessage={listMessage} setListAnswer={setListAnswer} listAnswer={listAnswer} settargetMessage={settargetMessage} targetMessage={targetMessage}/>
							</>
						);
						element.answer.forEach(element=>{
							reply=(
								<>
									{reply}
									{ getreply2(element,replyLevel+1) }
								</>);
						});
					}
				});
				reply=
				<section>
					<div className='blockactu_fil'>
						{reply}
					</div>
				</section>
			}
			if(messageid !== "one" && messageid!=="all"){
				let maxReply=2;
				parametre={
					buttonCommentaire:0,
					sendReply:1,
					replyLevel:replyLevel
				}
				if(replyLevel>=maxReply){
					parametre.sendReply=0;
					//Blocage formulaire reponse à partir de 3réponses
				}
				listAnswer.forEach(element => {
					if(element._id===messageid){
						reply=(
							<>
							{reply}
							{<Message parametre={parametre} element={element} auth={auth} setListMessage={setListMessage} listMessage={listMessage} setListAnswer={setListAnswer} listAnswer={listAnswer} settargetMessage={settargetMessage} targetMessage={targetMessage}/>}
							</>
						);
						if(replyLevel<maxReply){
						element.answer.forEach(element=>{
							reply=(
								<>
									{reply}
									{ getreply2(element,replyLevel+1) }
								</>);
						})
						}
					}
				});
			}
			return reply;
		}
		return (<section>Load...</section>);
	}
	function sendMessage(e){
		e.preventDefault();
		let objectData={
			message:formText,
			messageId:Date.now(),
			dateTime:Date.now(),
		}
		let formData= new FormData();
		formData.append('message',JSON.stringify(objectData));
		if(objectData.message!==""){
			//formData.append('image',e.target.parentElement.children[0].children[0].files[0]);
			formData.append('image',formFile);
		}
		sendMessageApi(formData).then((result)=>{
			getmes();
		});
	}
	async function sendMessageApi(formData){
		return await fetch("http://localhost:3000/api/message/send",{
			headers: {
				'Authorization': "Bearer "+auth[2]
			},
			method: 'POST',
			body:formData
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
	async function getMessageApi(){
		return await fetch("http://localhost:3000/api/message/get",{
			headers: {
				'Authorization': "Bearer "+auth[2]
			},
			method: 'POST',
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
	async function getAnswerApi(){
		return await fetch("http://localhost:3000/api/answer/get",{
			headers: {
				'Authorization': "Bearer "+auth[2]
			},
			method: 'POST',
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
	function getmes(){
		getMessageApi().then((result)=>{
			setListMessage(result);
		});
		/*getAnswerApi().then((result)=>{
			setListAnswer(result);
		});*/
	}
	useEffect(() => {
		getmes();
		
	}, [auth])
	return (
		targetMessage === 0 ?
		getreply2("all",0)
		: 
		getreply2("one",0)
	)
}

export default Sectionmain_actu