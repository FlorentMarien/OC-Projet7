import '../styles/Sectionmain_profil.css'
import Message from './Message'
import { useState,useEffect } from 'react'
import IconButton from '@mui/material/IconButton';
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';

function Sectionmain_profil({auth,setAuth,indexPage,setindexPage,profilData,setprofilData}) {
	const [tampontargetMessage,settampontargetMessage] = useState([{messageid:"",replyLevel:0}]);
	const [targetMessage,settargetMessage] = useState(tampontargetMessage[tampontargetMessage.length-1]);
	const [listMessage,setListMessage] = useState([]);
	const [listAnswer,setListAnswer] = useState([0]);
	function getBack(e){
		e.preventDefault();
		let bistampontargetMessage;
		bistampontargetMessage=tampontargetMessage;
		bistampontargetMessage.pop();
		console.log(bistampontargetMessage);
		settampontargetMessage(bistampontargetMessage);
		settargetMessage(bistampontargetMessage[bistampontargetMessage.length-1]);
	}
	function getuserMessage(focusMessage,replyLevel=0,boolEnd=false){
		let parametre = {
			sendMessageGloabal:1,
			buttonCommentaire:1,
			sendReply:0,
			replyLevel:0,
			pageProfil:true,
		}
		let listmessageprofil;
		if(focusMessage==="all"){
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
			parametre.messageFocus="messageFocus";
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
								if(element.answer[element.answer.length-1]===Answerelement){
									boolEnd=true;
								}
								listmessageprofil=(
									<>
										{listmessageprofil}
										{getuserMessage(Answerelement,targetMessage.replyLevel+1,boolEnd)}
									</>
								);
							}
							);
						}
					}
				});
			}
			else{
				listAnswer.forEach(element => {
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
								if(element.answer[element.answer.length-1]===Answerelement){
									boolEnd=true;
								}
								listmessageprofil=(
									<>
										{listmessageprofil}
										{getuserMessage(Answerelement,targetMessage.replyLevel+1,boolEnd)}
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
					listmessageprofil=(
					<>
						{listmessageprofil}
						{<Message parametre={parametre} element={element} auth={auth} setListMessage={setListMessage} listMessage={listMessage} setListAnswer={setListAnswer} listAnswer={listAnswer} settargetMessage={settargetMessage} targetMessage={targetMessage} settampontargetMessage={settampontargetMessage} tampontargetMessage={tampontargetMessage} profilData={profilData}/>}
					</>);
					/* Sous reponse
					if(element.answer.length !== 0){
						element.answer.forEach((Answerelement)=>
							listmessageprofil=(
								<>
									{listmessageprofil}
								</>
							)
						);
					}*/
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
	async function getmes(){
		return getuserMessageApi().then((result)=>{
			setListMessage(result);
		});
	}
	useEffect(() => {
		getmes();
	}, [auth])
	return (
		<section>
			{
				listMessage.length === 0 
				? <p>Load...</p>
				: 1 &&
				<>
				<div id="blockprofil">
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
				<div id="blocklistmessageprofil">
					{
						targetMessage.messageid === "" ?
							getuserMessage("all")
						:
							getuserMessage("one")
					}
				</div>
				</>
			
		}
		</section>
	)
}

export default Sectionmain_profil