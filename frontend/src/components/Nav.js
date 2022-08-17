import '../styles/Nav.css'

function Nav({auth,setAuth,indexPage,setindexPage}) {
	return (
		<nav>
			<ul>
				<li><button onClick={()=>setindexPage(0)}>Profil</button></li>
				<li><button onClick={()=>setindexPage(1)}>Liste d'actualité</button></li>
				<li><button onClick={()=>setindexPage(2)}>Recherche</button></li>
				<li><button onClick={()=>setindexPage(3)}>Messages</button></li>
				<li><button onClick={()=>setindexPage(4)}>Paramétre</button></li>
				<li><button onClick={()=>setAuth([0])}>Déconnection</button></li>
			</ul>
		</nav>
	)
}

export default Nav