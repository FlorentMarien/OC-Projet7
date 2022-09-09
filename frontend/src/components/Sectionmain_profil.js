import '../styles/Sectionmain_profil.css'
import Message from './Message'
import { useState,useEffect } from 'react'
import IconButton from '@mui/material/IconButton';
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
function Sectionmain_profil({auth,setAuth,indexPage,setindexPage,profilData,setprofilData,targetRechercheUser,settargetRechercheUser}) {
	const [tampontargetMessage,settampontargetMessage] = useState([{messageid:"",replyLevel:0}]);
	const [targetMessage,settargetMessage] = useState(tampontargetMessage[tampontargetMessage.length-1]);
	const [targetPage,settargetPage] = useState(0);
	let [changeUpdate,setchangeUpdate] = useState(0);
	let [listMessage,setListMessage] = useState([]);
	let [listtargetMessage,setlisttargetMessage] = useState([]);
	const [listAnswer,setListAnswer] = useState([0]);
	let timer=0;
	const [formFile,setformFile] = useState(0);
	const [profilTarget,setprofilTarget] = useState(0);
	//targetRechercheUser
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
		
		for(let x = 0 ; x<formFile.length ; x++){
			formData.append('image',formFile[x]);
		}
		sendImgApi(formData).then((result)=>{
			let newprofilData=profilTarget;
			newprofilData.imageArray=result;
			setprofilData(newprofilData);
			setformFile(0);
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
				if(targetRechercheUser.userid===auth[1]){
					document.getElementById("button-gallery").style.visibility="visible";
				}
			}
			else if(boolLeave===true){
				if(targetRechercheUser.userid===auth[1]){
					document.getElementById("button-gallery").style.visibility="hidden";
				}
			}
	}
	function getuserAnswer(focusMessage,replyLevel=0,boolend){
		let userId=targetRechercheUser.userid;
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
			if(resultlistanswer.length<=0){
				reply=(
					<p>Aucune réponse de l'utilisateur</p>
				);
			}
			else{
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
								{<Message parametre={parametremessage} element={message} auth={auth} setListMessage={setListMessage} listMessage={listMessage} setListAnswer={setListAnswer} listAnswer={listAnswer} settargetMessage={settargetMessage} targetMessage={targetMessage} settampontargetMessage={settampontargetMessage} tampontargetMessage={tampontargetMessage} profilData={profilTarget}/>}
								{
									parentanswer !== undefined &&
									<Message parametre={parametreparentanswer} element={parentanswer} auth={auth} setListMessage={setListMessage} listMessage={listMessage} setListAnswer={setListAnswer} listAnswer={listAnswer} settargetMessage={settargetMessage} targetMessage={targetMessage} settampontargetMessage={settampontargetMessage} tampontargetMessage={tampontargetMessage} profilData={profilTarget}/>
								}
								{<Message parametre={parentanswer !== undefined ? parametreanswer : parametrealoneanswer} element={answer} auth={auth} setListMessage={setListMessage} listMessage={listMessage} setListAnswer={setListAnswer} listAnswer={listAnswer} settargetMessage={settargetMessage} targetMessage={targetMessage} settampontargetMessage={settampontargetMessage} tampontargetMessage={tampontargetMessage} profilData={profilTarget}/>}
								</div>
								</>
								
							);
						
					}
				});
			}
		}
		if(focusMessage==="one"){

		}
		return reply
	}
	function getuserMessage(focusMessage,replyLevel=0,boolEnd){
		let parametre = {
			sendMessageGloabal:1,
			buttonCommentaire:1,
			sendReply:1,
			replyLevel:0,
			pageProfil:true,
		};
		let parametreparentanswer={
			replyLevel:1,
			messageFocus:"messageFocus",
			getCommentaire:false,
			sendReply:1,
		};
		let parametreanswer={
			replyLevel:2,
			messageFocus:"messageFocus",
			getCommentaire:false,
			sendReply:0,
		};
		
		let listmessageprofil;
		if(focusMessage==="all"){
			parametre.messageFocus="messageAll";
			if(listMessage[0]!==-1 && listMessage.length>0){
				for(let x=0;x<listMessage.length;x++){
					if(listMessage[x].userId!==undefined){
						listmessageprofil=(
							<>
								{listmessageprofil}
								<div className='listMessage'>
								{<Message key={listMessage[x]._id} changeUpdate={changeUpdate} setchangeUpdate={setchangeUpdate} parametre={parametre} element={listMessage[x]} auth={auth} setListMessage={setListMessage} listMessage={listMessage} setListAnswer={setListAnswer} listAnswer={listAnswer} settargetMessage={settargetMessage} targetMessage={targetMessage} settampontargetMessage={settampontargetMessage} tampontargetMessage={tampontargetMessage} profilData={profilTarget}/>}
								</div>
							</>);
					}
					else{
						//[0] Parent // [1] Reponse if lenght = 2 // [2] Sous reponse de [1][0] // [3] Sous reponse de [1][1]
						let listparentmessageprofil;
						let listparent;
						for(let y=0;y<2;y++){
							if(y===1){
								for(let z=0;z<listMessage[x].answerArray[y].length;z++){
										//Recupere une réponse avec les réponses associées
										let verif=false;
										listparentmessageprofil="";
											for(let w=0;w<listMessage[x].answerArray[(z+2)].length;w++){
												if(listMessage[x].answerArray[z+2][w].userId===targetRechercheUser.userid){
													
													listparentmessageprofil=(
													<>
														{listparentmessageprofil}
														{<Message key={listMessage[x].answerArray[z+2][w]._id} changeUpdate={changeUpdate} setchangeUpdate={setchangeUpdate} parametre={parametreanswer} element={listMessage[x].answerArray[z+2][w]} auth={auth} setListMessage={setListMessage} listMessage={listMessage} setListAnswer={setListAnswer} listAnswer={listAnswer} settargetMessage={settargetMessage} targetMessage={targetMessage} settampontargetMessage={settampontargetMessage} tampontargetMessage={tampontargetMessage} profilData={profilTarget}/>}
													</>);
													verif=true;
												}
											}
											if(verif===true ){
												listparentmessageprofil=(
													<>
														{<Message key={listMessage[x].answerArray[y][z]._id} changeUpdate={changeUpdate} setchangeUpdate={setchangeUpdate} parametre={parametreparentanswer} element={listMessage[x].answerArray[y][z]} auth={auth} setListMessage={setListMessage} listMessage={listMessage} setListAnswer={setListAnswer} listAnswer={listAnswer} settargetMessage={settargetMessage} targetMessage={targetMessage} settampontargetMessage={settampontargetMessage} tampontargetMessage={tampontargetMessage} profilData={profilTarget}/>}
														{listparentmessageprofil}
													</>);
											}
											else if(listMessage[x].answerArray[y][z].userId===targetRechercheUser.userid){
												listparentmessageprofil=(
													<>
														{<Message key={listMessage[x].answerArray[y][z]._id} changeUpdate={changeUpdate} setchangeUpdate={setchangeUpdate} parametre={parametreparentanswer} element={listMessage[x].answerArray[y][z]} auth={auth} setListMessage={setListMessage} listMessage={listMessage} setListAnswer={setListAnswer} listAnswer={listAnswer} settargetMessage={settargetMessage} targetMessage={targetMessage} settampontargetMessage={settampontargetMessage} tampontargetMessage={tampontargetMessage} profilData={profilTarget}/>}
													</>);
											}
											listparent=(
												<>
												{listparent}
												<div className='listAnswer'>
												{listparentmessageprofil}
												</div>
												</>
											);
								}
								listmessageprofil=(
									<>
									{listmessageprofil}
									<div className='listMessage'>
										{listparent}
									</div>
									</>
								);
							}
							else{
								listparent=(
									<>
									{<Message key={listMessage[x].answerArray[0][0]._id} changeUpdate={changeUpdate} setchangeUpdate={setchangeUpdate} parametre={parametre} element={listMessage[x].answerArray[0][0]} auth={auth} setListMessage={setListMessage} listMessage={listMessage} setListAnswer={setListAnswer} listAnswer={listAnswer} settargetMessage={settargetMessage} targetMessage={targetMessage} settampontargetMessage={settampontargetMessage} tampontargetMessage={tampontargetMessage} profilData={profilTarget}/>}
									</>
								);
							}
						}
					}
				}
			}
			else{
				listmessageprofil=<p>Aucun message de l'utilisateur</p>
			}
			return listmessageprofil;
		}
		if(focusMessage==="one"){
			let reply;
			parametre.sendReply=1;
			parametre.replyLevel=targetMessage.replyLevel;
			parametre.messageFocus="messageAll";
			parametre.getCommentaire=false;
			//console.log(listtargetMessage[0].answerArray.length);
			//console.log("test:"+listtargetMessage);
			if(listtargetMessage[0].answerArray.length > 0){
				reply=(
					<>
					<IconButton onClick={(e)=>settargetMessage({messageid:"",replyLevel:0})} color="primary" aria-label="Back" component="label">
								<KeyboardBackspaceIcon/>
					</IconButton>
					{<Message key={listtargetMessage[0].answerArray[0][0]._id} changeUpdate={changeUpdate} setchangeUpdate={setchangeUpdate} parametre={parametre} element={listtargetMessage[0].answerArray[0][0]} auth={auth} setListMessage={setListMessage} listMessage={listMessage} setListAnswer={setListAnswer} listAnswer={listAnswer} settargetMessage={settargetMessage} targetMessage={targetMessage} settampontargetMessage={settampontargetMessage} tampontargetMessage={tampontargetMessage} profilData={profilTarget}/>}
					</>
				);
				if(listtargetMessage[0].answerArray[0][0].answer.length>0){
					let replylvl1,replylvl2;
					for(let x=0;x<listtargetMessage[0].answerArray[1].length;x++){
						replylvl1="";
						replylvl2="";
						replylvl1=(
							<>
							{replylvl1}
							{<Message key={listtargetMessage[0].answerArray[1][x]._id} changeUpdate={changeUpdate} setchangeUpdate={setchangeUpdate} parametre={parametreparentanswer} element={listtargetMessage[0].answerArray[1][x]} auth={auth} setListMessage={setListMessage} listMessage={listMessage} setListAnswer={setListAnswer} listAnswer={listAnswer} settargetMessage={settargetMessage} targetMessage={targetMessage} settampontargetMessage={settampontargetMessage} tampontargetMessage={tampontargetMessage} profilData={profilTarget}/>}
							</>
						);
						if(listtargetMessage[0].answerArray[1][x].answer.length>0){					
							for(let y=0;y<listtargetMessage[0].answerArray[x+2].length;y++){
								replylvl2=(
									<>
										{replylvl2}
										{<Message key={listtargetMessage[0].answerArray[x+2][y]._id} changeUpdate={changeUpdate} setchangeUpdate={setchangeUpdate} parametre={parametreanswer} element={listtargetMessage[0].answerArray[x+2][y]} auth={auth} setListMessage={setListMessage} listMessage={listMessage} setListAnswer={setListAnswer} listAnswer={listAnswer} settargetMessage={settargetMessage} targetMessage={targetMessage} settampontargetMessage={settampontargetMessage} tampontargetMessage={tampontargetMessage} profilData={profilTarget}/>}
									</>
								);					
							}
						}
						reply=(
							<>
							{reply}
							<div className="listAnswer">
							{replylvl1}
							{replylvl2}
							</div>
							</>
						);
					}
				}
				return reply;
			}	
		}
		return listmessageprofil;
	}
	async function getuserMessageApi(objData){
		return await fetch("http://localhost:3000/api/message/getuserMessage",{
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json',
				'Authorization': "Bearer "+auth[2]
			},
			method: 'POST',
			body:objData
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
		return await getuserMessageApi(JSON.stringify(targetRechercheUser)).then((result)=>{
			//setlisttargetMessage([]);
			if(result.length===0) setListMessage([-1]);
			else setListMessage(result);
		});
	}
	async function getmesall(){
		return await getMessageApi().then((result)=>{
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
	async function getMessageByIdApi(dataId){
		return await fetch("http://localhost:3000/api/message/getMessageById",{
			headers: {
				'Authorization': "Bearer "+auth[2],
				'Accept': 'application/json',
				'Content-Type': 'application/json',
			},
			method: 'POST',
			body:dataId,
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
	async function getMessageById(){
		return await getMessageByIdApi(JSON.stringify({_id:targetMessage.messageid})).then((result)=>{
			//setListMessage([]);
			if(result.length===0) setlisttargetMessage([-1]);
			else setlisttargetMessage(result);
			
		});
	}
	async function getanswer(){
		return await getAnswerApi().then((result)=>{
			setListAnswer(result);
		});
	}
	useEffect(() => {
		timer=setInterval(() => {
			if(document.getElementById("img-userfocusgallery")!==null){
				let img=document.getElementById("img-userfocusgallery").src;
				let posimg=profilTarget.imageArray.indexOf(img);
				if(profilTarget.imageArray[posimg+1]!==undefined){
					document.getElementById("img-userfocusgallery").src=profilTarget.imageArray[posimg+1];
				}
				else{
					document.getElementById("img-userfocusgallery").src=profilTarget.imageArray[0];
				}
			}
		},2000);
		return () => {
			clearInterval(timer);
		};
	}, [profilTarget])
	
	useEffect(() => {
		setListMessage([]);
		setlisttargetMessage([]);
		async function getUser(objData){
				return await fetch("http://localhost:3000/api/auth/getlogin",{
					headers: {
						'Accept': 'application/json',
						'Content-Type': 'application/json',
						'Authorization': "Bearer "+auth[2]
					},
					method: 'POST',
					body:objData
				  })
				  .then(function(res) { 
					return res.json();
				  })
				  .then(function(result) {
					return result;
				  })
				  .catch(function(err) {
					return err;
				  });
		}
		getUser(JSON.stringify(targetRechercheUser)).then((result)=>{
				if(!result.error){
					setprofilTarget({
						state:1,
						name:result.name,
						prename:result.prename,
						imageUrl:result.imageUrl,
						adminLevel: result.adminLevel,
						imageArray: result.imageArray,
						email:result.email
					});
				}
				else{
					throw result;
				}
		});
		
		if(targetMessage.messageid!=="") 
		{
			getMessageById();
		}
		else{
			getmes();	
		}
	}, [targetMessage,targetRechercheUser,changeUpdate])
	
	return (
		<section>
			{
				(profilTarget === 0 ) ?
				<p>Load...</p>
				:
				<>
				<div id="blockprofil">
					<div id='usergallery' onMouseEnter={(e)=>{galleryDisplayButton(e,false)}} onMouseLeave={(e)=>{galleryDisplayButton(e,true)}}>
						<div id="img-gallery">
							{
								profilTarget.imageArray.length !== 0 ?
								<>
								<img id="img-userfocusgallery" src={ profilTarget.imageArray[0] } alt={profilTarget.name} />
								</>
								: 
								<IconButton>
									<PhotoCamera/>
								</IconButton>
							}
						</div>
						{
						targetRechercheUser.userid===auth[1] &&
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
						}
						
					</div>
					<div className='userprofil'>
					{
						profilTarget[0]!==0 &&
						<>
						<img src={ profilTarget.imageUrl } alt={profilTarget.name}/>
						<ul>
							<li>Nom: { profilTarget.name } Prenom: { profilTarget.prename }</li>
						</ul>
						</>
					}
					</div>
				</div>
				
				<div id="blocklistmessageprofil">
					{
						listMessage.length > 0 ?
							targetMessage.messageid === "" 
							? getuserMessage("all")
							: <p>Load...</p>

						: (listtargetMessage.length > 0 && targetMessage.messageid !== "" ) ?
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