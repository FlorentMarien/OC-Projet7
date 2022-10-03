import '../styles/Sectionmain_profil.css'
import Message from './Message'
import Message_reply from './Message_reply'
import { useState,useEffect } from 'react'
import IconButton from '@mui/material/IconButton';
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import AddCommentIcon from '@mui/icons-material/AddComment';
import CircularProgress from '@mui/material/CircularProgress';

function Sectionmain_profil({auth,setAuth,indexPage,setindexPage,profilData,setprofilData,targetRechercheUser,settargetRechercheUser}) {
	const [targetMessage,settargetMessage] = useState({messageid:"",replyLevel:0});
	let [limitmessage,setlimitmessage] = useState({skipmessage:0,nbrmessage:5});
	let [listMessage,setListMessage] = useState([]);
	let timer=0;
	const [formFile,setformFile] = useState(0);
	let [profilTarget,setprofilTarget] = useState(0);
	function sendImg(e){
		e.preventDefault();
		let formData = new FormData();
		for(let x = 0 ; x<formFile.length ; x++){
			formData.append('image',formFile[x]);
		}
		sendImgApi(formData).then((result)=>{
			let newprofilData=profilTarget;
			newprofilData.imageArray=result;
			setprofilTarget(newprofilData);
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
			sendReply:0,
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
								{<Message key={listMessage[x]._id}   parametre={parametre} element={listMessage[x]} auth={auth} setListMessage={setListMessage} listMessage={listMessage} settargetMessage={settargetMessage} targetMessage={targetMessage} profilData={profilData} profilTarget={profilTarget}/>}
								</div>
							</>);
					}
					else{
						//[0] Parent // [1] Reponse if lenght = 2 // [2] Sous reponse de [1][0] // [3] Sous reponse de [1][1]
						let listparentmessageprofil;
						let listparent;
						let nbranswer;
						for(let y=0;y<2;y++){
							if(y===1){
								nbranswer=listMessage[x].answerArray[y].length;
								for(let z=0;z<listMessage[x].answerArray[y].length;z++){
										//Recupere une réponse avec les réponses associées
										let verif=false;
										listparentmessageprofil="";
											for(let w=0;w<listMessage[x].answerArray[(z+2)].length;w++){
												if(listMessage[x].answerArray[z+2][w].userId===targetRechercheUser.userid){
													
													listparentmessageprofil=(
													<>
														{listparentmessageprofil}
														{<Message key={listMessage[x].answerArray[z+2][w]._id}   parametre={parametreanswer} element={listMessage[x].answerArray[z+2][w]} auth={auth} setListMessage={setListMessage} listMessage={listMessage}  settargetMessage={settargetMessage} targetMessage={targetMessage} profilData={profilData} profilTarget={profilTarget}/>}
													</>);
													verif=true;
												}
											}
											if(verif===true ){
												listparentmessageprofil=(
													<>
														{<Message key={listMessage[x].answerArray[y][z]._id}   parametre={parametreparentanswer} element={listMessage[x].answerArray[y][z]} auth={auth} setListMessage={setListMessage} listMessage={listMessage}  settargetMessage={settargetMessage} targetMessage={targetMessage} profilData={profilData} profilTarget={profilTarget}/>}
														{listparentmessageprofil}
													</>);
											}
											else if(listMessage[x].answerArray[y][z].userId===targetRechercheUser.userid){
												listparentmessageprofil=(
													<>
														{<Message key={listMessage[x].answerArray[y][z]._id}   parametre={parametreparentanswer} element={listMessage[x].answerArray[y][z]} auth={auth} setListMessage={setListMessage} listMessage={listMessage}  settargetMessage={settargetMessage} targetMessage={targetMessage} profilData={profilData} profilTarget={profilTarget}/>}
													</>);
											}
											listparent=(
												<>
												{listparent}
												<div className='listAnswer'>
												{listparentmessageprofil}
												<Message_reply auth={auth} parametre={parametreparentanswer} messagetarget={listMessage[x].answerArray[y][z]._id} listMessage={listMessage} setListMessage={setListMessage} profilTarget={profilTarget}/>
												</div>
												</>
											);
								}
								let classwithanswer="";
								if(nbranswer > 0 )  classwithanswer="--withanswer";
								listmessageprofil=(
									<>
									{listmessageprofil}
									<div key={listMessage[x].answerArray[0][0]._id} className={'listMessage '+ classwithanswer} >
										{listparent}
									</div>
									</>
								);
							}
							else{
								listparent=(
									<>
									{<Message key={listMessage[x].answerArray[0][0]._id}   parametre={parametre} element={listMessage[x].answerArray[0][0]} auth={auth} setListMessage={setListMessage} listMessage={listMessage}  settargetMessage={settargetMessage} targetMessage={targetMessage} profilData={profilData} profilTarget={profilTarget}/>}
									</>
								);
							}
						}
					}
				}
			}
			else{
				listmessageprofil=<p>Aucun message de l'utilisateur...</p>
			}
			return listmessageprofil;
		}
		if(focusMessage==="one"){
			let reply;
			parametre.sendReply=1;
			parametre.replyLevel=targetMessage.replyLevel;
			parametre.messageFocus="messageAll";
			parametre.getCommentaire=false;
			for(let a=0;a<listMessage.length;a++){
				if(listMessage[a].answerArray[0][0]._id === targetMessage.messageid){
					let classwithanswer="";
					if(listMessage[a].answerArray[0][0].answer.length > 0 )  classwithanswer="--withanswer";
					reply=(
						<>
						<div className='displayfocusMessage'>
							<IconButton onClick={(e)=>settargetMessage({messageid:"",replyLevel:0})} color="primary" aria-label="Back" component="label">
										<KeyboardBackspaceIcon/>
							</IconButton>
							{<Message key={listMessage[a].answerArray[0][0]._id}   parametre={parametre} element={listMessage[a].answerArray[0][0]} auth={auth} setListMessage={setListMessage} listMessage={listMessage}  settargetMessage={settargetMessage} targetMessage={targetMessage} profilData={profilData} profilTarget={profilTarget}/>}
						</div>
						</>
					);
					if(listMessage[a].answerArray[0][0].answer.length>0){
						let replylvl1,replylvl2;
						for(let x=0;x<listMessage[a].answerArray[1].length;x++){
							replylvl1="";
							replylvl2="";
							replylvl1=(
								<>
								{replylvl1}
								{<Message key={listMessage[a].answerArray[1][x]._id}   parametre={parametreparentanswer} element={listMessage[a].answerArray[1][x]} auth={auth} setListMessage={setListMessage} listMessage={listMessage}  settargetMessage={settargetMessage} targetMessage={targetMessage} profilData={profilData} profilTarget={profilTarget}/>}
								</>
							);
							if(listMessage[a].answerArray[1][x].answer.length>0){					
								for(let y=0;y<listMessage[a].answerArray[x+2].length;y++){
									replylvl2=(
										<>
											{replylvl2}
											{<Message key={listMessage[a].answerArray[x+2][y]._id}   parametre={parametreanswer} element={listMessage[a].answerArray[x+2][y]} auth={auth} setListMessage={setListMessage} listMessage={listMessage}  settargetMessage={settargetMessage} targetMessage={targetMessage} profilData={profilData} profilTarget={profilTarget}/>}
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
								<Message_reply auth={auth} parametre={parametreparentanswer} messagetarget={listMessage[a].answerArray[1][x]._id} listMessage={listMessage} setListMessage={setListMessage} profilTarget={profilTarget}/>
								</div>
								</>
							);
						}
					}
					reply=(
						<>
						<div className={"listMessage "+classwithanswer}>
						{reply}
						</div>
						</>
					);
					return reply;
				}
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
	async function getmes(){
		return await getuserMessageApi(JSON.stringify({...targetRechercheUser,limitmessage:limitmessage})).then((result)=>{
			if(result.length===0){
				if(listMessage.length>0){
					window.onscroll = null;
				}
				else setListMessage([-1]);
			}
			else setListMessage([...listMessage,...result]);
		});
	}
	function lazyload(){
		window.onscroll = function(ev) {
			let headerheight=document.getElementsByTagName("header")[0].offsetHeight;
			let mainheight=document.getElementById("main_container").offsetHeight;
			let pageheight=mainheight; // + headerheight
			if ((window.innerHeight + window.scrollY ) >= pageheight){
				window.onscroll = null;
				setlimitmessage({...limitmessage,skipmessage:limitmessage.skipmessage+limitmessage.nbrmessage,nbrmessage:limitmessage.nbrmessage});
			}
		};
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
		if(targetRechercheUser.userid!==undefined){
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
								email:result.email,
								userId:targetRechercheUser,
								nbrmessage:result.nbrmessage,
								nbranswer:result.nbranswer,
						});
					}
					else{
							throw result;
					}
			});
		}
	}, [auth])
	useEffect(() => {
		getmes().then(()=>{
			lazyload();
		});
	}, [limitmessage])
	useEffect(() => {
		if(targetMessage.messageid!==""){
			window.onscroll = null;
		}else{
			lazyload();
		}
	}, [targetMessage])
	

	return (
		<section className="section--mid">
			{
				(profilTarget === 0 ) ?
				<CircularProgress className='loadspinneranimation'/>
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
							<li>
								<span>Message: { profilTarget.nbrmessage }</span>
							</li>
							<li>
								<span>Réponse: { profilTarget.nbranswer }</span>
							</li>
						</ul>
						</>
					}
					</div>
				</div>
				
				<div id="containerlistMessage">
					{	targetMessage.messageid === "" ?
							(listMessage.length > 0) ?
							getuserMessage("all")
							: <CircularProgress className='loadspinneranimation'/>
						: getuserMessage("one")
					}
				</div>
				</>
			
		}
		</section>
	)
}

export default Sectionmain_profil