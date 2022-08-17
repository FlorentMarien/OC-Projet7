import '../styles/Bodymain.css'
import { useState } from 'react'
import Nav from './Nav'

function Bodymain({auth,setAuth}) {
	const [indexPage,setindexPage] = useState(0);
	return (
		<div id="main_container">
			<Nav auth={auth} setAuth={setAuth} indexPage={indexPage} setindexPage={setindexPage}/>
			{
				indexPage === 0 ?
				<h1>Page 1</h1>
				: indexPage === 1 &&
				<h1>Page 2</h1>
			}
		</div>
	)
}

export default Bodymain