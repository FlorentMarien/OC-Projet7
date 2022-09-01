import '../styles/Sectionmain_parametre.css'
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
import ButtonGroup from '@mui/material/ButtonGroup';
import SettingsIcon from '@mui/icons-material/Settings';

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
	},
  });


function Sectionmain_parametre({auth,setAuth,indexPage,setindexPage,profilData,setprofilData}) {
	const [backPassword,setbackPassword] = useState("");
	const [confirmbackPassword,setconfirmbackPassword] = useState("");
	const [newbackPassword,setnewbackPassword] = useState("");
	const [statePassword,setstatePassword] = useState("");
	const [targetPage,settargetPage] = useState(0);
	const [formFile,setformFile] = useState([]);
	function delpreviewimg(e,file){
		e.preventDefault();
		console.log(file);
		let newformFile = [
			...formFile
		];
		console.log(formFile.indexOf(file));
		newformFile.splice(newformFile.indexOf(file),1);
		setformFile([...newformFile]);
	}
	function getimgpreview(){
		let reply;
		formFile.forEach((res)=>{
			reply=(
				<>
				{reply}
				<div>
				{<img src={URL.createObjectURL(res)} alt={profilData.name}/>}
				{<button onClick={(e)=>{delpreviewimg(e,res)}}>x</button>}
				</div>
				</>
			);
		});
		return reply;
	}
	function sendImg(e){
		e.preventDefault();
		let formData = new FormData();
		
		for(let x = 0 ; x<formFile.length ; x++){
			formData.append('image',formFile[x]);
		}
		sendImgApi(formData).then((result)=>{
			let newprofilData={
				...profilData,
				imageArray:result,
			}
			setprofilData(newprofilData);
			setformFile([]);
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
	function modifpdp(e){
		e.preventDefault();
		let objData={
			imageArray:e.target.closest("div.parametre_img").children[0].src,
		}
		modifpdpApi(JSON.stringify(objData)).then((result)=>{
			if(result!==null || result!==undefined){
				let newprofilData={
					...profilData,
					imageUrl:result
				}
				setprofilData(newprofilData);
			}
		})	
	}
	function deleteGallery(e){
		e.preventDefault();
		let objData={
			imageArray:e.target.closest("div.parametre_img").children[0].src,
		}
		deleteGalleryApi(JSON.stringify(objData)).then((result)=>{
			if(result!==null || result!==undefined){
				let newprofilData={
					...profilData,
					imageArray:result
				};
				setprofilData(newprofilData);
			}
		});
	}
	async function deleteGalleryApi(objData){
		return await fetch("http://localhost:3000/api/auth/deletegallery",{
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json',
				'Authorization': "Bearer "+auth[2]
			},
			method: 'PUT',
			body: objData
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
	async function modifpdpApi(objData){
		return await fetch("http://localhost:3000/api/auth/modifpdp",{
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json',
				'Authorization': "Bearer "+auth[2]
			},
			method: 'PUT',
			body: objData
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
	function submitmodifpass(e){
		e.preventDefault();
		if(backPassword !== confirmbackPassword){
			setstatePassword("errorinput");
		}
		else{
			setstatePassword("");
			let objData={
				backPassword:backPassword,
				newPassword:newbackPassword
			}
			sendmodifpass(JSON.stringify(objData)).then((result)=>result).catch((error)=>error);
		}
	}
	async function sendmodifpass(objData){
		return await fetch("http://localhost:3000/api/auth/modifpassword",{
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json',
				'Authorization': "Bearer "+auth[2]
			},
			method: 'PT',
			body: objData
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
	return (
	<section>
		<p>Parametre</p>
		<ButtonGroup className="nav-Parametre"variant="outlined" aria-label="outlined button group" >
			<Button onClick={(e)=>{if(targetPage!==0){settargetPage(0)}}}>Information</Button>
			<Button onClick={(e)=>{if(targetPage!==1){settargetPage(1)}}}>Gallery</Button>
		</ButtonGroup>
		{
		targetPage===0 &&
			<div>
				<p>Changement mot de passe</p>
				<form className='form-Parametre'>
					<ThemeProvider theme={theme}>
						<TextField color="neutral" type="email" id="formEmail" label="Email" variant="outlined" value={profilData.email}/>
						<TextField className={statePassword} color="neutral" type="password" id="formPassword" label="Password" variant="outlined" default-value={backPassword} onBlur={(e)=>setbackPassword(e.target.value)}/>
						<TextField className={statePassword} color="neutral" type="password" id="confirmformPassword" label="Confirm-Password" variant="outlined" default-value={confirmbackPassword} onBlur={(e)=>setconfirmbackPassword(e.target.value)}/>
						<TextField color="neutral" type="password" id="newformPassword" label="New Password" variant="outlined" default-value={newbackPassword} onBlur={(e)=>setnewbackPassword(e.target.value)}/>
						<Button variant="contained" onClick={(e)=>{submitmodifpass(e)}}>Modification mots de passe</Button>
						
					</ThemeProvider>
				</form>
			</div>
		}
		{
		targetPage === 1 &&
		<div>
			<p>Gallery</p>
			<ButtonGroup variant="outlined" aria-label="outlined button group" orientation="vertical">
				<Button component="label">
				Ajouter Images
				<input hidden accept="image/*" onChange={(e)=>{setformFile([...e.target.files])}} type="file" id="formFile" multiple/>
				</Button>
				{
				formFile.length !==0 &&
				<>
					<Button onClick={(e)=>{sendImg(e)}}>Envoyer</Button>
					<div className='parametre_imgpreview'>
						{getimgpreview()}
					</div>
				</>
				}
			</ButtonGroup>
			{
					profilData.imageArray.length!==0 ?
						profilData.imageArray.map(function(num) {
							return (
								<>
									<div className="parametre_img" >
										<img src={num} alt={profilData.name}/>
										<Button onClick={(e)=>{e.target.closest("div").children[2].style.visibility="visible"}} disabled={profilData.imageUrl===num ? true : false}>
											<SettingsIcon />
										</Button>
										<div className='parametre_imgparametre'>
											<ButtonGroup className="nav-Parametre"variant="outlined" aria-label="outlined button group" >
												<Button onClick={(e)=>{deleteGallery(e);e.target.closest("div.parametre_img").children[2].style.visibility="hidden"}} disabled={profilData.imageUrl===num ? true : false}>Supprimer</Button>
												<Button onClick={(e)=>{modifpdp(e);e.target.closest("div.parametre_img").children[2].style.visibility="hidden"}} disabled={profilData.imageUrl===num ? true : false}>Modifier Photo de profil</Button>
											</ButtonGroup>
										</div>
									</div>
								</>
							)
						})
					: <p>Vous n'avez aucune image dans votre Gallery</p>
				
			}
		</div>
		}
	</section>
	)
}
export default Sectionmain_parametre