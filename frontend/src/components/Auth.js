import '../styles/Auth.css'
import { useState } from 'react'

function Auth({auth,setAuth}) {
	const [state,setState] = useState(0);
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
		  formData.append("image",document.querySelector('#formImage').files[0]);
		  sendUser(formData).then((result)=>{
			if(result!==undefined){
				
				setState(2);
			}
		  })
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
	return (
		state === 0 ?
		<div className='formAuth'>
			<button className="buttonAuth" onClick={() => setState(1)}>Inscription</button>
			<button className="buttonAuth" onClick={() => setState(2)}>Login</button>
		</div>
		: state === 1 ? 
		<div className='formAuth'>
			<h1>Signup</h1>
			<form >
				<input type='email' placeholder='Email' id="formEmail"></input>
				<input type='password' placeholder='Password' id="formPassword"></input>
				<input type='name' placeholder='Name' id="formName"></input>
				<input type='prename' placeholder='Pre-Name' id="formPrename"></input>
				<input type='file' id="formImage"></input>
				<button onClick={(e)=>submitUser(e)}>S'inscrire</button>
				<button onClick={(e)=>setState(0)}>Retour</button>
			</form>
		</div>
		: state === 2 ?
		<div className='formAuth'>
			<h1>Login</h1>
			<form>
				<input type='email' placeholder='email' id="loginEmail"></input>
				<input type='password' placeholder='Password' id="loginPassword"></input>
				<button onClick={(e)=>loginUser(e)}>Login</button>
				<button onClick={(e)=>setState(0)}>Retour</button>
			</form>
		</div>
		:null
	)
}

export default Auth