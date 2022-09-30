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
	function redirectPage(e,index){
		setindexPage({index:index,emetteur:"navbar"});
	}
	return (
		<nav className='nav-left'>
			<>
			<ButtonGroup>
			<Button color="primary" variant={buttonVariant} startIcon={<AccountCircleIcon />} onClick={(e)=>redirectPage(e,0)}>
				<p className='--textbutton'>Profil</p>
			</Button>
			<Button color="primary" variant={buttonVariant} startIcon={<DvrIcon />} onClick={(e)=>redirectPage(e,1)}>
				<p className='--textbutton'>Actualité</p>
			</Button>
			<Button color="primary" variant={buttonVariant} startIcon={<SearchIcon />} onClick={(e)=>redirectPage(e,2)}>
				<p className='--textbutton'>Recherche</p>
			</Button>
			<Button color="primary" variant={buttonVariant} startIcon={<MessageIcon />} onClick={(e)=>redirectPage(e,3)}>
				<p className='--textbutton'>Messages</p>
			</Button>
			<Button color="primary" variant={buttonVariant} startIcon={<TuneIcon />} onClick={(e)=>redirectPage(e,4)}>
				<p className='--textbutton'>Paramétres</p>
			</Button>
			<Button color="primary" variant={buttonVariant} startIcon={<LogoutIcon />} onClick={(e)=>setAuth([0])}>
				<p className='--textbutton'>Déconnection</p>
			</Button>
			</ButtonGroup>
			<Button variant={buttonVariant} id="nav_button_UserInfo" onClick={(e)=>{redirectPage(e,0)}}>
				<img src={ profilData.imageUrl } alt={profilData.name}/>
				<p>{ profilData.name } { profilData.prename }</p>
			</Button>
			</>
		</nav>
	)
}

export default Nav