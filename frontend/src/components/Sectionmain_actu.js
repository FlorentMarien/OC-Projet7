import '../styles/Sectionmain_actu.css';
import { useState, useEffect, useRef } from 'react';
import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';
import Message from './Message';
import Message_reply from './Message_reply';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import DeleteIcon from '@mui/icons-material/Delete';
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import CircularProgress from '@mui/material/CircularProgress';
import NotifSound from '../assets/sound/simple_notification.mp3';
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
        /*primary:{
			main:'#000', // Button color
		}*/
    },
});
function Sectionmain_actu({
    auth,
    setAuth,
    indexPage,
    setindexPage,
    profilData,
    setprofilData,
}) {
    let [listMessage, setListMessage] = useState([]);
    let [limitmessage, setlimitmessage] = useState({
        skipmessage: 0,
        nbrmessage: 5,
    });
    let [nbrmessageapi, setnbrmessageapi] = useState({
        nbrmessage: 0,
        nbrnewmessage: 0,
        firstmessage: '',
    });
    const [targetMessage, settargetMessage] = useState({
        messageid: '',
        replyLevel: 0,
    });
    const [formText, setformText] = useState('Votre message ');
    const [formFile, setformFile] = useState('');
    const [stateErrorMessage, setstateErrorMessage] = useState('');
    let timerNewMessage;
    let Backupnewmessage = useRef(0);
    let focusMessage = useRef();
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
    function getuserMessage(focusMessage, replyLevel = 0, boolEnd) {
        let parametre = {
            sendMessageGloabal: 1,
            buttonCommentaire: 1,
            sendReply: 1,
            replyLevel: 0,
            pageProfil: true,
        };
        let parametreparentanswer = {
            replyLevel: 1,
            messageFocus: 'messageFocus',
            getCommentaire: false,
            sendReply: 0,
        };
        let parametreanswer = {
            replyLevel: 2,
            messageFocus: 'messageFocus',
            getCommentaire: false,
            sendReply: 0,
        };
        let listmessageprofil;
        if (focusMessage === 'all') {
            parametre.messageFocus = 'messageAll';
            let sendreply = (
                <div id="blockactu">
                    <div id="blockactu_send">
                        {
                            <form>
                                <div>
                                    <ThemeProvider theme={theme}>
                                        <TextField
                                            error={stateErrorMessage}
                                            color="neutral"
                                            className="formText"
                                            label="Message"
                                            onBlur={(e) =>
                                                setformText(e.target.value)
                                            }
                                            defaultValue={formText}
                                            multiline
                                        />
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
                                                                e.target
                                                                    .files[0]
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
                                            <Button
                                                color="primary"
                                                variant="contained"
                                                onClick={(e) =>
                                                    sendMessage(e, false)
                                                }
                                            >
                                                Envoyer
                                            </Button>
                                        </div>
                                    </ThemeProvider>
                                </div>
                            </form>
                        }
                    </div>

                    <div id="blockactu_notifnewmessage">
                        <Button
                            id="notifnewmessage_button"
                            color="primary"
                            variant="contained"
                            onClick={(e) => getNewMessage(e)}
                        >
                            Il y a {nbrmessageapi.nbrnewmessage} nouveaux
                            messages
                        </Button>
                    </div>
                </div>
            );
            if (listMessage.length > 0 && listMessage[0] !== -1) {
                for (let x = 0; x < listMessage.length; x++) {
                    //[0] Parent // [1] Reponse if lenght = 2 // [2] Sous reponse de [1][0] // [3] Sous reponse de [1][1]
                    for (let y = 0; y < 2; y++) {
                        if (y === 0) {
                            listmessageprofil = (
                                <>
                                    {listmessageprofil}
                                    {
                                        <Message
                                            key={
                                                listMessage[x].answerArray[0][0]
                                                    ._id
                                            }
                                            parametre={parametre}
                                            element={
                                                listMessage[x].answerArray[0][0]
                                            }
                                            auth={auth}
                                            setListMessage={setListMessage}
                                            listMessage={listMessage}
                                            settargetMessage={settargetMessage}
                                            targetMessage={targetMessage}
                                            profilData={profilData}
                                        />
                                    }
                                </>
                            );
                        }
                    }
                }
            } else {
                listmessageprofil = <p>Aucun messages disponible</p>;
            }
            listmessageprofil = (
                <>
                    {sendreply}

                    {listmessageprofil}
                </>
            );
            return listmessageprofil;
        }
        if (focusMessage === 'one') {
            let reply;
            parametre.sendReply = 1;
            parametre.replyLevel = targetMessage.replyLevel;
            parametre.messageFocus = 'messageAll';
            parametre.getCommentaire = false;
            let nbranswer = 0;
            for (let a = 0; a < listMessage.length; a++) {
                if (
                    listMessage[a].answerArray[0][0]._id ===
                    targetMessage.messageid
                ) {
                    reply = (
                        <>
                            <div className="displayfocusMessage">
                                <IconButton
                                    onClick={(e) =>
                                        settargetMessage({
                                            messageid: '',
                                            replyLevel: 0,
                                        })
                                    }
                                    color="primary"
                                    aria-label="Back"
                                    component="label"
                                >
                                    <KeyboardBackspaceIcon />
                                </IconButton>
                                {
                                    <Message
                                        key={
                                            listMessage[a].answerArray[0][0]._id
                                        }
                                        parametre={parametre}
                                        element={
                                            listMessage[a].answerArray[0][0]
                                        }
                                        auth={auth}
                                        setListMessage={setListMessage}
                                        listMessage={listMessage}
                                        settargetMessage={settargetMessage}
                                        targetMessage={targetMessage}
                                        profilData={profilData}
                                    />
                                }
                            </div>
                        </>
                    );
                    if (listMessage[a].answerArray[0][0].answer.length > 0) {
                        nbranswer =
                            listMessage[a].answerArray[0][0].answer.length;
                        let replylvl1, replylvl2;
                        for (
                            let x = 0;
                            x < listMessage[a].answerArray[1].length;
                            x++
                        ) {
                            replylvl1 = '';
                            replylvl2 = '';
                            replylvl1 = (
                                <>
                                    {replylvl1}
                                    {
                                        <Message
                                            key={
                                                listMessage[a].answerArray[1][x]
                                                    ._id
                                            }
                                            parametre={parametreparentanswer}
                                            element={
                                                listMessage[a].answerArray[1][x]
                                            }
                                            auth={auth}
                                            setListMessage={setListMessage}
                                            listMessage={listMessage}
                                            settargetMessage={settargetMessage}
                                            targetMessage={targetMessage}
                                            profilData={profilData}
                                        />
                                    }
                                </>
                            );
                            if (
                                listMessage[a].answerArray[1][x].answer.length >
                                0
                            ) {
                                for (
                                    let y = 0;
                                    y <
                                    listMessage[a].answerArray[x + 2].length;
                                    y++
                                ) {
                                    replylvl2 = (
                                        <>
                                            {replylvl2}
                                            {
                                                <Message
                                                    key={
                                                        listMessage[a]
                                                            .answerArray[x + 2][
                                                            y
                                                        ]._id
                                                    }
                                                    parametre={parametreanswer}
                                                    element={
                                                        listMessage[a]
                                                            .answerArray[x + 2][
                                                            y
                                                        ]
                                                    }
                                                    auth={auth}
                                                    setListMessage={
                                                        setListMessage
                                                    }
                                                    listMessage={listMessage}
                                                    settargetMessage={
                                                        settargetMessage
                                                    }
                                                    targetMessage={
                                                        targetMessage
                                                    }
                                                    profilData={profilData}
                                                />
                                            }
                                        </>
                                    );
                                }
                            }

                            reply = (
                                <>
                                    {reply}
                                    <div className="listAnswer">
                                        {replylvl1}
                                        {replylvl2}
                                        <Message_reply
                                            auth={auth}
                                            parametre={parametreparentanswer}
                                            messagetarget={
                                                listMessage[a].answerArray[1][x]
                                                    ._id
                                            }
                                            listMessage={listMessage}
                                            setListMessage={setListMessage}
                                        />
                                    </div>
                                </>
                            );
                        }
                    }
                    let classwithanswer = '';
                    if (nbranswer > 0) classwithanswer = '--withanswer';
                    reply = (
                        <>
                            <div className={'listMessage ' + classwithanswer}>
                                {reply}
                            </div>
                        </>
                    );
                    return reply;
                }
            }
            return listmessageprofil;
        }
    }
    function sendMessage(e) {
        e.preventDefault();
        let objectData = {
            message: formText,
            messageId: Date.now(),
            dateTime: Date.now(),
        };
        if (objectData.message === '') {
            setstateErrorMessage('error');
        } else {
            setstateErrorMessage('');
            let formData = new FormData();
            formData.append('message', JSON.stringify(objectData));
            formData.append('image', formFile);
            sendMessageApi(formData).then((result) => {
                setformFile('');
                setformText('');
                document.getElementsByTagName('textarea')[0].value = '';
            });
        }
    }
    async function sendMessageApi(formData) {
        return await fetch('http://localhost:3000/api/message/send', {
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
    async function getMessageApi(limitmessage) {
        return await fetch('http://localhost:3000/api/message/get', {
            headers: {
                Authorization: 'Bearer ' + auth[2],
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            method: 'POST',
            body: limitmessage,
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
    async function getNewMessage(e) {
        e.preventDefault();
        Backupnewmessage.current = 0;
        document.getElementById('notifnewmessage_button').style.display =
            'none';
        getMessageApi(
            JSON.stringify({
                userid: 'allnewanswer',
                limitmessage: limitmessage,
                index: nbrmessageapi.firstmessage,
            })
        ).then((res) => {
            let tamponlistMessage = [];
            if (listMessage.length > 0 && listMessage[0] !== -1) {
                tamponlistMessage = listMessage;
            }
            tamponlistMessage.unshift(...res.message);
            setnbrmessageapi({
                ...nbrmessageapi,
                nbrmessage: res.nbrmessage,
                nbrnewmessage: 0,
                firstmessage: tamponlistMessage[0].answerArray[0][0]._id,
            });
            limitmessage.skipmessage =
                limitmessage.skipmessage + res.message.length;
            setListMessage([...tamponlistMessage]);
        });
    }
    async function getmes() {
        return await getMessageApi(
            JSON.stringify({
                userid: 'all',
                limitmessage: limitmessage,
                index: nbrmessageapi.firstmessage,
            })
        ).then((result) => {
            if (result.error === "Aucun message n'est enregistr??") {
                setListMessage([-1]);
                return result;
            }
            if (result.message.length === 0) {
                if (listMessage.length > 0) {
                    return result;
                }
            } else {
                let firstmessage;
                if (listMessage.length === 0)
                    firstmessage = result.message[0].answerArray[0][0]._id;
                else firstmessage = nbrmessageapi.firstmessage;

                setListMessage([...listMessage, ...result.message]);

                if (nbrmessageapi.nbrmessage === 0)
                    setnbrmessageapi({
                        nbrmessage: result.nbrmessage,
                        nbrnewmessage: 0,
                        firstmessage: firstmessage,
                    });
                else if (nbrmessageapi.nbrmessage < result.nbrmessage) {
                    let nbrnewmessage =
                        result.nbrmessage - nbrmessageapi.nbrmessage;
                    setnbrmessageapi({
                        nbrmessage: nbrmessageapi.nbrmessage,
                        nbrnewmessage: nbrnewmessage,
                        firstmessage: firstmessage,
                    });
                }
                return result;
            }
        });
    }
    async function getNbrNewMessageApi(indexId) {
        return await fetch(
            'http://localhost:3000/api/message/getNbrNewMessage',
            {
                headers: {
                    Authorization: 'Bearer ' + auth[2],
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
                method: 'POST',
                body: indexId,
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
    function lazyload() {
        if (document.getElementById('loadspinnerlazyload') !== null) {
            document.getElementById('loadspinnerlazyload').style.display =
                'none';
        }
        window.onscroll = function (ev) {
            let headerheight = Math.ceil(
                document.getElementsByTagName('header')[0].offsetHeight
            );
            let mainheight = Math.ceil(
                document.getElementById('main_container').offsetHeight
            );
            let pageheight = mainheight + headerheight; // + headerheight
            if (
                Math.ceil(window.visualViewport.height + window.scrollY) >=
                pageheight
            ) {
                window.onscroll = null;
                if (document.getElementById('loadspinnerlazyload') !== null) {
                    if (
                        document.getElementById('loadspinnerlazyload').style
                            .display !== 'block'
                    ) {
                        document.getElementById(
                            'loadspinnerlazyload'
                        ).style.display = 'block';
                    }
                }
                setlimitmessage({
                    ...limitmessage,
                    skipmessage:
                        limitmessage.skipmessage + limitmessage.nbrmessage,
                    nbrmessage: limitmessage.nbrmessage,
                });
            }
        };
    }
    useEffect(() => {
        getmes().then((result) => {
            let tampon = 0;
            if (result.message === undefined) {
                tampon = 0;
            } else {
                tampon = result.message.length;
            }
            if (tampon < limitmessage.nbrmessage) {
                window.onscroll = null;
                if (document.getElementById('loadspinnerlazyload') !== null) {
                    document.getElementById(
                        'loadspinnerlazyload'
                    ).style.display = 'none';
                }
            } else {
                lazyload();
            }
        });
    }, [limitmessage]);

    useEffect(() => {
        if (targetMessage.messageid !== '') {
            window.onscroll = null;
            focusMessage.current = targetMessage.messageid;
        } else {
            if (focusMessage.current !== undefined) {
                if (
                    document.querySelectorAll(
                        "[messageid='" + focusMessage.current + "']"
                    )[0] !== undefined
                ) {
                    document
                        .querySelectorAll(
                            "[messageid='" + focusMessage.current + "']"
                        )[0]
                        .scrollIntoView();
                }
            }
            if (
                window.onscroll === null &&
                listMessage.length !== 0 &&
                listMessage[0] !== -1 &&
                listMessage.length % limitmessage.nbrmessage === 0
            ) {
                /*focusMessage = document.querySelectorAll(
                    "[messageid='" + focusMessage.current + "']"
                )[0];
                focusMessage.current.scrollIntoView();*/
                lazyload();
            }
        }
    }, [targetMessage]);

    useEffect(() => {
        timerNewMessage = setInterval(() => {
            getNbrNewMessageApi(
                JSON.stringify({ indexId: nbrmessageapi.firstmessage })
            ).then((res) => {
                if (res.newmessage > 0) {
                    if (Backupnewmessage.current !== res.newmessage) {
                        Backupnewmessage.current = res.newmessage;
                        let mySound = new Audio(NotifSound);
                        mySound.play();
                    }
                    document.getElementById(
                        'notifnewmessage_button'
                    ).style.display = 'inline';

                    setnbrmessageapi({
                        ...nbrmessageapi,
                        nbrmessage: nbrmessageapi.nbrmessage,
                        nbrnewmessage: res.newmessage,
                    });
                }
            });
        }, 5000);
        return () => {
            clearInterval(timerNewMessage);
        };
    }, [nbrmessageapi]);
    return (
        <section className="section--mid">
            {targetMessage.messageid === '' ? (
                listMessage.length > 0 ? (
                    listMessage[0] === -1 ? (
                        getuserMessage('all', 0)
                    ) : (
                        <>
                            {getuserMessage('all', 0)}
                            <div id="loadspinnerlazyload">
                                <CircularProgress />
                            </div>
                        </>
                    )
                ) : (
                    <CircularProgress className="loadspinneranimation" />
                )
            ) : listMessage.length > 0 ? (
                getuserMessage('one', 0)
            ) : (
                <CircularProgress className="loadspinneranimation" />
            )}
        </section>
    );
}
export default Sectionmain_actu;
