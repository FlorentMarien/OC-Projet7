import '../styles/Bodymain.css'

import { useState,useEffect } from 'react'
import Nav from './Nav'
import Sectionmain_profil from './Sectionmain_profil'
import Sectionmain_actu from './Sectionmain_actu'
import Sectionmain_parametre from './Sectionmain_parametre'
import Sectionmain_aside from './Sectionmain_aside'
function Bodymain({auth,setAuth}) {
	const [indexPage,setindexPage] = useState(1);
	const [profilData,setprofilData] = useState(0);
	const [targetRechercheUser,settargetRechercheUser] = useState({userid:undefined});
	
	useEffect(() => {
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
	
	return (
		<div id="main_container">
			<Nav auth={auth} setAuth={setAuth} indexPage={indexPage} setindexPage={setindexPage} profilData={profilData} setprofilData={setprofilData}/>
			{
				
				indexPage === 0 ?
				<Sectionmain_profil targetRechercheUser={{userid:auth[1]}} auth={auth} setAuth={setAuth} indexPage={indexPage} setindexPage={setindexPage} profilData={profilData} setprofilData={setprofilData}/>
				: indexPage === 1 ?
				<Sectionmain_actu auth={auth} setAuth={setAuth} indexPage={indexPage} setindexPage={setindexPage} profilData={profilData} setprofilData={setprofilData}/>
				: indexPage === 4 ?
				<Sectionmain_parametre auth={auth} setAuth={setAuth} indexPage={indexPage} setindexPage={setindexPage} profilData={profilData} setprofilData={setprofilData}/>
				: typeof indexPage === 'object' ?
				<Sectionmain_profil targetRechercheUser={indexPage} settargetRechercheUser={settargetRechercheUser} auth={auth} setAuth={setAuth} indexPage={indexPage} setindexPage={setindexPage} profilData={profilData} setprofilData={setprofilData}/>
				: null
			}
			<Sectionmain_aside auth={auth} setAuth={setAuth} indexPage={indexPage} setindexPage={setindexPage} profilData={profilData} setprofilData={setprofilData} targetRechercheUser={targetRechercheUser} settargetRechercheUser={settargetRechercheUser}/>
		</div>
	)
}

export default Bodymain