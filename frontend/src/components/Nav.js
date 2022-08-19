import '../styles/Nav.css'

function Nav({auth,setAuth,indexPage,setindexPage,profilData,setprofilData}) {
	return (
		<nav>
			<ul>
				<div>
				<li><button onClick={()=>setindexPage(0)}>Profil</button></li>
				<li><button onClick={()=>setindexPage(1)}>Actualité</button></li>
				<li><button onClick={()=>setindexPage(2)}>Recherche</button></li>
				<li><button onClick={()=>setindexPage(3)}>Messages</button></li>
				<li><button onClick={()=>setindexPage(4)}>Paramétres</button></li>
				<li><button onClick={()=>setAuth([0])}>Déconnection</button></li>
				</div>
				{
				profilData[0]!==0 ?
				<li>
					<button id="nav_button_UserInfo" onClick={()=>setindexPage(0)}>
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