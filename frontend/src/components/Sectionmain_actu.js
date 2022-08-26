import '../styles/Sectionmain_actu.css'
import { useState,useEffect } from 'react'
import { library } from '@fortawesome/fontawesome-svg-core'
import { fas } from '@fortawesome/free-solid-svg-icons'
import Message from './Message'
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { createTheme,ThemeProvider } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import DeleteIcon from '@mui/icons-material/Delete';
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';

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
function Sectionmain_actu({auth,setAuth,indexPage,setindexPage,profilData,setprofilData}) {
	const [listMessage,setListMessage] = useState([]);
	const [listAnswer,setListAnswer] = useState([0]);
	const [tampontargetMessage,settampontargetMessage] = useState([{messageid:"",replyLevel:0}]);
	const [targetMessage,settargetMessage] = useState(tampontargetMessage[tampontargetMessage.length-1]);
	const [formText,setformText] = useState("Votre message ");
	const [formFile,setformFile] = useState("");
	const [openActuSend,setopenActuSend] = useState(0);
	function getBack(e){
		e.preventDefault();
		let bistampontargetMessage;
		bistampontargetMessage=tampontargetMessage;
		bistampontargetMessage.pop();
		console.log(bistampontargetMessage);
		settampontargetMessage(bistampontargetMessage);
		settargetMessage(bistampontargetMessage[bistampontargetMessage.length-1]);
	}
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
	function getreply2(messageid,replyLevel,boolEnd){
		
		if(listMessage.length!==0){
			let parametre = {
				sendMessageGloabal:1,
				buttonCommentaire:1,
				sendReply:1,
			}
			let reply;
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
							{
								openActuSend === 0 ?
								<form>
								<div>
								<ThemeProvider theme={theme}>
								
								<TextField color="neutral" className="formText" label="Message" onBlur={(e)=>setformText(e.target.value)} defaultValue={formText} multiline/>
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
								<Button color="primary" variant="contained" onClick={(e)=>sendMessage(e,false)}>Envoyer</Button>
								
								</div>
								</ThemeProvider>
								</div>
								</form>
								: openActuSend === 1 &&
								<p>Load...</p>
							}
						</div>
					</div>);
				
				listMessage.forEach(element => {
					reply=(
					<>
						{reply}
						{<Message parametre={parametre} element={element} auth={auth} setListMessage={setListMessage} listMessage={listMessage} setListAnswer={setListAnswer} listAnswer={listAnswer} settargetMessage={settargetMessage} targetMessage={targetMessage} settampontargetMessage={settampontargetMessage} tampontargetMessage={tampontargetMessage} profilData={profilData}/>}
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
					replyLevel:replyLevel,
					messageFocus:"messageFocus",
				};
				if(targetMessage.replyLevel===0){
					listMessage.forEach(element => {
						if(element._id===targetMessage.messageid){
							
							reply=(
								<>
								<IconButton onClick={(e)=>getBack(e)} color="primary" aria-label="Back" component="label">
									<KeyboardBackspaceIcon/>
								</IconButton>
								<Message parametre={parametre} element={element} auth={auth} setListMessage={setListMessage} listMessage={listMessage} setListAnswer={setListAnswer} listAnswer={listAnswer} settargetMessage={settargetMessage} targetMessage={targetMessage} settampontargetMessage={settampontargetMessage} tampontargetMessage={tampontargetMessage} profilData={profilData}/>
								</>
							);
							element.answer.forEach(result=>{
								if(element.answer[element.answer.length-1]===result) {
									boolEnd=true;
								}
								
								reply=(
									<>
										{reply}
										{ getreply2(result,replyLevel+1,boolEnd) }
									</>);
							});
						}
					});
				}
				else{
					//Aucun resultat dans la liste de Message recherche dans les réponses...
					parametre.replyLevel=targetMessage.replyLevel;
					listAnswer.forEach(element => {
						if(element._id===targetMessage.messageid){
							reply=(
								<>
								<IconButton onClick={(e)=>getBack(e)} color="primary" aria-label="Back" component="label">
									<KeyboardBackspaceIcon/>
								</IconButton>
								<Message parametre={parametre} element={element} auth={auth} setListMessage={setListMessage} listMessage={listMessage} setListAnswer={setListAnswer} listAnswer={listAnswer} settargetMessage={settargetMessage} targetMessage={targetMessage} settampontargetMessage={settampontargetMessage} tampontargetMessage={tampontargetMessage} profilData={profilData}/>
								</>
							);
							element.answer.forEach(result=>{
								if(element.answer[element.answer.length-1]===result) boolEnd=true;
								reply=(
									<>
										{reply}
										{ getreply2(result,parametre.replyLevel+1,boolEnd) }
									</>);
							});
						}
					});
				}
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
					replyLevel:replyLevel,
					messageFocus:"answerFocus",
				}
				if(replyLevel>=maxReply){
					parametre.sendReply=0;
					//Blocage formulaire reponse à partir de 3réponses
				}
				listAnswer.forEach(element => {
					if(element._id===messageid){
						if(boolEnd===true) {
							parametre.messageFocus="lastanswerFocus"
							
						};
						reply=(
							<>
							{reply}
							{<Message parametre={parametre} element={element} auth={auth} setListMessage={setListMessage} listMessage={listMessage} setListAnswer={setListAnswer} listAnswer={listAnswer} settargetMessage={settargetMessage} targetMessage={targetMessage} settampontargetMessage={settampontargetMessage} tampontargetMessage={tampontargetMessage} profilData={profilData}/>}
							</>
						);
						/*if(replyLevel<maxReply){
						element.answer.forEach(element=>{
							reply=(
								<>
									{reply}
									{ getreply2(element,replyLevel+1) }
								</>);
						})
						}*/
					}
				});
			}
			return reply;
		}
		return (<section>Load...</section>);
	}
	function sendMessage(e){
		e.preventDefault();
		setopenActuSend(1);
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
			getmes().then(()=>{
				setformText("");
				setformFile("");
				setopenActuSend(0);
			});
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
	async function getmes(){
		return getMessageApi().then((result)=>{
			setListMessage(result);
		});
	}
	useEffect(() => {
		getmes();
		
	}, [auth])
	return (
		targetMessage.messageid === "" ?
		getreply2("all",0)
		: 
		getreply2("one",0)
	)
}

export default Sectionmain_actu