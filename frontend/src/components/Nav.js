import '../styles/Nav.css'
import ButtonGroup from '@mui/material/ButtonGroup'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import DvrIcon from '@mui/icons-material/Dvr';
import SearchIcon from '@mui/icons-material/Search';
import MessageIcon from '@mui/icons-material/Message';
import TuneIcon from '@mui/icons-material/Tune';
import LogoutIcon from '@mui/icons-material/Logout';

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
			<ButtonGroup>
			<Button color="primary" variant={buttonVariant} startIcon={<AccountCircleIcon />} onClick={(e)=>setindexPage({index:0,emetteur:"navbar"})}>
				<p className='--textbutton'>Profil</p>
			</Button>
			<Button color="primary" variant={buttonVariant} startIcon={<DvrIcon />} onClick={(e)=>setindexPage({index:1,emetteur:"navbar"})}>
				<p className='--textbutton'>Actualité</p>
			</Button>
			<Button color="primary" variant={buttonVariant} startIcon={<SearchIcon />} onClick={(e)=>setindexPage({index:2,emetteur:"navbar"})}>
				<p className='--textbutton'>Recherche</p>
			</Button>
			<Button color="primary" variant={buttonVariant} startIcon={<MessageIcon />} onClick={(e)=>setindexPage({index:3,emetteur:"navbar"})}>
				<p className='--textbutton'>Messages</p>
			</Button>
			<Button color="primary" variant={buttonVariant} startIcon={<TuneIcon />} onClick={(e)=>setindexPage({index:4,emetteur:"navbar"})}>
				<p className='--textbutton'>Paramétres</p>
			</Button>
			<Button color="primary" variant={buttonVariant} startIcon={<LogoutIcon />} onClick={(e)=>setAuth([0])}>
				<p className='--textbutton'>Déconnection</p>
			</Button>
			</ButtonGroup>
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