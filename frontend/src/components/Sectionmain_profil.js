import '../styles/Sectionmain_profil.css'
import Message from './Message'
import { useState,useEffect } from 'react'

function Sectionmain_profil({auth,setAuth,indexPage,setindexPage,profilData,setprofilData}) {
	const [targetMessage,settargetMessage] = useState(0);
	const [listMessage,setListMessage] = useState([]);
	const [listAnswer,setListAnswer] = useState([0]);

	function getuserMessage(focusMessage,replyLevel=0){
		let parametre = {
			sendMessageGloabal:1,
			buttonCommentaire:1,
			sendReply:0,
			replyLevel:0,
		}
		let listmessageprofil;
		if(focusMessage==="all"){
			let listmessageprofil;
			listMessage.forEach(element => {
					listmessageprofil=(
					<>
						{listmessageprofil}
						{<Message parametre={parametre} element={element} auth={auth} settargetMessage={settargetMessage} targetMessage={targetMessage} listMessage={listMessage} setListMessage={setListMessage} listAnswer={listAnswer} setListAnswer={setListAnswer} profilData={profilData}/>}
					</>);
			});
			return listmessageprofil;
		}
		if(focusMessage==="one"){
			parametre.sendReply=1;
			listMessage.forEach(element => {
				if(element._id===targetMessage){
					listmessageprofil=(
					<>
						{<Message parametre={parametre} element={element} auth={auth} settargetMessage={settargetMessage} targetMessage={targetMessage} listMessage={listMessage} setListMessage={setListMessage} listAnswer={listAnswer} setListAnswer={setListAnswer} profilData={profilData}/>}
					</>);
					if(element.answer.length !== 0){
						console.log(element.answer);
						element.answer.forEach((Answerelement)=>{
							listmessageprofil=(
								<>
									{listmessageprofil}
									{getuserMessage(Answerelement,replyLevel+1)}
								</>
							);
							
						}
						);
					}
				}
			});
		}
		if((focusMessage !== "all") && (focusMessage !=="one")){
			
			listAnswer.forEach(element => {
				if(element._id===focusMessage){
					parametre.replyLevel=replyLevel;
					if(replyLevel<2) parametre.sendReply=1;
					listmessageprofil=(
					<>
						{listmessageprofil}
						{<Message parametre={parametre} element={element} auth={auth} settargetMessage={settargetMessage} targetMessage={targetMessage} listAnswer={listAnswer} listMessage={listMessage} setListMessage={setListMessage} setListAnswer={setListAnswer} profilData={profilData}/>}
					</>);
					if(element.answer.length !== 0){
						element.answer.forEach((Answerelement)=>
							listmessageprofil=(
								<>
									{listmessageprofil}
									{getuserMessage(Answerelement,replyLevel+1)}
								</>
							)
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
					listMessage.length === 0 
					? <p>Load...</p>
					: targetMessage === 0 
						?
							getuserMessage("all")
						:
							getuserMessage("one")
				}
			</div>
		</section>
	)
}

export default Sectionmain_profil