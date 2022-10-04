import '../styles/Sectionmain_aside.css'
import { useState,useEffect } from 'react'
import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { createTheme,ThemeProvider } from '@mui/material/styles'
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';

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

function Sectionmain_aside({auth,setAuth,indexPage,setindexPage,profilData,setprofilData,targetRechercheUser,settargetRechercheUser}) {
	const [userList,setuserList] = useState([null]);
	const [formuserRecherche,setformuserRecherche] = useState("");
	function getRechercheuser(e,value){
		//Recherche nom prénom ->
		let objData={
			keyRecherche:value,
		};
		getRechercheuserApi(JSON.stringify(objData)).then((res)=>{
			setuserList(res);
		});
	}
	function Writeuserrecherche(){
		let reply;
		userList.forEach(element => {
			reply=(
				<>
				{reply}
				<Button variant="contained" className="recherche_user" onClick={(e)=>{
					settargetRechercheUser({userid:element._id,emetteur:"navbar-aside"});
					}}>
					<div>
						<img src={element.imageUrl} alt={element.name + " " + element.prename} />
					</div>
					<div>
						<p>{element.name + " " + element.prename}</p>
					</div>
				</Button>
				</>
			);
		});
		if(userList.length>0) document.getElementsByClassName("aside_recherche_result")[0].style.overflowY="scroll";
		else document.getElementsByClassName("aside_recherche_result")[0].style.overflowY="hidden";
		return reply;
	}
	async function getRechercheuserApi(objData){
		return await fetch("http://localhost:3000/api/auth/rechercheuser",{
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
		<aside className='sectionmain_aside'>
			<div className='aside_recherche'>
				<ThemeProvider theme={theme}>
					<TextField variant="filled" color="neutral" type="text" id="formAsideRecherche" label="Recherche" defaultValue={formuserRecherche} onChange={(e)=>{getRechercheuser(e,e.target.value)}}/>
				</ThemeProvider>
				<div className='aside_recherche_result'>
					{
						userList[0]!==null &&
						Writeuserrecherche()
					}
				</div>
			</div>
			</aside>
	)
}

export default Sectionmain_aside