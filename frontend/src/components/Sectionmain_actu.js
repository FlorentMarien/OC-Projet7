import '../styles/Sectionmain_actu.css'
import { useState,useEffect } from 'react'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faRefresh, fas } from '@fortawesome/free-solid-svg-icons'
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
	let [listMessage,setListMessage] = useState([]);
	let [listAnswer,setListAnswer] = useState([]);
	let [limitmessage,setlimitmessage] = useState(0);
	//let limitmessage=5;
	const [tampontargetMessage,settampontargetMessage] = useState([{messageid:"",replyLevel:0}]);
	const [targetMessage,settargetMessage] = useState({messageid:"",replyLevel:0});
	const [formText,setformText] = useState("Votre message ");
	const [formFile,setformFile] = useState("");
	let [listtargetMessage,setlisttargetMessage] = useState([]);
	let [changeUpdate,setchangeUpdate] = useState(0);
	
	const [openActuSend,setopenActuSend] = useState(0);
	function getBack(e){
		e.preventDefault();
		settargetMessage({messageid:"",replyLevel:0});
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
			let parametre = {
				sendMessageGloabal:1,
				buttonCommentaire:1,
				sendReply:1,
			}
			let reply;
			if(messageid === "all"){
				if(listMessage.length !== 0 ){
				parametre={
					...parametre,
					buttonCommentaire:1,
					sendReply:0,
					replyLevel:replyLevel,
					messageFocus:"messageAll",
				};
				let sendreply=(
					<div id="blockactu">
						<div id="blockactu_send">
							{
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
								
							}
						</div>
					</div>
				);
				listMessage.forEach(element => {
					reply=(
					<>
						{reply}
						{<Message key={element._id} changeUpdate={changeUpdate} setchangeUpdate={setchangeUpdate} parametre={parametre} element={element} auth={auth} setListMessage={setListMessage} listMessage={listMessage} setListAnswer={setListAnswer} listAnswer={listAnswer} settargetMessage={settargetMessage} targetMessage={targetMessage} settampontargetMessage={settampontargetMessage} tampontargetMessage={tampontargetMessage} profilData={profilData}/>}
					</>)
				});
				reply=(
				<>
				{sendreply}
				<div className='blockactu_fil'>
					{reply}
				</div>
				</>);
				return reply;
				}
			}
			if(messageid==="one"){
				if(listtargetMessage.length !== 0){
				let reply;
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
				parametre.sendReply=1;
				parametre.replyLevel=targetMessage.replyLevel;
				parametre.messageFocus="messageAll";
				parametre.getCommentaire=false;
				
					let buttonback=(
						<IconButton onClick={(e)=>settargetMessage({messageid:"",replyLevel:0})} color="primary" aria-label="Back" component="label">
									<KeyboardBackspaceIcon/>
						</IconButton>
					);
					let replylvl0=(	
						<Message key={listtargetMessage[0].answerArray[0][0]._id} changeUpdate={changeUpdate} setchangeUpdate={setchangeUpdate} parametre={parametre} element={listtargetMessage[0].answerArray[0][0]} auth={auth} setListMessage={setListMessage} listMessage={listMessage} setListAnswer={setListAnswer} listAnswer={listAnswer} settargetMessage={settargetMessage} targetMessage={targetMessage} settampontargetMessage={settampontargetMessage} tampontargetMessage={tampontargetMessage}/>
					);
					if(listtargetMessage[0].answerArray[0][0].answer.length>0){
						let replylvl1,replylvl2;
						for(let x=0;x<listtargetMessage[0].answerArray[1].length;x++){
							replylvl1="";
							replylvl2="";
							replylvl1=(
								<>
								{replylvl1}
								{<Message key={listtargetMessage[0].answerArray[1][x]._id} changeUpdate={changeUpdate} setchangeUpdate={setchangeUpdate} parametre={parametreparentanswer} element={listtargetMessage[0].answerArray[1][x]} auth={auth} setListMessage={setListMessage} listMessage={listMessage} setListAnswer={setListAnswer} listAnswer={listAnswer} settargetMessage={settargetMessage} targetMessage={targetMessage} settampontargetMessage={settampontargetMessage} tampontargetMessage={tampontargetMessage}/>}
								</>
							);
							if(listtargetMessage[0].answerArray[1][x].answer.length>0){					
								for(let y=0;y<listtargetMessage[0].answerArray[x+2].length;y++){
									replylvl2=(
										<>
											{replylvl2}
											{<Message key={listtargetMessage[0].answerArray[x+2][y]._id} changeUpdate={changeUpdate} setchangeUpdate={setchangeUpdate} parametre={parametreanswer} element={listtargetMessage[0].answerArray[x+2][y]} auth={auth} setListMessage={setListMessage} listMessage={listMessage} setListAnswer={setListAnswer} listAnswer={listAnswer} settargetMessage={settargetMessage} targetMessage={targetMessage} settampontargetMessage={settampontargetMessage} tampontargetMessage={tampontargetMessage}/>}
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
					reply=(
						<>
						<div className="listMessage">
							<div className="displayfocusMessage">
								{buttonback}
								{replylvl0}
							</div>
							{reply}
						</div>
						</>
					);
					return reply;
				
				}
			}
		
		return (<p>Load...</p>);
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
			formData.append('image',formFile);
		}
		
		sendMessageApi(formData).then((result)=>{
			if(result.resultmessage!==undefined){
				let list=[...listMessage];
				list.unshift(result.resultmessage);
				setListMessage([...list]);
			}
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
	async function getMessageApi(limitmessage){
		return await fetch("http://localhost:3000/api/message/get",{
			headers: {
				'Authorization': "Bearer "+auth[2],
				'Accept': 'application/json',
				'Content-Type': 'application/json',
			},
			method: 'POST',
			body: limitmessage,
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
		return await getMessageApi(JSON.stringify({limitmessage:limitmessage})).then((result)=>{
			setListMessage([...listMessage,...result]);
		});
	}
	async function getanswer(){
		return await getAnswerApi().then((result)=>{
			setListAnswer([...result]);
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
			if(result.length===0) setlisttargetMessage([-1]);
			else setlisttargetMessage([...result]);
		});
	}
	useEffect(() => {
		console.log(listMessage);
		if(targetMessage.messageid === "" ){
			getmes().then(()=>{
				window.onscroll = function(ev) {
					let headerheight=document.getElementsByTagName("header")[0].offsetHeight;
					let mainheight=document.getElementById("main_container").offsetHeight;
					let pageheight=headerheight+mainheight;
					
					if ((window.innerHeight + window.scrollY + 5) >= pageheight) {
						//console.log(window.innerHeight + window.scrollY);
						window.onscroll = null;
						setlimitmessage(limitmessage+5);
					}
				};
			})
		}
		if(targetMessage.messageid !== ""){
			setlisttargetMessage([]);
			window.onscroll = null;
			getMessageById();
		}
	}, [targetMessage,changeUpdate,limitmessage])
	let reply;
		return (
			<section>
			{
			targetMessage.messageid === "" ?
			getreply2("all",0)
			: getreply2("one",0)
			}
			</section>
		);
}
export default Sectionmain_actu