import '../styles/Auth.css';
import { useState } from 'react';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import TextField from '@mui/material/TextField';
import { createTheme,ThemeProvider } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import PhotoCamera from '@mui/icons-material/PhotoCamera';

function Auth({auth,setAuth}) {
	const [state,setState] = useState(0);
	const [formFile,setformFile] = useState("");

	const theme = createTheme({
		palette: {
			neutral:{
				color:'#fff',
			},
			text:{
				primary:'#fff', // 
				secondary:'#aaa', //
				Onprimary:'000',
				surface:'#EEE',
				on_surface:'#EEE',
				background:'#EEE',
				borderColor: '#fff',
			},
			primary:{
				main:'#000', // Button color
			}
		},
	  });
	function submitUser(e){
		e.preventDefault();
		let formData = new FormData();
		  let formContact={
			  email:document.getElementById("formEmail").value,
			  password:document.getElementById("formPassword").value,
			  name:document.getElementById("formName").value,
			  prename:document.getElementById("formPrename").value
		  }
		  formData.append("user",JSON.stringify(formContact));
		  formData.append("image",formFile);
		  sendUser(formData).then((result)=>{
			if(result!==undefined){
				
				setState(2);
			}
		  })
	}
	function loginUser(e){
		e.preventDefault();
		const formData = new FormData();
		const formAuth = {
			email:document.getElementById("loginEmail").value,
			password:document.getElementById("loginPassword").value
		}
		formData.append('user',JSON.stringify(formAuth));
		sendloginUser(formAuth).then((result) =>{
			if(result!==undefined){
				localStorage.setItem("userid",result.userId);
				localStorage.setItem("token",result.token);
				setAuth([1,result.userId,result.token]);
			}
		});
	}
	async function sendloginUser(formAuth){
		return await fetch("http://localhost:3000/api/auth/login",{
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			},
			method: 'POST',
			body: JSON.stringify(formAuth)
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
	async function sendUser(objectContact){
		return await fetch("http://localhost:3000/api/auth/signup",{
			method: 'POST',
			body: objectContact
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
		let urlFile = URL.createObjectURL(formFile);
		return <img src={urlFile} alt="Photo de profil"/>
	}

	return (
		state === 0 ?
		<div className="blockauth">
			<form>
			<ThemeProvider theme={theme}>
				<Button variant="contained" onClick={() => setState(1)}>Inscription</Button>
				<Button variant="contained" onClick={() => setState(2)}>Login</Button>
			</ThemeProvider>
			</form>
		</div>
		: state === 1 ? 
		<div className='blockauth'>
			<form className='formlogin'>
			<h1>Signup</h1>
			<ThemeProvider theme={theme}>
				{
					formFile === "" ?
					<IconButton color="primary" aria-label="upload picture" component="label">
						<input hidden accept="image/*" onChange={(e)=>setformFile(e.target.files[0])} type="file" id="formFile"/>
						<PhotoCamera />
					</IconButton>
					: 
					 <div className="form_container_preview">
						{getimgpreview()}
						<button className="button_delpreview" onClick={(e)=>setformFile("")}>x</button>
					</div>
				}
				<TextField color="neutral" type="email" id="formEmail" label="Email" variant="outlined" />
				<TextField color="neutral" type="password" id="formPassword" label="Password" variant="outlined" />
				<TextField color="neutral" type="text" id="formName" label="Name" variant="outlined" />
				<TextField color="neutral" type="text" id="formPrename" label="Prename" variant="outlined" />
				<Button variant="contained" onClick={(e)=>submitUser(e)}>S'inscrire</Button>
				<Button variant="contained" onClick={(e)=>setState(0)}>Retour</Button>
			</ThemeProvider>
			</form>
		</div>
		: state === 2 ?
		<div className='blockauth'>
			
			<form className='formlogin'>
			<h1>Login</h1>
			<ThemeProvider theme={theme}>
				<TextField color="neutral" type="text" id="loginEmail" label="Email" variant="outlined" />	
				<TextField color="neutral" type="password" id="loginPassword" label="Password" variant="outlined" />
				<Button variant="contained" onClick={(e) => loginUser(e)}>Login</Button>
				<Button variant="contained" onClick={(e)=>setState(0)}>Retour</Button>
			</ThemeProvider>
			</form>
		</div>
		:null
	)
}

export default Auth