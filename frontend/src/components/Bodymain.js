import '../styles/Bodymain.css'

import { useState,useEffect } from 'react'
import Nav from './Nav'
import Footer from './Footer'
import Sectionmain_profil from './Sectionmain_profil'
import Sectionmain_actu from './Sectionmain_actu'
function Bodymain({auth,setAuth}) {
	const [indexPage,setindexPage] = useState(1);
	const [profilData,setprofilData] = useState(0);
	useEffect(() => {
		async function getUser(){
			return await fetch("http://localhost:3000/api/auth/getlogin",{
				headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/json',
					'Authorization': "Bearer "+auth[2]
				},
				method: 'POST',
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
		
		getUser().then((result)=>{
			if(!result.error){
			setprofilData({
				state:1,
				name:result.name,
				prename:result.prename,
				imageUrl:result.imageUrl,
				adminLevel: result.adminLevel,
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
	}, [auth]);
	return (
		<div id="main_container">
			<Nav auth={auth} setAuth={setAuth} indexPage={indexPage} setindexPage={setindexPage} profilData={profilData} setprofilData={setprofilData}/>
			{
				indexPage === 0 ?
				<Sectionmain_profil auth={auth} setAuth={setAuth} indexPage={indexPage} setindexPage={setindexPage} profilData={profilData} setprofilData={setprofilData}/>
				: indexPage === 1 ?
				<Sectionmain_actu auth={auth} setAuth={setAuth} indexPage={indexPage} setindexPage={setindexPage} profilData={profilData} setprofilData={setprofilData}/>
				: null
			}
		</div>
	)
}

export default Bodymain