import '../styles/Sectionmain_recherche.css'
import Sectionmain_aside from './Sectionmain_aside'
import { useState,useEffect } from 'react'

function Sectionmain_recherche({auth,setAuth,indexPage,setindexPage,targetRechercheUser,settargetRechercheUser}) {
	return (
		<section>
			<Sectionmain_aside auth={auth} setAuth={setAuth} indexPage={indexPage} setindexPage={setindexPage} targetRechercheUser={targetRechercheUser} settargetRechercheUser={settargetRechercheUser}/>
		</section>
	)
}

export default Sectionmain_recherche