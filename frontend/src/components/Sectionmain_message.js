import '../styles/Sectionmain_message.css';
import { useState, useEffect, useRef } from 'react';
import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import IconButton from '@mui/material/IconButton';
import Sectionmain_aside from './Sectionmain_aside';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import DeleteIcon from '@mui/icons-material/Delete';
import PhotoCamera from '@mui/icons-material/PhotoCamera';

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
function Sectionmain_message({
    auth,
    setAuth,
    indexPage,
    setindexPage,
    profilData,
    setprofilData,
    chat,
    targetRechercheUserPrivateMessage,
    settargetRechercheUserPrivateMessage,
}) {
    const [targetPage, settargetPage] = useState(0);
    const [listMessage, setlistMessage] = useState([null]);
    const [listPreviewMessage, setlistPreviewMessage] = useState([null]);
    const [formFile, setformFile] = useState('');
    const [stateInput, setstateInput] = useState('');
    let objectUser = {
        userId: auth[1],
        destuserId: targetRechercheUserPrivateMessage.userid,
    };
    function getimgpreview() {
        let urlFile = URL.createObjectURL(formFile);
        return (
            <div>
                <span className="container_uploadimg">
                    <img
                        src={urlFile}
                        alt={
                            'Photo de ' +
                            profilData.name +
                            ' ' +
                            profilData.prename
                        }
                    />

                    <IconButton
                        onClick={(e) => setformFile('')}
                        color="primary"
                        aria-label="delete picture"
                        component="label"
                    >
                        <DeleteIcon />
                    </IconButton>
                </span>
            </div>
        );
    }
    function convertBase64toFile(img) {
        let arr = img.split(','),
            mime = arr[0].match(/:(.*?);/)[1],
            bstr = atob(arr[1]),
            n = bstr.length,
            u8arr = new Uint8Array(n);
        while (n--) {
            u8arr[n] = bstr.charCodeAt(n);
        }
        let file = new File([u8arr], 'img', { type: mime });
        return URL.createObjectURL(file);
    }
    function getIntervalDate(dateTime) {
        dateTime = Math.round(
            (new Date(Date.now()) - new Date(dateTime).getTime()) / 1000
        );
        if (dateTime < 60) return 'Post?? il y a ' + dateTime + ' secondes';
        else if (dateTime >= 60 && dateTime < 3600)
            return 'Post?? il y a ' + Math.round(dateTime / 60) + ' minutes';
        else if (dateTime >= 3600 && dateTime < 3600 * 24)
            return 'Post?? il y a ' + Math.round(dateTime / 3600) + ' heures';
        else if (dateTime >= 3600 * 24)
            return (
                'Post?? il y a ' + Math.round(dateTime / (3600 * 24)) + ' jours'
            );
        else return 'Erreur';
    }
    function getBackMessage() {
        let reply;
        if (listMessage.length > 0 && listMessage[0] !== null) {
            listMessage.forEach((element) => {
                let parametre;
                if (element.userId === auth[1])
                    parametre = 'privateMessage_user';
                else parametre = 'privateMessage_destuser';
                reply = (
                    <>
                        {reply}
                        <div className={parametre.toString()}>
                            <div>{element.name}</div>
                            <div>
                                <p>{element.message}</p>
                                {element.img && (
                                    <img
                                        src={convertBase64toFile(element.img)}
                                    ></img>
                                )}
                            </div>
                        </div>
                    </>
                );
            });
        }
        return reply;
    }
    async function getPrivatemessage(objectUser) {
        return await fetch('http://localhost:3000/api/privatemessage/get', {
            headers: {
                Authorization: 'Bearer ' + auth[2],
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            method: 'POST',
            body: objectUser,
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
    function getPreviewMessage() {
        let reply;
        listPreviewMessage.forEach((element) => {
            let parametre = 'lastprivateMessage_user';
            reply = (
                <>
                    {reply}
                    <div
                        className={parametre.toString()}
                        destuserid={
                            auth[1] === element.userId
                                ? element.destuserId
                                : element.userId
                        }
                        onClick={(e) => {
                            if (auth[1] === element.userId) {
                                settargetRechercheUserPrivateMessage({
                                    ...targetRechercheUserPrivateMessage,
                                    userid: element.destuserId,
                                });
                            } else {
                                settargetRechercheUserPrivateMessage({
                                    ...targetRechercheUserPrivateMessage,
                                    userid: element.userId,
                                });
                            }
                        }}
                    >
                        <div className="message_container_img">
                            <img src={element.profilimageUrl}></img>
                        </div>
                        <div className="message_container_info">
                            <p>
                                {element.profilname +
                                    ' ' +
                                    element.profilprename}
                            </p>
                            <p>{element.message}</p>
                            <p>{getIntervalDate(element.dateTime)}</p>
                        </div>
                    </div>
                </>
            );
        });
        reply = <div className="message_historique">{reply}</div>;
        return reply;
    }
    async function getLastmessage(objectUser) {
        return await fetch(
            'http://localhost:3000/api/privatemessage/getlastmessage',
            {
                headers: {
                    Authorization: 'Bearer ' + auth[2],
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
                method: 'POST',
                body: objectUser,
            }
        )
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
    useEffect(() => {
        chat.imageUrl = formFile;
    }, [formFile]);
    useEffect(() => {
        if (targetRechercheUserPrivateMessage.userid !== undefined) {
            getPrivatemessage(JSON.stringify(objectUser)).then((res) => {
                setlistMessage([...res.conversation]);
                chat.name = profilData.name + ' ' + profilData.prename;
                chat.destuserId = targetRechercheUserPrivateMessage.userid;
                chat.initPrivate();
            });
        } else {
            getLastmessage(JSON.stringify({ userId: auth[1] })).then((res) => {
                chat.destuserId = null;
                setlistPreviewMessage([...res.conversation]);
            });
        }
        return () => {
            if (chat.destuserId !== null) {
                chat.send('Exit the chat room.', 'close');
            }
        };
    }, [targetRechercheUserPrivateMessage]);
    return (
        <>
            {targetRechercheUserPrivateMessage.userid === undefined ? (
                <section id="section_privatemessage">
                    <div id="notifprivatemessage"></div>

                    <>
                        <div
                            id="privatemessage_previewmessage"
                            className={
                                targetPage === 1 ? 'grow0_4 paddingright10' : ''
                            }
                        >
                            <div className="previewmessage_addbutton">
                                <Button
                                    className="message_buttonrechercheuser"
                                    onClick={(e) => {
                                        let open = 0;
                                        if (targetPage === 0) {
                                            open = 1;
                                        } else {
                                            open = 0;
                                        }
                                        settargetPage(open);
                                    }}
                                >
                                    +
                                </Button>
                            </div>
                            {listPreviewMessage.length > 0 &&
                                listPreviewMessage[0] !== null &&
                                getPreviewMessage()}
                        </div>
                    </>

                    <div
                        id="privatemessage_rechercheuser"
                        className={
                            targetPage === 1 ? 'grow0_6 paddingleft10' : ''
                        }
                    >
                        {targetPage === 1 && (
                            <Sectionmain_aside
                                key={10}
                                auth={auth}
                                setAuth={setAuth}
                                indexPage={indexPage}
                                setindexPage={setindexPage}
                                targetRechercheUser={
                                    targetRechercheUserPrivateMessage
                                }
                                settargetRechercheUser={
                                    settargetRechercheUserPrivateMessage
                                }
                            />
                        )}
                    </div>
                </section>
            ) : (
                <>
                    <section className="section--alone">
                        <div id="notifprivatemessage"></div>
                        <div
                            id="chatShow"
                            userid={auth[1]}
                            destuserid={
                                targetRechercheUserPrivateMessage.userid
                            }
                        >
                            {getBackMessage()}
                        </div>
                        <div id="iswrite" className="privateMessage_destuser">
                            <p>L'utilisateur est en train d'??crire...</p>
                        </div>
                        <form id="chatForm">
                            <ThemeProvider theme={theme}>
                                <IconButton
                                    onClick={(e) =>
                                        settargetRechercheUserPrivateMessage({
                                            ...targetRechercheUserPrivateMessage,
                                            userid: undefined,
                                        })
                                    }
                                    color="primary"
                                    aria-label="Back"
                                    component="label"
                                >
                                    <KeyboardBackspaceIcon />
                                </IconButton>
                                <div className="sendreply_uploadimg">
                                    {formFile === '' ? (
                                        <IconButton
                                            color="primary"
                                            aria-label="upload picture"
                                            component="label"
                                        >
                                            <input
                                                hidden
                                                accept="image/*"
                                                onChange={(e) =>
                                                    setformFile(
                                                        e.target.files[0]
                                                    )
                                                }
                                                type="file"
                                                id="formFile"
                                            />
                                            <PhotoCamera />
                                        </IconButton>
                                    ) : (
                                        getimgpreview()
                                    )}
                                </div>
                                <TextField
                                    className={stateInput.toString()}
                                    color="neutral"
                                    type="text"
                                    id="chatMsg"
                                    label="Message"
                                    variant="filled"
                                    defaultValue="Votre Message?"
                                    onChange={(e) => {
                                        e.target.value.length > 0
                                            ? chat.isWrite({ isWrite: true })
                                            : chat.isWrite({ isWrite: false });
                                    }}
                                />
                                <Button
                                    variant="contained"
                                    id="chatGo"
                                    type="submit"
                                    value="Go"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        if (formFile !== '') {
                                            setstateInput('');
                                            chat.msg =
                                                document.getElementById(
                                                    'chatMsg'
                                                ).value;
                                            chat.send(formFile, 'sendfile');
                                            setformFile('');
                                        } else if (
                                            document.getElementById('chatMsg')
                                                .value !== ''
                                        ) {
                                            chat.send(
                                                document.getElementById(
                                                    'chatMsg'
                                                ).value,
                                                'send'
                                            );
                                            setstateInput('');
                                        } else setstateInput('errorinput');
                                    }}
                                >
                                    Go
                                </Button>
                            </ThemeProvider>
                        </form>
                    </section>
                </>
            )}
        </>
    );
}

export default Sectionmain_message;
