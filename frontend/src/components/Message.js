import '../styles/Message.css'
import { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
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
import { createTheme,ThemeProvider } from '@mui/material/styles';

library.add(fas)
function Message({parametre,element,auth,setListMessage,listMessage,setListAnswer,listAnswer,settargetMessage,targetMessage}) {
	const [disableButtonLike,setdisableButtonLike] = useState(element.arrayDislike.includes(auth[1]));
	const [disableButtonDislike,setdisableButtonDislike] = useState(element.arrayLike.includes(auth[1]));
	const [formFile,setformFile] = useState("");
	const [formText,setformText] = useState("");
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
	function getimgpreview(){
		let urlFile = URL.createObjectURL(formFile);
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
				e.target.closest("div.MuiButtonGroup-root").children[0].children[1].textContent=result.Like;
				e.target.closest("div.MuiButtonGroup-root").children[1].children[1].textContent=result.Dislike;
				element.Like=result.Like;
				element.Dislike=result.Dislike
				if(element.arrayLike.includes(auth[1])) element.arrayLike.splice(auth[1],1);
				if(element.arrayDislike.includes(auth[1])) element.arrayDislike.splice(auth[1],1);
				
				setdisableButtonLike(false);
				setdisableButtonDislike(false);
			}
		});
	}
	async function sendLikeApi(formData,typemessage){
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
			getMessageApi().then((result)=>{
			setListMessage(result);
		});
		}
		if(answer===1){
		getAnswerApi().then((result)=>{
			setListAnswer(result);
		});
		}
	}
	function getCommentaire(e){
		if(parametre.replyLevel===0){
			e.preventDefault();
			let messageid=e.target.closest("div.message").attributes["messageid"].value;
			settargetMessage(messageid);
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
		<div className={'message replylevel'+parametre.replyLevel} messageid={element._id}>
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
				{
				parametre.sendReply === 1 &&
				
				<div className='sendreply'>
					<ThemeProvider theme={theme}>
					<TextField color="neutral" className="formText" label="Message" onChange={(e)=>setformText(e.target.value)} value={formText} multiline/>
					<div className='sendreply_uploadimg'>
					{
					formFile === "" ?
					<>
						<IconButton color="primary" aria-label="upload picture" component="label">
							<input hidden accept="image/*" onChange={(e)=>setformFile(e.target.files[0])} type="file" id="formFile"/>
							<PhotoCamera />
						</IconButton>
					</>
					: 
					<>
						{getimgpreview()}
					</>
					}
					<Button color="primary" variant="contained" onClick={(e)=>sendAnswer(e,parametre.replyLevel)}>Envoyer</Button>
					</div>
					</ThemeProvider>
				</div>
				}
				
				<div className='answer'>
				<ButtonGroup variant="text" aria-label="text button group">
					<div className='container_information'>
					<IconButton disabled={disableButtonLike} color="primary" button-type="button_like" onClick={(e)=>{console.log(e.target);sendlike(e)}} aria-label="Like" component="label">
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
					<IconButton color="primary" aria-label="Show commentary" onClick={(e)=>{getCommentaire(e)}} component="label">
						<CommentIcon />
					</IconButton>
					<p className="informationBox">{element.answer.length}</p>
					</div>
					<div className='container_information'>
					<IconButton color="primary" aria-label="Add commentary" component="label">
						<AddCommentIcon />
					</IconButton>
					</div>
				</ButtonGroup>
				</div>
			</div>
	</>
	)
}

export default Message