import '../styles/Sectionmain_parametre.css'
import { useState,useEffect } from 'react'
import { library } from '@fortawesome/fontawesome-svg-core'
import { fas } from '@fortawesome/free-solid-svg-icons'
import Message from './Message'
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { createTheme,ThemeProvider } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import DeleteIcon from '@mui/icons-material/Delete';
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';

library.add(fas)
const theme = createTheme({
	palette: {
		neutral:{
			color:'#fff',
		},
		text:{
			primary:'#fff', // 
			secondary:'#aaa', //
		},
		/*primary:{
			main:'#000', // Button color
		}*/
	},
  });
function Sectionmain_parametre({auth,setAuth,indexPage,setindexPage,profilData,setprofilData}) {
	return (
	<section>
		<p>Parametre</p>
	</section>
	)
}
export default Sectionmain_parametre