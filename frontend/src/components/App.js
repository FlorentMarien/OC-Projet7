import { useState } from 'react';
import Header from './Header';
import Footer from './Footer';
import Auth from './Auth';
import Bodymain from './Bodymain';
import '../styles/App.css';
function App() {
    const [auth, setAuth] = useState([
        localStorage.getItem('userid') ? 1 : 0,
        localStorage.getItem('userid'),
        localStorage.getItem('token'),
    ]);
    //[0]=0Non identifié [0]=1 Identifié
    //[1]Userid
    //[2]Bearer
    return (
        <>
            <Header auth={auth} setAuth={setAuth} />
            <main>
                {auth[0] === 0 ? (
                    <Auth auth={auth} setAuth={setAuth} />
                ) : auth[0] === 1 ? (
                    <Bodymain auth={auth} setAuth={setAuth} />
                ) : null}
            </main>
            <Footer />
        </>
    );
}

export default App;
