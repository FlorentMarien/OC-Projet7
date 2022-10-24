import '../styles/Auth.css';
import { useState, useRef } from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import PhotoCamera from '@mui/icons-material/PhotoCamera';

function Auth({ auth, setAuth }) {
    const [state, setState] = useState(0);
    const [formFile, setformFile] = useState('');
    const [stateSignupEmail, setstateSignupEmail] = useState('');
    const [stateSignupPassword, setstateSignupPassword] = useState('');
    const [stateSignupName, setstateSignupName] = useState('');
    const [stateSignupPrename, setstateSignupPrename] = useState('');
    const [stateSignupFile, setstateSignupFile] = useState('');
    const [helperText, sethelperText] = useState('');
    let emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
    const theme = createTheme({
        palette: {
            neutral: {
                color: '#fff',
            },
            text: {
                primary: '#fff', //
                secondary: '#aaa', //
                Onprimary: '000',
                surface: '#EEE',
                on_surface: '#EEE',
                background: '#EEE',
                borderColor: '#fff',
            },
            primary: {
                main: '#000', // Button color
            },
        },
    });
    function submitUser(e) {
        e.preventDefault();
        let formData = new FormData();
        let formContact = {
            email: document.getElementById('formEmail').value,
            password: document.getElementById('formPassword').value,
            name: document.getElementById('formName').value,
            prename: document.getElementById('formPrename').value,
        };
        if (
            emailRegex.test(formContact.email) &&
            formContact.password !== '' &&
            formContact.name !== '' &&
            formContact.prename !== '' &&
            formFile !== ''
        ) {
            formData.append('user', JSON.stringify(formContact));
            formData.append('image', formFile);
            sendUser(formData).then((result) => {
                if (result.error) {
                    if (
                        result.error.message.indexOf(
                            'expected `email` to be unique.'
                        ) !== -1
                    ) {
                        setstateSignupEmail('error');
                        sethelperText('Email already use');
                    }
                } else {
                    setState(2);
                }
            });
        } else {
            if (!emailRegex.test(formContact.email)) {
                setstateSignupEmail('error');
                sethelperText('Incorrect entry.');
            } else {
                if (stateSignupEmail === 'error') {
                    setstateSignupEmail('');
                }
            }
            if (formContact.password === '') {
                setstateSignupPassword('error');
            } else {
                if (stateSignupPassword === 'error') setstateSignupPassword('');
            }
            if (formContact.name === '') {
                setstateSignupName('error');
            } else {
                if (stateSignupName === 'error') setstateSignupName('');
            }
            if (formContact.prename === '') {
                setstateSignupPrename('error');
            } else {
                if (stateSignupPrename === 'error') setstateSignupPrename('');
            }
            if (formFile === '') {
                document.getElementsByTagName('svg')[0].style.fill = 'red';
            } else {
                if (
                    document.getElementsByTagName('svg')[0].style.fill === 'red'
                ) {
                    document.getElementsByTagName('svg')[0].style.fill = 'gray';
                }
            }
        }
    }
    function loginUser(e) {
        e.preventDefault();
        const formData = new FormData();
        const formAuth = {
            email: document.getElementById('loginEmail').value,
            password: document.getElementById('loginPassword').value,
        };
        formData.append('user', JSON.stringify(formAuth));
        sendloginUser(formAuth).then((result) => {
            if (result !== undefined) {
                localStorage.setItem('userid', result.userId);
                localStorage.setItem('token', result.token);
                setAuth([1, result.userId, result.token]);
            }
        });
    }
    async function sendloginUser(formAuth) {
        return await fetch('http://localhost:3000/api/auth/login', {
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            method: 'POST',
            body: JSON.stringify(formAuth),
        })
            .then(function (res) {
                if (res.ok) {
                    return res.json();
                }
            })
            .then(function (result) {
                return result;
            })
            .catch(function (err) {
                // Une erreur est survenue
            });
    }
    async function sendUser(objectContact) {
        return await fetch('http://localhost:3000/api/auth/signup', {
            method: 'POST',
            body: objectContact,
        })
            .then(function (res) {
                return res.json();
            })
            .then(function (result) {
                return result;
            })
            .catch(function (err) {
                // Une erreur est survenue
            });
    }
    function getimgpreview() {
        let urlFile = URL.createObjectURL(formFile);
        return <img src={urlFile} alt="Photo de profil" />;
    }

    return state === 0 ? (
        <div className="blockauth">
            <form>
                <ThemeProvider theme={theme}>
                    <Button variant="contained" onClick={() => setState(1)}>
                        Inscription
                    </Button>
                    <Button variant="contained" onClick={() => setState(2)}>
                        Login
                    </Button>
                </ThemeProvider>
            </form>
        </div>
    ) : state === 1 ? (
        <div className="blockauth">
            <form className="formlogin">
                <h1>Signup</h1>
                <ThemeProvider theme={theme}>
                    {formFile === '' ? (
                        <IconButton
                            error={stateSignupFile}
                            color="primary"
                            aria-label="upload picture"
                            component="label"
                        >
                            <input
                                hidden
                                accept="image/*"
                                onChange={(e) => setformFile(e.target.files[0])}
                                type="file"
                                id="formFile"
                            />
                            <PhotoCamera />
                        </IconButton>
                    ) : (
                        <div className="form_container_preview">
                            {getimgpreview()}
                            <button
                                className="button_delpreview"
                                onClick={(e) => setformFile('')}
                            >
                                x
                            </button>
                        </div>
                    )}
                    <TextField
                        error={stateSignupEmail}
                        helperText={helperText}
                        color="neutral"
                        type="email"
                        id="formEmail"
                        label="Email"
                        variant="outlined"
                        onChange={(e) => {
                            let msg = e.target.value;

                            if (emailRegex.test(msg)) {
                                setstateSignupEmail('');
                                sethelperText('');
                            } else {
                                setstateSignupEmail('error');
                                sethelperText('Incorrect entry.');
                            }
                        }}
                    />
                    <TextField
                        error={stateSignupPassword}
                        color="neutral"
                        type="password"
                        id="formPassword"
                        label="Password"
                        variant="outlined"
                    />
                    <TextField
                        error={stateSignupName}
                        color="neutral"
                        type="text"
                        id="formName"
                        label="Name"
                        variant="outlined"
                    />
                    <TextField
                        error={stateSignupPrename}
                        color="neutral"
                        type="text"
                        id="formPrename"
                        label="Prename"
                        variant="outlined"
                    />
                    <Button variant="contained" onClick={(e) => submitUser(e)}>
                        S'inscrire
                    </Button>
                    <Button variant="contained" onClick={(e) => setState(0)}>
                        Retour
                    </Button>
                </ThemeProvider>
            </form>
        </div>
    ) : state === 2 ? (
        <div className="blockauth">
            <form className="formlogin">
                <h1>Login</h1>
                <ThemeProvider theme={theme}>
                    <TextField
                        color="neutral"
                        type="text"
                        id="loginEmail"
                        label="Email"
                        variant="outlined"
                    />
                    <TextField
                        color="neutral"
                        type="password"
                        id="loginPassword"
                        label="Password"
                        variant="outlined"
                    />
                    <Button variant="contained" onClick={(e) => loginUser(e)}>
                        Login
                    </Button>
                    <Button variant="contained" onClick={(e) => setState(0)}>
                        Retour
                    </Button>
                </ThemeProvider>
            </form>
        </div>
    ) : null;
}

export default Auth;
