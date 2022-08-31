import * as React from 'react';
import '../styles/Message.css'
import { useState } from 'react'
import { library } from '@fortawesome/fontawesome-svg-core'
import { fas } from '@fortawesome/free-solid-svg-icons'
import ButtonGroup from '@mui/material/ButtonGroup';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import ThumbUpOffIcon from '@mui/icons-material/ThumbUpAlt';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import CommentIcon from '@mui/icons-material/Comment';
import AddCommentIcon from '@mui/icons-material/AddComment';
import TextField from '@mui/material/TextField';
import DeleteIcon from '@mui/icons-material/Delete';
import SettingsIcon from '@mui/icons-material/Settings';
import { createTheme,ThemeProvider } from '@mui/material/styles';

library.add(fas)
function Message({parametre,element,auth,setListMessage,listMessage,setListAnswer,listAnswer,settargetMessage,targetMessage,settampontargetMessage,tampontargetMessage,profilData}) {
	const [disableButtonLike,setdisableButtonLike] = useState(element.arrayDislike.includes(auth[1]));
	const [disableButtonDislike,setdisableButtonDislike] = useState(element.arrayLike.includes(auth[1]));
	const [disablegetCommentaire,setdisablegetCommentaire] = useState(parametre.getCommentaire!==undefined ? true : false);
	const [formFile,setformFile] = useState("");
	const [formText,setformText] = useState("");
	const [openReply,setopenReply] = useState(0);
	const [openParametre,setopenParametre] = useState(0);
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
	function exitOnBlur(e){
		if(e.target.closest("div.message") !== undefined){
			if(openParametre!==0) setopenParametre(0);
			if(openReply!==0) setopenReply(0);
		}
	}
	async function getuserMessageApi(){
		return await fetch("http://localhost:3000/api/message/getuserMessage",{
			headers: {
				'Authorization': "Bearer "+auth[2]
			},
			method: 'GET',
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
	function modifAnswer(e,replyLevel=0){
		e.preventDefault();
		setopenReply(3);
		let objectData={
			messageId:element._id,
			message:formText,
			dateTime:element.dateTime,
		}
		let formData= new FormData();
		formData.append('message',JSON.stringify(objectData));
		if(typeof formFile==="object"){
			// Image modifié
			formData.append('image',formFile);
		}
		else if(formFile===""){
			// Ajout image vide pour reset
			formData.append('image',"");
		}
		
		modifMessageApi(formData).then((result)=>{
				if(parametre.replyLevel===0 && parametre.pageProfil===true){
					getuserMessageApi().then((result)=>{
						setopenReply(0);
						setListMessage(result);
					})
				}
				else if(parametre.replyLevel===0) getmes(1,0).then(()=>{setopenReply(0);});
				else getmes(0,1).then(()=>{setopenReply(0);});
		});
	}
	async function modifMessageApi(formData){
		let adresse;
		parametre.replyLevel===0 ? adresse="http://localhost:3000/api/message/modifMessage" : adresse="http://localhost:3000/api/answer/modifMessage";
		return await fetch(adresse,{
			headers: {
				'Authorization': "Bearer "+auth[2]
			},
			method: 'PUT',
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
	function delMessage(e){
		e.preventDefault();
		let target = e.target.closest('div.message');
		let objectSend={
			messageId:target.attributes['messageid'].value,
			replyLevel:parametre.replyLevel
		}
		if(element._id===target.attributes["messageid"].value) target.children[0].children[1].children[0].textContent="Suppresion en cours";
		senddelMessage(JSON.stringify(objectSend)).then((result)=>{
			setopenParametre(0);
			if(parametre.replyLevel===0) {
				if(parametre.pageProfil===true){
					getuserMessageApi().then((result)=>{
						if(targetMessage.messageid===objectSend.messageId) {
							settargetMessage(tampontargetMessage[0]);
						}
						setListMessage(result);
					})
				}
				else{
					getmes(1,0).then(()=>{
						if(targetMessage.messageid===objectSend.messageId) settargetMessage(0);
					});
				}
			}
			else {
				if(parametre.replyLevel===1) {
					if(parametre.pageProfil===true){
						getuserMessageApi().then((result)=>{
							if(targetMessage.messageid===objectSend.messageId) settargetMessage(0);
							setListMessage(result);
						})
					}
					else getmes(1,0);
					getmes(0,1);
				}
				else getmes(0,1);
			}
		})
	}
	async function senddelMessage(formData){
		let adresse;
		parametre.replyLevel===0 ? adresse="http://localhost:3000/api/message/deleteMessage" : adresse="http://localhost:3000/api/answer/deleteMessage";
		return await fetch(adresse,{
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json',
				'Authorization': "Bearer "+auth[2]
			},
			method: 'DELETE',
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
	function getimgpreview(){
		let urlFile;
		if(typeof formFile==="object"){
			urlFile = URL.createObjectURL(formFile);
		}
		else urlFile=formFile;
		
		return (
		<div>
		<span className='container_uploadimg'>
		<img src={urlFile} alt="Image preview"/>
		
		<IconButton onClick={(e)=>setformFile("")} color="primary" aria-label="delete picture" component="label">
			<DeleteIcon/>
		</IconButton>
		</span>
		</div>
		)
	}
	function sendlike(e){
		let likevalue=2;
		e.preventDefault();
		if(element.arrayLike.includes(auth[1])||element.arrayDislike.includes(auth[1])){
			likevalue=0;
		}
		else if(e.target.closest("label").attributes['button-type'].value === "button_like") likevalue=1;
		else likevalue=-1
		let messageid=e.target.closest("div.message").attributes["messageid"].value;
		let formData = {
			messageid:messageid,
			like:likevalue,
		};
		sendLikeApi(JSON.stringify(formData)).then((result)=>{
			// Like: 1
			if(likevalue===1) {
				e.target.closest("div.container_information").children[1].textContent=result.Like;
				element.arrayLike.push(auth[1]);
				element.Like=result.Like;
				setdisableButtonDislike(true);
			}
			if(likevalue===-1){ 
				e.target.closest("div.container_information").children[1].textContent=result.Dislike;
				
				element.arrayDislike.push(auth[1]);
				element.Dislike=result.Dislike;;
				setdisableButtonLike(true);
			}
			if(likevalue===0) {
				e.target.closest("div.MuiButtonGroup-root").children[0].children[0].children[1].textContent=result.Like;
				e.target.closest("div.MuiButtonGroup-root").children[0].children[1].children[1].textContent=result.Dislike;
				element.Like=result.Like;
				element.Dislike=result.Dislike
				if(element.arrayLike.includes(auth[1])) element.arrayLike.splice(auth[1],1);
				if(element.arrayDislike.includes(auth[1])) element.arrayDislike.splice(auth[1],1);
				
				setdisableButtonLike(false);
				setdisableButtonDislike(false);
			}
		});
	}
	async function sendLikeApi(formData){
		let adresse;
		parametre.replyLevel===0 ? adresse="http://localhost:3000/api/message/sendlike" : adresse="http://localhost:3000/api/answer/sendlike";
		return await fetch(adresse,{
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json',
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
	function sendAnswer(e,replyLevel=0){
		e.preventDefault();
		
		let objectData={
			message:e.target.parentElement.children[0].value,
			messageId:Date.now(),
			dateTime:Date.now(),
		}
		
		objectData={
			...objectData,
			replyLevel:replyLevel,
			answer:e.target.closest("div.message").attributes["messageid"].value,
			message:formText,
		}
		let formData= new FormData();
		formData.append('message',JSON.stringify(objectData));
		if(formFile!==""){
			formData.append('image',formFile);
		}
		console.log(formData);
		sendAnswerApi(formData).then((result)=>{
				element.answer.push(result.answerId);
				getmes(0,1);
			});
	}
	async function sendAnswerApi(formData){
		return await fetch("http://localhost:3000/api/answer/send",{
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
	async function getmes(message,answer){
		if(message===1){
			return getMessageApi().then((result)=>{
			setListMessage(result);
		});
		}
		if(answer===1){
			return getAnswerApi().then((result)=>{
			setListAnswer(result);
		});
		}
	}
	function getCommentaire(e){
		if(openReply===1) setopenReply(0);
		if(openParametre===1) setopenParametre(0);
		if(parametre.replyLevel<2){
			e.preventDefault();
			let messageid=e.target.closest("div.message").attributes["messageid"].value;
			let bistampontargetMessage=tampontargetMessage;
			bistampontargetMessage.push({messageid:messageid,replyLevel:parametre.replyLevel});
			console.log(bistampontargetMessage);
			settampontargetMessage(bistampontargetMessage);
			settargetMessage(bistampontargetMessage[bistampontargetMessage.length-1]);
			getmes(0,1);
		}
	}
	function getIntervalDate(dateTime){
		dateTime=Math.round((new Date(Date.now()) - new Date(dateTime).getTime())/1000);
		if(dateTime<60) return "Posté il y a "+dateTime+" secondes";
		else if (dateTime>=60 && dateTime<3600) return "Posté il y a "+Math.round(dateTime/60)+" minutes";
		else if (dateTime>=3600 && dateTime<(3600*24)) return "Posté il y a "+Math.round(dateTime/3600)+" heures";
		else if (dateTime>=(3600*24)) return "Posté il y a "+Math.round(dateTime/(3600*24))+" jours";
		else return "Erreur";
	}
	return (
	<>
		<div className={'message replylevel'+parametre.replyLevel+" "+parametre.messageFocus} messageid={element._id} onMouseLeave={(e)=>{exitOnBlur(e)}}>
			<div className='message_content'>								
				<div className='userInfo'>
					<img src={element.userImageUrl} alt={"Image de "+element.userName + " "+element.userPrename}/>
					<p>{element.userName} {element.userPrename}</p>
				</div>
					<div className='userMessage'>
						<p className='userMessage_ptext'>{element.message}</p>
						<p className='userMessage_pdate'>
							{
								getIntervalDate(element.dateTime)
							}
						</p>
					</div>
					{
						element.imageUrl &&
						<img src={element.imageUrl} alt={"Image de "+element.userName+" "+element.userPrename}/>
					}
				</div>
				<div className='answer'>
				<ButtonGroup variant="text" aria-label="text button group">
					<div>
					<div className='container_information'>
					<IconButton disabled={disableButtonLike} color="primary" button-type="button_like" onClick={(e)=>{sendlike(e)}} aria-label="Like" component="label">
						<ThumbUpOffIcon />
					</IconButton>
					<p className="informationBox">{element.Like}</p>
					</div>
					<div className='container_information'>
					<IconButton disabled={disableButtonDislike} color="primary" button-type="button_dislike" onClick={(e)=>{sendlike(e)}}aria-label="Dislike" component="label">
						<ThumbDownIcon />
					</IconButton>
					<p className="informationBox">{element.Dislike}</p>
					</div>
					<div className='container_information'>
					<IconButton disabled={disablegetCommentaire} color="primary" aria-label="Show commentary" onClick={(e)=>{getCommentaire(e)}} component="label">
						<CommentIcon />
					</IconButton>
					<p className="informationBox">{element.answer.length}</p>
					</div>
					{
						parametre.sendReply === 1 &&
						<div className='container_information'>
							<IconButton color="primary" aria-label="Add commentary" onClick={(e)=>{setopenReply(openReply === 1 ? 0 : 1)}} component="label">
								<AddCommentIcon />
							</IconButton>
						</div>
					}
					</div>
					{
					(element.userId === auth[1] || profilData.adminLevel===1) &&
					<div className='container_parametre'>
						<IconButton color="primary" aria-label="delete message"  onClick={(e)=>{setopenParametre(openParametre === 0 ? 1 : 0)}} component="label">
							<SettingsIcon/>
						</IconButton>
						{
							openParametre === 1  &&
							<div className="popupParametre" onMouseLeave={(e)=>{setopenParametre(0);e.target.closest("div.message")}}>
								<ul>
									<li><button onClick={(e)=>{delMessage(e);}}>Delete</button></li>
									<li><button onClick={(e)=>{
										setopenReply(2);
										setformText(element.message);
										e.target.closest("div.message").children[0].children.length === 3 &&
										setformFile(e.target.closest("div.message").children[0].children[2].src);
										}}>Edit</button></li>
								</ul>
							</div>
						}
					</div>
					}
				</ButtonGroup>
			</div>	
			{
				openReply === 1 || openReply === 2 ?
				<div className='sendreply'>
					<ThemeProvider theme={theme}>
					<TextField color="neutral" className="formText" label="Message" onChange={(e)=>setformText(e.target.value)} value={formText} multiline/>
					<div className='sendreply_uploadimg'>
					{
					formFile === "" ?
						<IconButton color="primary" aria-label="upload picture" component="label">
							<input hidden accept="image/*" onChange={(e)=>setformFile(e.target.files[0])} type="file" id="formFile"/>
							<PhotoCamera />
						</IconButton>
					: 
					<>
						{getimgpreview()}
					</>
					}
					{
						openReply === 1 ?
						<Button color="primary" variant="contained" onClick={(e)=>sendAnswer(e,parametre.replyLevel)}>Envoyer</Button>
						: openReply === 2 &&
						<Button color="primary" variant="contained" onClick={(e)=>modifAnswer(e,parametre.replyLevel)}>Modifier</Button>
					}
					
					</div>
					</ThemeProvider>
				</div>
				: openReply === 3 &&
				<div className='sendreply'>Load...</div>
				
			}
		</div>
	</>
	)
}

export default Message