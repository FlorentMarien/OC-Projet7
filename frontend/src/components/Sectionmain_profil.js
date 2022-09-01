import '../styles/Sectionmain_profil.css'
import Message from './Message'
import { useState,useEffect } from 'react'
import IconButton from '@mui/material/IconButton';
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
function Sectionmain_profil({auth,setAuth,indexPage,setindexPage,profilData,setprofilData}) {
	const [tampontargetMessage,settampontargetMessage] = useState([{messageid:"",replyLevel:0}]);
	const [targetMessage,settargetMessage] = useState(tampontargetMessage[tampontargetMessage.length-1]);
	const [targetPage,settargetPage] = useState(0);
	const [listMessage,setListMessage] = useState([]);
	const [listAnswer,setListAnswer] = useState([0]);
	const [targetCarrousel,settargetCarrousel] = useState(0);
	let timerCarrousel = 0;
	const [formFile,setformFile] = useState(0);
	function getBack(e){
		e.preventDefault();
		let bistampontargetMessage;
		bistampontargetMessage=tampontargetMessage;
		bistampontargetMessage.pop();
		console.log(bistampontargetMessage);
		settampontargetMessage(bistampontargetMessage);
		settargetMessage(bistampontargetMessage[bistampontargetMessage.length-1]);
	}
	function sendImg(e){
		e.preventDefault();
		let formData = new FormData();
		let text={
			name:"test",
			prename:"test"
		}
		for(let x = 0 ; x<formFile.length ; x++){
			formData.append('image',formFile[x]);
		}
		formData.append('text',JSON.stringify(text));
		sendImgApi(formData).then((result)=>{
			let newprofilData=profilData;
			newprofilData.imageArray=result;
			setprofilData(newprofilData);
		});
	}
	async function sendImgApi(formData){
		return await fetch("http://localhost:3000/api/auth/sendimg",{
			headers: {
				'Authorization': "Bearer "+auth[2]
			},
			method: 'POST',
			body: formData
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
	function galleryDisplayButton(e,boolLeave){
			e.stopPropagation();
			if(boolLeave===false){
				if(timer===0) activeCarrousel();
				document.getElementById("button-gallery").style.visibility="visible";
			}
			else if(boolLeave===true){
				clearInterval(timer);
				timer=0;
				document.getElementById("button-gallery").style.visibility="hidden";	
			}
	}
	let timer=0;
	function activeCarrousel(){
				timer=setInterval(function(){
					if(document.getElementById("img-userfocusgallery")!==null){
						let img=document.getElementById("img-userfocusgallery").src;
						let posimg=profilData.imageArray.indexOf(img);
						
						if(profilData.imageArray[posimg+1]!==undefined){
							document.getElementById("img-userfocusgallery").src=profilData.imageArray[posimg+1];
						}
						else{
							document.getElementById("img-userfocusgallery").src=profilData.imageArray[0];
						}
					}
				},2000);
			
			
	}
	function getuserAnswer(focusMessage,replyLevel=0,boolend){
		let userId=auth[1];
		let message,parentanswer=undefined;
		let parametre = {
			sendMessageGloabal:1,
			buttonCommentaire:1,
			sendReply:0,
			replyLevel:0,
			pageProfil:true,
		}
		let parametremessage={
			replyLevel:0,
			messageFocus:"messageOne",
			
		};
		let parametreanswer={
			replyLevel:2,
			messageFocus:"lastanswerFocus",
			getCommentaire:false
		};
		let parametreparentanswer={
			replyLevel:1,
			messageFocus:"messageFocus",
			getCommentaire:false
		};
		let parametrealoneanswer={
			replyLevel:1,
			messageFocus:"messageOne",
			getCommentaire:false
		}
		let reply;
		if(focusMessage==="all"){
			const resultlistanswer = listAnswer.filter(result => result.userId===userId);
			
			resultlistanswer.forEach((answer)=>{
				message=listMessage.find(result => result.answer.includes(answer._id));
				parentanswer=undefined;
				if(message===undefined){
					parentanswer=listAnswer.find(result => result.answer.includes(answer._id));
					if(parentanswer!==undefined){
						message=listMessage.find(result => result.answer.includes(parentanswer._id));
					}
				} 
				if(message!==undefined){
						reply=(
							<>
							{reply}
							<div className='blocklisteanswer'>
							{<Message parametre={parametremessage} element={message} auth={auth} setListMessage={setListMessage} listMessage={listMessage} setListAnswer={setListAnswer} listAnswer={listAnswer} settargetMessage={settargetMessage} targetMessage={targetMessage} settampontargetMessage={settampontargetMessage} tampontargetMessage={tampontargetMessage} profilData={profilData}/>}
							{
								parentanswer !== undefined &&
								<Message parametre={parametreparentanswer} element={parentanswer} auth={auth} setListMessage={setListMessage} listMessage={listMessage} setListAnswer={setListAnswer} listAnswer={listAnswer} settargetMessage={settargetMessage} targetMessage={targetMessage} settampontargetMessage={settampontargetMessage} tampontargetMessage={tampontargetMessage} profilData={profilData}/>
							}
							{<Message parametre={parentanswer !== undefined ? parametreanswer : parametrealoneanswer} element={answer} auth={auth} setListMessage={setListMessage} listMessage={listMessage} setListAnswer={setListAnswer} listAnswer={listAnswer} settargetMessage={settargetMessage} targetMessage={targetMessage} settampontargetMessage={settampontargetMessage} tampontargetMessage={tampontargetMessage} profilData={profilData}/>}
							</div>
							</>
							
						);
					
				}
			});
		}
		if(focusMessage==="one"){

		}
		return reply
	}
	function getuserMessage(focusMessage,replyLevel=0,boolEnd){
		let parametre = {
			sendMessageGloabal:1,
			buttonCommentaire:1,
			sendReply:0,
			replyLevel:0,
			pageProfil:true,
		}
		let listmessageprofil;
		if(focusMessage==="all"){
			parametre.messageFocus="messageAll";
			let listmessageprofil;
			listMessage.forEach(element => {
					listmessageprofil=(
					<>
						{listmessageprofil}
						{<Message parametre={parametre} element={element} auth={auth} setListMessage={setListMessage} listMessage={listMessage} setListAnswer={setListAnswer} listAnswer={listAnswer} settargetMessage={settargetMessage} targetMessage={targetMessage} settampontargetMessage={settampontargetMessage} tampontargetMessage={tampontargetMessage} profilData={profilData}/>}
					</>);
			});
			return listmessageprofil;
		}
		if(focusMessage==="one"){
			parametre.sendReply=1;
			parametre.replyLevel=targetMessage.replyLevel;
			parametre.messageFocus="messageAll";
			if(targetMessage.replyLevel===0){
				listMessage.forEach(element => {
					if(element._id===targetMessage.messageid){
						listmessageprofil=(
						<>
							<IconButton onClick={(e)=>getBack(e)} color="primary" aria-label="Back" component="label">
								<KeyboardBackspaceIcon/>
							</IconButton>
							{<Message parametre={parametre} element={element} auth={auth} setListMessage={setListMessage} listMessage={listMessage} setListAnswer={setListAnswer} listAnswer={listAnswer} settargetMessage={settargetMessage} targetMessage={targetMessage} settampontargetMessage={settampontargetMessage} tampontargetMessage={tampontargetMessage} profilData={profilData}/>}
						</>);
						if(element.answer.length !== 0){
							element.answer.forEach((Answerelement)=>{
								listmessageprofil=(
									<>
										{listmessageprofil}
										{getuserMessage(Answerelement,targetMessage.replyLevel+1,1)}
									</>
								);
							}
							);
						}
					}
				});
			}
		}
		if((focusMessage !== "all") && (focusMessage !=="one")){
			if(boolEnd===true) parametre.messageFocus="lastanswerFocus";
			else parametre.messageFocus="answerFocus";
			listAnswer.forEach(element => {
				if(element._id===focusMessage){
					parametre.replyLevel=replyLevel;
					if(replyLevel<2) parametre.sendReply=1;
					if(boolEnd === 1) {
						if(element.answer.length >= 1 ) parametre.messageFocus="messageFocus";
						else parametre.messageFocus="messageAll";
					};
					if(boolEnd === 2) parametre.messageFocus="answerFocus";
					if(boolEnd === 3) parametre.messageFocus="lastanswerFocus";
					listmessageprofil=(
					<>
						{listmessageprofil}
						{<Message parametre={parametre} element={element} auth={auth} setListMessage={setListMessage} listMessage={listMessage} setListAnswer={setListAnswer} listAnswer={listAnswer} settargetMessage={settargetMessage} targetMessage={targetMessage} settampontargetMessage={settampontargetMessage} tampontargetMessage={tampontargetMessage} profilData={profilData}/>}
					</>);
					let x=1;
					if(element.answer.length !== 0){
						element.answer.forEach((Answerelement)=>
							{
								if(x===element.answer.length) boolEnd=3
								else if(x===1) boolEnd=2;
								
								listmessageprofil=(
									<>
										
										{listmessageprofil}
										{ getuserMessage(Answerelement,replyLevel+1,boolEnd)}
										
									</>
								);
								if(x===element.answer.length) {
									listmessageprofil=(
										<div className='blocklisteanswer'>
											{listmessageprofil}
										</div>
									);
								}
								x++;
							}
						);
					}
				}
			});
		}
		return listmessageprofil;
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
		return getuserMessageApi().then((result)=>{
			setListMessage(result);
		});
	}
	async function getmesall(){
		return getMessageApi().then((result)=>{
			setListMessage(result);
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
	async function getanswer(){
		return getAnswerApi().then((result)=>{
			setListAnswer(result);
		});
	}

	useEffect(() => {
		if(targetPage===0){
			getmes();
			//getImgUser();
		}
		else{
			getmesall();
		}
		getanswer();

		return () => {
			clearTimeout(timer);
		};
	}, [auth])
	return (
		<section>
			{
				listMessage.length === 0 
				? 
				<>
					<p>Load...</p>
				</>

				: 1 &&
				<>
				<div id="blockprofil">
					<div id='usergallery' onMouseEnter={(e)=>{galleryDisplayButton(e,false)}} onMouseLeave={(e)=>{galleryDisplayButton(e,true)}}>
						<div id="img-gallery">
							{
								profilData.imageArray.length !== 0 ?
								<>
								<img id="img-userfocusgallery" src={ profilData.imageArray[0] } alt={profilData.name} />
								</>
								: 
								<IconButton>
									<PhotoCamera/>
								</IconButton>
							}
						</div>
						<div id='button-gallery'>
							<ButtonGroup variant="outlined" aria-label="outlined button group" orientation="vertical">
								<Button component="label">
									Ajouter
									<input hidden accept="image/*" onChange={(e)=>setformFile(e.target.files)} type="file" id="formFile" multiple/>
								</Button>
								{
									formFile !==0 &&
									<Button onClick={(e)=>{sendImg(e)}}>Envoyer</Button>
								}
								<Button onClick={(e)=>{setindexPage(4)}}>Parcourir</Button>
							</ButtonGroup>
						</div>
						
					</div>
					<div className='userprofil'>
					{
						profilData[0]!==0 &&
						<>
						<img src={ profilData.imageUrl } alt={profilData.name}/>
						<ul>
							<li>Nom: { profilData.name } Prenom: { profilData.prename }</li>
						</ul>
						</>
					}
					</div>
				</div>
				<div>
					<div id="navprofil">
						<ButtonGroup variant="outlined" aria-label="outlined button group" >
							<Button onClick={(e)=>{if(targetPage!==0){settargetPage(2);getmes().then(()=>settargetPage(0))}}}>Message</Button>
							<Button onClick={(e)=>{if(targetPage!==1){settargetPage(2);getmesall().then(()=>settargetPage(1))}}}>Réponse</Button>
						</ButtonGroup>
					</div>
					
				</div>
				<div id="blocklistmessageprofil">
					{
						targetPage === 0 ?
							targetMessage.messageid === "" ?
								getuserMessage("all")
							:
								getuserMessage("one")
						: targetPage === 1 ?
							targetMessage.messageid === "" ?
								getuserAnswer("all")
							:
								getuserMessage("one")
						: <p>Load...</p>
					}
				</div>
				</>
			
		}
		</section>
	)
}

export default Sectionmain_profil