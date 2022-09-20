import '../styles/Sectionmain_recherche.css'
import Sectionmain_aside from './Sectionmain_aside'
import Sectionmain_profil from './Sectionmain_profil'
import { useState,useEffect } from 'react'
import IconButton from '@mui/material/IconButton'
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace'

function Sectionmain_recherche({auth,setAuth,indexPage,setindexPage,profilData,setprofilData}) {
	let [targetRechercheUser,settargetRechercheUser] = useState({userid:undefined});
	return (
		<>
			{
			targetRechercheUser.userid === undefined ?
			<section id="section_recherche">
				<Sectionmain_aside key={10} auth={auth} setAuth={setAuth} indexPage={indexPage} setindexPage={setindexPage} targetRechercheUser={targetRechercheUser} settargetRechercheUser={settargetRechercheUser}/>
			</section>
			:
			<>
			<IconButton className="buttonback_nav" onClick={(e)=>settargetRechercheUser({userid:undefined})} color="primary" aria-label="Back" component="label">
				<KeyboardBackspaceIcon />
			</IconButton>
			<Sectionmain_profil key={20} targetRechercheUser={targetRechercheUser} auth={auth} setAuth={setAuth} indexPage={indexPage} setindexPage={setindexPage} profilData={profilData}/>
			</>
			}
		</>
	)
}

export default Sectionmain_recherche