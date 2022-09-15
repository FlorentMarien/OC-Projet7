import '../styles/Nav.css'

function Nav({auth,setAuth,indexPage,setindexPage,profilData,setprofilData,settargetRechercheUser}) {
	return (
		<nav>
			<ul>
				<div>
				<li><button onClick={()=>setindexPage({index:0,emetteur:"navbar"})}>Profil</button></li>
				<li><button onClick={()=>setindexPage({index:1,emetteur:"navbar"})}>Actualité</button></li>
				<li><button onClick={()=>setindexPage({index:2,emetteur:"navbar"})}>Recherche</button></li>
				<li><button onClick={()=>setindexPage({index:3,emetteur:"navbar"})}>Messages</button></li>
				<li><button onClick={()=>setindexPage({index:4,emetteur:"navbar"})}>Paramétres</button></li>
				<li><button onClick={()=>setAuth([0])}>Déconnection</button></li>
				</div>
				{
				profilData[0]!==0 ?
				<li>
					<button id="nav_button_UserInfo" onClick={()=>setindexPage({index:0})}>
					<img src={ profilData.imageUrl } alt={profilData.name}/>
					<p>{ profilData.name } { profilData.prename }</p>
					</button>
				</li>
				:null
				}
			</ul>
		</nav>
	)
}

export default Nav