import '../styles/Bodymain.css'

import { useState,useEffect } from 'react'
import Nav from './Nav'
import Sectionmain_profil from './Sectionmain_profil'
import Sectionmain_actu from './Sectionmain_actu'
import Sectionmain_parametre from './Sectionmain_parametre'
import Sectionmain_aside from './Sectionmain_aside'
import Sectionmain_recherche from './Sectionmain_recherche'
import Sectionmain_message from './Sectionmain_message'
function Bodymain({auth,setAuth}) {
	let [indexPage,setindexPage] = useState({index:1,emetteur:"navbar"});
	const [profilData,setprofilData] = useState(0);
	let [targetRechercheUser,settargetRechercheUser] = useState({userid:undefined});
	
	useEffect(() => {
		//Recuperation profil user
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
		let objData={
			userid:auth[1],
		}
		getUser(JSON.stringify(objData)).then((result)=>{
			if(!result.error){
			setprofilData({
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
		})
		.catch((err)=>{
			console.log(err);
			if(err.error.name==="TokenExpiredError") {
				//setAuth([0]);					
			}
			localStorage.clear();
			setAuth([0]); // TokenExpired/ProblemeToken
		})
	}, [auth,setAuth]);
	useEffect(() => {
		if(indexPage.index===0 && indexPage.emetteur==="navbar") {
			settargetRechercheUser({userid:auth[1]});
		}
	}, [indexPage]);
	useEffect(() => {
		if(indexPage.index!==0 && targetRechercheUser.userid!==undefined){
			setindexPage({index:0,emetteur:"navbar-aside"});
		}
	}, [targetRechercheUser]);

	return (
		<div id="main_container">	
			<Nav auth={auth} setAuth={setAuth} indexPage={indexPage} setindexPage={setindexPage} profilData={profilData} setprofilData={setprofilData} settargetRechercheUser={settargetRechercheUser}/>
			{
				indexPage.index === 0 ?
				<Sectionmain_profil key={targetRechercheUser.userid} targetRechercheUser={targetRechercheUser} auth={auth} setAuth={setAuth} indexPage={indexPage} setindexPage={setindexPage} profilData={profilData} setprofilData={setprofilData}/>
				: indexPage.index === 1 ?
				<Sectionmain_actu auth={auth} setAuth={setAuth} indexPage={indexPage} setindexPage={setindexPage} profilData={profilData} setprofilData={setprofilData}/>
				: indexPage.index === 4 ?
				<Sectionmain_parametre auth={auth} setAuth={setAuth} indexPage={indexPage} setindexPage={setindexPage} profilData={profilData} setprofilData={setprofilData}/>
				: indexPage.index === 2 ?
				<Sectionmain_recherche auth={auth} setAuth={setAuth} indexPage={indexPage} setindexPage={setindexPage} profilData={profilData} setprofilData={setprofilData}/>
				: indexPage.index === 3 ?
				<Sectionmain_message auth={auth} setAuth={setAuth} indexPage={indexPage} setindexPage={setindexPage} profilData={profilData} setprofilData={setprofilData}/>
				: null
			}
			{
				(indexPage.index !== 2 && indexPage.index !== 3) &&
				<Sectionmain_aside auth={auth} setAuth={setAuth} indexPage={indexPage} setindexPage={setindexPage} profilData={profilData} setprofilData={setprofilData} targetRechercheUser={targetRechercheUser} settargetRechercheUser={settargetRechercheUser}/>
			}
		</div>
	)
}

export default Bodymain