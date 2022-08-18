import '../styles/Sectionmain_profil.css'

function Sectionmain_profil({auth,setAuth,profilData,setprofilData}) {
	return (
		<section>
			<div id="blockprofil">
				{
					profilData[0]!==0 &&
					<>
					<img src={ profilData.imageUrl } alt={profilData.name}/>
					<ul>
						<li>Nom: { profilData.name } Prenom: { profilData.prename }</li>
					</ul>
					</>
				}
			</div>
		</section>
	)
}

export default Sectionmain_profil