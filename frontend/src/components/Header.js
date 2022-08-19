import '../styles/Header.css'
import logo from '../assets/logo/icon-left-font-monochrome-white.svg'
function Header({auth,setAuth}) {
	return (
		<header>
			<img src={logo} alt="Logo Groupomania"/>
        </header>
	)
}

export default Header