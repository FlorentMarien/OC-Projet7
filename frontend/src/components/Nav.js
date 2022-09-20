import '../styles/Nav.css'
import ButtonGroup from '@mui/material/ButtonGroup'
import Button from '@mui/material/Button'

function Nav({auth,setAuth,indexPage,setindexPage,profilData,setprofilData,settargetRechercheUser}) {
	let buttonVariant="contained";
	let ASUPRIMER=0;
	return (
		<nav className='nav-left'>
			<>
			{
			ASUPRIMER===1 ?
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
			:
			<>
			<div>
			<Button variant={buttonVariant} onClick={(e)=>setindexPage({index:0,emetteur:"navbar"})}>Profil</Button>
			<Button variant={buttonVariant} onClick={(e)=>setindexPage({index:1,emetteur:"navbar"})}>Actualité</Button>
			<Button variant={buttonVariant} onClick={(e)=>setindexPage({index:2,emetteur:"navbar"})}>Recherche</Button>
			<Button variant={buttonVariant} onClick={(e)=>setindexPage({index:3,emetteur:"navbar"})}>Messages</Button>
			<Button variant={buttonVariant} onClick={(e)=>setindexPage({index:4,emetteur:"navbar"})}>Paramétres</Button>
			<Button variant={buttonVariant} onClick={(e)=>setAuth([0])}>Déconnection</Button>
			</div>

			<Button variant={buttonVariant} id="nav_button_UserInfo" onClick={{index:0,emetteur:"navbar"}}>
				<img src={ profilData.imageUrl } alt={profilData.name}/>
				<p>{ profilData.name } { profilData.prename }</p>
			</Button>
			</>
		}
		</>
		</nav>
	)
}

export default Nav