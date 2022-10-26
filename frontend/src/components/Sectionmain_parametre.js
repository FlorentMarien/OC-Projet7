import '../styles/Sectionmain_parametre.css';
import { useState, useEffect } from 'react';
import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import ButtonGroup from '@mui/material/ButtonGroup';
import SettingsIcon from '@mui/icons-material/Settings';

library.add(fas);

const theme = createTheme({
    palette: {
        neutral: {
            color: '#fff',
        },
        text: {
            primary: '#fff', //
            secondary: '#aaa', //
        },
    },
});

function Sectionmain_parametre({
    auth,
    setAuth,
    indexPage,
    setindexPage,
    profilData,
    setprofilData,
}) {
    const [backPassword, setbackPassword] = useState('');
    const [confirmbackPassword, setconfirmbackPassword] = useState('');
    const [newbackPassword, setnewbackPassword] = useState('');
    const [statePassword, setstatePassword] = useState('');
    const [profilName, setprofilName] = useState({
        name: profilData.name,
        prename: profilData.prename,
    });
    const [stateprofilName, setstateprofilName] = useState('');
    const [profilEmail, setprofilEmail] = useState({
        oldemail: profilData.email,
        newemail: '',
    });
    const [targetPage, settargetPage] = useState(0);
    const [secondtargetPage, setsecondtargetPage] = useState(0);
    const [formFile, setformFile] = useState([]);
    const [stateErrorEmail, setstateErrorEmail] = useState('');

    let emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
    function delpreviewimg(e, file) {
        e.preventDefault();
        let newformFile = [...formFile];
        newformFile.splice(newformFile.indexOf(file), 1);
        setformFile([...newformFile]);
    }
    function getimgpreview() {
        let reply;
        formFile.forEach((res) => {
            reply = (
                <>
                    {reply}
                    <div>
                        {
                            <img
                                src={URL.createObjectURL(res)}
                                alt={profilData.name}
                            />
                        }
                        {
                            <button
                                onClick={(e) => {
                                    delpreviewimg(e, res);
                                }}
                            >
                                x
                            </button>
                        }
                    </div>
                </>
            );
        });
        return reply;
    }
    function sendImg(e) {
        e.preventDefault();
        let formData = new FormData();

        for (let x = 0; x < formFile.length; x++) {
            formData.append('image', formFile[x]);
        }
        sendImgApi(formData).then((result) => {
            let newprofilData = {
                ...profilData,
                imageArray: result,
            };
            setprofilData(newprofilData);
            setformFile([]);
        });
    }
    async function sendImgApi(formData) {
        return await fetch('http://localhost:3000/api/auth/sendimg', {
            headers: {
                Authorization: 'Bearer ' + auth[2],
            },
            method: 'POST',
            body: formData,
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
    function modifpdp(e) {
        e.preventDefault();
        let objData = {
            imageArray: e.target.closest('div.parametre_img').children[0].src,
        };
        modifpdpApi(JSON.stringify(objData)).then((result) => {
            if (result !== null || result !== undefined) {
                let newprofilData = {
                    ...profilData,
                    imageUrl: result,
                };
                setprofilData(newprofilData);
            }
        });
    }
    function deleteGallery(e) {
        e.preventDefault();
        let objData = {
            imageArray: e.target.closest('div.parametre_img').children[0].src,
        };
        deleteGalleryApi(JSON.stringify(objData)).then((result) => {
            if (result !== null || result !== undefined) {
                let newprofilData = {
                    ...profilData,
                    imageArray: result,
                };
                setprofilData(newprofilData);
            }
        });
    }
    async function deleteGalleryApi(objData) {
        return await fetch('http://localhost:3000/api/auth/deletegallery', {
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + auth[2],
            },
            method: 'PUT',
            body: objData,
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
    async function modifpdpApi(objData) {
        return await fetch('http://localhost:3000/api/auth/modifpdp', {
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + auth[2],
            },
            method: 'PUT',
            body: objData,
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
    function submitmodifpass(e) {
        e.preventDefault();
        if (newbackPassword !== confirmbackPassword) {
            setstatePassword('errorinput');
            document.getElementById('modifmdp_notif').textContent =
                'Erreur lors de la confirmation du mots de passe';
        } else {
            setstatePassword('');
            let objData = {
                backPassword: backPassword,
                newPassword: newbackPassword,
            };
            sendmodifpass(JSON.stringify(objData))
                .then((result) => {
                    if (result === "Erreur de l'ancien mots de passe") {
                        document.getElementById('modifmdp_notif').textContent =
                            result;
                        setstatePassword('errorinput');
                    } else
                        document.getElementById('modifmdp_notif').textContent =
                            'Modification faite';
                })
                .catch((error) => console.log(error));
        }
    }
    function submitmodifname(e) {
        e.preventDefault();
        if (profilName.name === '' || profilName.prename === '') {
            setstateprofilName('errorinput');
            document.getElementById('modifname_notif').textContent =
                "Vous n'avez pas tout saisie";
        } else {
            setstateprofilName('');
            let objData = {
                newname: profilName.name,
                newprename: profilName.prename,
                backname: profilData.name,
                backprename: profilData.prename,
            };
            sendmodifname(JSON.stringify(objData))
                .then((result) => {
                    setprofilData({
                        ...profilData,
                        name: profilName.name,
                        prename: profilName.prename,
                    });
                    document.getElementById('modifname_notif').textContent =
                        'Modification faite';
                })
                .catch((error) => error);
        }
    }
    function submitmodifemail(e) {
        e.preventDefault();
        let verif = true;
        if (profilEmail.newemail === '') {
            verif = false;
            setstateErrorEmail('error');
            document.getElementById('modifemail_notif').textContent =
                "Vous n'avez pas tout saisie";
        } else if (!emailRegex.test(profilEmail.newemail)) {
            verif = false;
            setstateErrorEmail('error');
            document.getElementById('modifemail_notif').textContent =
                "Votre adresse email n'est pas correct";
        }
        if (verif === true) {
            let objData = {
                ...profilEmail,
            };
            sendmodifemail(JSON.stringify(objData))
                .then((result) => {
                    if (result.msg === 'Email modifié') {
                        setstateErrorEmail('');
                        setprofilData({
                            ...profilData,
                            email: profilEmail.newemail,
                        });
                        document.getElementById(
                            'modifemail_notif'
                        ).textContent = 'Modification faite';
                    } else {
                        setstateErrorEmail('error');
                        document.getElementById(
                            'modifemail_notif'
                        ).textContent = result.msg;
                    }
                })
                .catch((err) => console.log(err));
        }
    }
    async function sendmodifpass(objData) {
        return await fetch('http://localhost:3000/api/auth/modifpassword', {
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + auth[2],
            },
            method: 'PUT',
            body: objData,
        })
            .then(function (res) {
                return res.json();
            })
            .then(function (result) {
                return result;
            })
            .catch(function (err) {
                return err;
            });
    }
    async function sendmodifname(objData) {
        return await fetch('http://localhost:3000/api/auth/modifname', {
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + auth[2],
            },
            method: 'PUT',
            body: objData,
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
    async function sendmodifemail(objData) {
        return await fetch('http://localhost:3000/api/auth/modifemail', {
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + auth[2],
            },
            method: 'PUT',
            body: objData,
        })
            .then(function (res) {
                if (res.ok) {
                    return res.json();
                } else {
                    throw res;
                }
            })
            .then(function (result) {
                return result;
            })
            .catch(function (err) {
                return err.json();
            });
    }
    useEffect(() => {
        //Redirection button parcourir Profil
        if (indexPage.emetteur === 'lookgallery') {
            settargetPage(1);
        }
    }, [indexPage]);
    let buttonVariant = 'contained';
    return (
        <section className="section--mid">
            <ButtonGroup
                className="nav-Parametre"
                variant="outlined"
                aria-label="outlined button group"
            >
                <Button
                    variant={buttonVariant}
                    className={targetPage === 0 && 'activeNav'}
                    onClick={(e) => {
                        if (targetPage !== 0) {
                            settargetPage(0);
                        }
                    }}
                >
                    Information
                </Button>
                <Button
                    variant={buttonVariant}
                    className={targetPage === 1 && 'activeNav'}
                    onClick={(e) => {
                        if (targetPage !== 1) {
                            settargetPage(1);
                        }
                    }}
                >
                    Gallery
                </Button>
            </ButtonGroup>
            {targetPage === 0 && (
                <>
                    <ThemeProvider key="210" theme={theme}>
                        <ButtonGroup
                            className="nav-Parametre"
                            variant="outlined"
                            aria-label="outlined button group"
                        >
                            <Button
                                className={
                                    secondtargetPage === 0
                                        ? 'buttonParametre activeNav'
                                        : 'buttonParametre'
                                }
                                variant={buttonVariant}
                                onClick={(e) => {
                                    if (secondtargetPage !== 0) {
                                        setsecondtargetPage(0);
                                    }
                                }}
                            >
                                Nom/Prénom
                            </Button>
                            <Button
                                className={
                                    secondtargetPage === 1
                                        ? 'buttonParametre activeNav'
                                        : 'buttonParametre'
                                }
                                variant={buttonVariant}
                                onClick={(e) => {
                                    if (secondtargetPage !== 1) {
                                        setsecondtargetPage(1);
                                    }
                                }}
                            >
                                Mots de passe
                            </Button>
                            <Button
                                className={
                                    secondtargetPage === 2
                                        ? 'buttonParametre activeNav'
                                        : 'buttonParametre'
                                }
                                variant={buttonVariant}
                                onClick={(e) => {
                                    if (secondtargetPage !== 2) {
                                        setsecondtargetPage(2);
                                    }
                                }}
                            >
                                Adresse email
                            </Button>
                        </ButtonGroup>
                    </ThemeProvider>
                    {secondtargetPage === 0 ? (
                        <div id="parametre_modifname">
                            <p>Modification nom / prénom</p>
                            <form
                                id="modifname_form"
                                className="form-Parametre"
                            >
                                <ThemeProvider key="200" theme={theme}>
                                    <TextField
                                        key="201"
                                        className="parametre_inputtext"
                                        color="neutral"
                                        type="text"
                                        id="formoldname"
                                        label="Name"
                                        variant="outlined"
                                        value={profilData.name}
                                        disabled
                                    />
                                    <TextField
                                        key="202"
                                        className="parametre_inputtext"
                                        color="neutral"
                                        type="text"
                                        id="formoldprename"
                                        label="Prename"
                                        variant="outlined"
                                        value={profilData.prename}
                                        disabled
                                    />

                                    <TextField
                                        key="203"
                                        className={
                                            'parametre_inputtext ' +
                                            stateprofilName
                                        }
                                        color="neutral"
                                        type="text"
                                        id="formnewname"
                                        label="New Name"
                                        variant="outlined"
                                        defaultValue={profilName.name}
                                        onBlur={(e) =>
                                            setprofilName({
                                                ...profilName,
                                                name: e.target.value,
                                            })
                                        }
                                    />
                                    <TextField
                                        key="204"
                                        className={
                                            'parametre_inputtext ' +
                                            stateprofilName
                                        }
                                        color="neutral"
                                        type="text"
                                        id="formnewprename"
                                        label="New Prename"
                                        variant="outlined"
                                        defaultValue={profilName.prename}
                                        onBlur={(e) =>
                                            setprofilName({
                                                ...profilName,
                                                prename: e.target.value,
                                            })
                                        }
                                    />

                                    <Button
                                        variant="contained"
                                        onClick={(e) => {
                                            submitmodifname(e);
                                        }}
                                    >
                                        Modification
                                    </Button>
                                </ThemeProvider>
                                <span id="modifname_notif"></span>
                            </form>
                        </div>
                    ) : secondtargetPage === 1 ? (
                        <div id="parametre_modifmdp">
                            <p>Changement mot de passe</p>

                            <ThemeProvider key="210" theme={theme}>
                                <form
                                    id="modifmdp_form"
                                    className="form-Parametre"
                                    autoComplete="off"
                                >
                                    <TextField
                                        key="211"
                                        color="neutral"
                                        type="email"
                                        id="formEmail"
                                        label="Email"
                                        variant="outlined"
                                        value={profilData.email}
                                        disabled
                                    />
                                    <TextField
                                        key="212"
                                        className={statePassword}
                                        color="neutral"
                                        type="password"
                                        id="formPassword"
                                        label="Password"
                                        variant="outlined"
                                        onBlur={(e) =>
                                            setbackPassword(e.target.value)
                                        }
                                    />
                                    <TextField
                                        key="213"
                                        className={statePassword}
                                        color="neutral"
                                        type="password"
                                        id="confirmformPassword"
                                        label="New Password"
                                        variant="outlined"
                                        onBlur={(e) =>
                                            setconfirmbackPassword(
                                                e.target.value
                                            )
                                        }
                                    />
                                    <TextField
                                        key="214"
                                        className={statePassword}
                                        color="neutral"
                                        type="password"
                                        id="newformPassword"
                                        label="Confirm New Password"
                                        variant="outlined"
                                        onBlur={(e) =>
                                            setnewbackPassword(e.target.value)
                                        }
                                    />
                                    <Button
                                        variant="contained"
                                        onClick={(e) => {
                                            submitmodifpass(e);
                                        }}
                                    >
                                        Modification mots de passe
                                    </Button>
                                </form>
                                <span id="modifmdp_notif"></span>
                            </ThemeProvider>
                        </div>
                    ) : secondtargetPage === 2 ? (
                        <div id="parametre_modifmdp">
                            <p>Changement adresse email</p>

                            <ThemeProvider key="220" theme={theme}>
                                <form
                                    id="modifmdp_form"
                                    className="form-Parametre"
                                    autoComplete="off"
                                >
                                    <TextField
                                        key="221"
                                        color="neutral"
                                        type="email"
                                        id="formEmail"
                                        label="Email"
                                        variant="outlined"
                                        value={profilData.email}
                                        disabled
                                    />
                                    <TextField
                                        error={stateErrorEmail}
                                        key="222"
                                        color="neutral"
                                        type="email"
                                        id="newformEmail"
                                        label="new Email"
                                        variant="outlined"
                                        defaultValue={profilEmail.oldemail}
                                        onBlur={(e) => {
                                            setprofilEmail({
                                                ...profilEmail,
                                                newemail: e.target.value,
                                            });
                                        }}
                                    />

                                    <Button
                                        variant="contained"
                                        onClick={(e) => {
                                            submitmodifemail(e);
                                        }}
                                    >
                                        Modification email
                                    </Button>
                                </form>
                                <span id="modifemail_notif"></span>
                            </ThemeProvider>
                        </div>
                    ) : null}
                </>
            )}
            {targetPage === 1 && (
                <div>
                    <p>Gallery</p>
                    <ButtonGroup
                        variant="outlined"
                        aria-label="outlined button group"
                        orientation="vertical"
                    >
                        <Button component="label">
                            Ajouter Images
                            <input
                                hidden
                                accept="image/*"
                                onChange={(e) => {
                                    setformFile([...e.target.files]);
                                }}
                                type="file"
                                id="formFile"
                                multiple
                            />
                        </Button>
                        {formFile.length !== 0 && (
                            <>
                                <Button
                                    onClick={(e) => {
                                        sendImg(e);
                                    }}
                                >
                                    Envoyer
                                </Button>
                                <div className="parametre_imgpreview">
                                    {getimgpreview()}
                                </div>
                            </>
                        )}
                    </ButtonGroup>
                    {profilData.imageArray.length !== 0 ? (
                        profilData.imageArray.map(function (num) {
                            return (
                                <>
                                    <div className="parametre_img">
                                        <img src={num} alt={profilData.name} />
                                        <Button
                                            onClick={(e) => {
                                                e.target.closest(
                                                    'div'
                                                ).children[2].style.visibility =
                                                    'visible';
                                            }}
                                            disabled={
                                                profilData.imageUrl === num
                                                    ? true
                                                    : false
                                            }
                                        >
                                            <SettingsIcon />
                                        </Button>
                                        <div className="parametre_imgparametre">
                                            <ButtonGroup
                                                className="nav-Parametre"
                                                variant="outlined"
                                                aria-label="outlined button group"
                                            >
                                                <Button
                                                    onClick={(e) => {
                                                        deleteGallery(e);
                                                        e.target.closest(
                                                            'div.parametre_img'
                                                        ).children[2].style.visibility =
                                                            'hidden';
                                                    }}
                                                    disabled={
                                                        profilData.imageUrl ===
                                                        num
                                                            ? true
                                                            : false
                                                    }
                                                >
                                                    Supprimer
                                                </Button>
                                                <Button
                                                    onClick={(e) => {
                                                        modifpdp(e);
                                                        e.target.closest(
                                                            'div.parametre_img'
                                                        ).children[2].style.visibility =
                                                            'hidden';
                                                    }}
                                                    disabled={
                                                        profilData.imageUrl ===
                                                        num
                                                            ? true
                                                            : false
                                                    }
                                                >
                                                    Modifier Photo de profil
                                                </Button>
                                            </ButtonGroup>
                                        </div>
                                    </div>
                                </>
                            );
                        })
                    ) : (
                        <p>Vous n'avez aucune image dans votre Gallery</p>
                    )}
                </div>
            )}
        </section>
    );
}
export default Sectionmain_parametre;
