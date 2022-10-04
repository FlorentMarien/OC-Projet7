import '../styles/Sectionmain_recherche.css'
import Sectionmain_aside from './Sectionmain_aside'
import Sectionmain_profil from './Sectionmain_profil'
import { useState,useEffect } from 'react'

function Sectionmain_recherche({auth,setAuth,indexPage,setindexPage,profilData,setprofilData}) {
	let [targetRechercheUser,settargetRechercheUser] = useState({userid:undefined});
	return (
		<>
			{
			targetRechercheUser.userid === undefined ?
			<section id="section_recherche" className="section--alone">
				<Sectionmain_aside key={10} auth={auth} setAuth={setAuth} indexPage={indexPage} setindexPage={setindexPage} targetRechercheUser={targetRechercheUser} settargetRechercheUser={settargetRechercheUser}/>
			</section>
			:
			<>
			<Sectionmain_profil key={20} targetRechercheUser={targetRechercheUser} auth={auth} setAuth={setAuth} indexPage={indexPage} setindexPage={setindexPage} profilData={profilData}/>
			<Sectionmain_aside key={21} auth={auth} setAuth={setAuth} indexPage={indexPage} setindexPage={setindexPage} targetRechercheUser={targetRechercheUser} settargetRechercheUser={settargetRechercheUser}/>
			</>
			}
		</>
	)
}

export default Sectionmain_recherche