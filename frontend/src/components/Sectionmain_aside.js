import '../styles/Sectionmain_aside.css'
import { useState,useEffect } from 'react'

function Sectionmain_aside({auth,setAuth,indexPage,setindexPage,profilData,setprofilData,targetRechercheUser,settargetRechercheUser}) {
	const [userList,setuserList] = useState([null]);
	const [formuserRecherche,setformuserRecherche] = useState("Qui recherchez vous?");
	function getRechercheuser(value){
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
				<button className="recherche_user" onClick={(e)=>{
					settargetRechercheUser({userid:element._id,emetteur:"navbar-aside"});
					}}>
					<div>
						<img src={element.imageUrl} alt={element.name + " " + element.prename} />
					</div>
					<div>
						<p>{element.name + " " + element.prename}</p>
					</div>
				</button>
				</>
			);
		});
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
				<input type="text" defaut-value={"Nom Prénom?"} onChange={(e)=>{getRechercheuser(e.target.value)}} placeholder="Name?"></input>
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