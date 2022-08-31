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
			method: 'POST',
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
		<form>
			<p>Changement mot de passe</p>
			<ThemeProvider theme={theme}>
				<TextField color="neutral" type="email" id="formEmail" label="Email" variant="outlined" value={profilData.email}/>
				<TextField className={statePassword} color="neutral" type="password" id="formPassword" label="Password" variant="outlined" default-value={backPassword} onBlur={(e)=>setbackPassword(e.target.value)}/>
				<TextField className={statePassword} color="neutral" type="password" id="confirmformPassword" label="Confirm-Password" variant="outlined" default-value={confirmbackPassword} onBlur={(e)=>setconfirmbackPassword(e.target.value)}/>
				<TextField color="neutral" type="password" id="newformPassword" label="New Password" variant="outlined" default-value={newbackPassword} onBlur={(e)=>setnewbackPassword(e.target.value)}/>
				<Button variant="contained" onClick={(e)=>{submitmodifpass(e)}}>Modification mots de passe</Button>
			</ThemeProvider>
		</form>
		
		
	</section>
	)
}
export default Sectionmain_parametre