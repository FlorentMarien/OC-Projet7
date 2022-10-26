import * as React from 'react';
import '../styles/Message.css';
import { useState, useEffect } from 'react';
import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';
import ButtonGroup from '@mui/material/ButtonGroup';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import ThumbUpOffIcon from '@mui/icons-material/ThumbUpAlt';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import CommentIcon from '@mui/icons-material/Comment';
import AddCommentIcon from '@mui/icons-material/AddComment';
import TextField from '@mui/material/TextField';
import DeleteIcon from '@mui/icons-material/Delete';
import SettingsIcon from '@mui/icons-material/Settings';
import { createTheme, ThemeProvider } from '@mui/material/styles';
library.add(fas);
function Message({
    parametre,
    changeUpdate,
    setchangeUpdate,
    element,
    auth,
    setListMessage,
    listMessage,
    setListAnswer,
    listAnswer,
    settargetMessage,
    targetMessage,
    settampontargetMessage,
    tampontargetMessage,
    profilTarget,
    profilData,
}) {
    const [elementMessage, setelementMessage] = useState(element);
    let [disableButtonLike, setdisableButtonLike] = useState(
        elementMessage.arrayDislike.includes(auth[1])
    );
    let [disableButtonDislike, setdisableButtonDislike] = useState(
        elementMessage.arrayLike.includes(auth[1])
    );
    const [disablegetCommentaire, setdisablegetCommentaire] = useState(
        parametre.getCommentaire === undefined ? false : true
    );
    const [formFile, setformFile] = useState(
        elementMessage.imageUrl ? elementMessage.imageUrl : ''
    );
    const [formText, setformText] = useState('');
    const [openReply, setopenReply] = useState(0);
    const [openParametre, setopenParametre] = useState(0);
    const [errorSendAnswer, seterrorSendAnswer] = useState('');
    disableButtonLike = elementMessage.arrayDislike.includes(auth[1]);
    disableButtonDislike = elementMessage.arrayLike.includes(auth[1]);

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
    function modifAnswer(e, replyLevel = 0) {
        e.preventDefault();
        let target = e;
        let message = e.target.closest('div.message');

        let objectData = {
            messageId: elementMessage._id,
            message: formText,
            dateTime: elementMessage.dateTime,
        };
        let formData = new FormData();
        formData.append('message', JSON.stringify(objectData));
        if (typeof formFile === 'object') {
            // Image modifié
            formData.append('image', formFile);
        } else if (formFile === '') {
            // Ajout image vide pour reset
            formData.append('image', '');
        }
        modifMessageApi(formData).then((result) => {
            //if(parametre.replyLevel===0){
            let boolend = false;
            for (let x = 0; x < listMessage.length; x++) {
                if (listMessage[x]._id !== undefined) {
                    if (
                        listMessage[x]._id ===
                        target.target.closest('div.message').attributes[
                            'messageid'
                        ].value
                    ) {
                        listMessage[x] = {
                            ...listMessage[x],
                            message: objectData.message,
                            imageUrl: result.imageUrl,
                        };
                        setopenReply(0);
                        setelementMessage(listMessage[x]);
                        break;
                    }
                } else {
                    if (boolend === true) break;
                    if (
                        listMessage[x].answerArray[0][0]._id ===
                        target.target.closest('div.message').attributes[
                            'messageid'
                        ].value
                    ) {
                        //Detect modif replylevel 0
                        listMessage[x].answerArray[0][0] = {
                            ...listMessage[x].answerArray[0][0],
                            message: objectData.message,
                            imageUrl: result.imageUrl,
                        };
                        setListMessage(listMessage);
                        setelementMessage(listMessage[x].answerArray[0][0]);
                    } else {
                        for (
                            let y = 0;
                            y < listMessage[x].answerArray[1].length;
                            y++
                        ) {
                            if (boolend === true) break;
                            if (
                                listMessage[x].answerArray[1][y]._id ===
                                target.target.closest('div.message').attributes[
                                    'messageid'
                                ].value
                            ) {
                                //Detect modif replylevel 1
                                listMessage[x].answerArray[1][y] = {
                                    ...listMessage[x].answerArray[1][y],
                                    message: objectData.message,
                                    imageUrl: result.imageUrl,
                                };
                                setListMessage(listMessage);
                                setelementMessage(
                                    listMessage[x].answerArray[1][y]
                                );
                                boolend = true;
                                break;
                            } else {
                                for (
                                    let z = 0;
                                    z <
                                    listMessage[x].answerArray[y + 2].length;
                                    z++
                                ) {
                                    if (
                                        listMessage[x].answerArray[y + 2][z]
                                            ._id ===
                                        target.target.closest('div.message')
                                            .attributes['messageid'].value
                                    ) {
                                        //Detect modif replylevel 2
                                        listMessage[x].answerArray[y + 2][z] = {
                                            ...listMessage[x].answerArray[
                                                y + 2
                                            ][z],
                                            message: objectData.message,
                                            imageUrl: result.imageUrl,
                                        };
                                        setListMessage(listMessage);
                                        setelementMessage(
                                            listMessage[x].answerArray[y + 2][z]
                                        );
                                        boolend = true;
                                        break;
                                    }
                                }
                            }
                        }
                    }
                }
            }
            setopenReply(0);
        });
    }
    async function modifMessageApi(formData) {
        let adresse;
        parametre.replyLevel === 0
            ? (adresse = 'http://localhost:3000/api/message/modifMessage')
            : (adresse = 'http://localhost:3000/api/answer/modifMessage');
        return await fetch(adresse, {
            headers: {
                Authorization: 'Bearer ' + auth[2],
            },
            method: 'PUT',
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
    function delMessage(e) {
        e.preventDefault();
        let target = e.target.closest('div.message');
        let objectSend = {
            messageId: target.attributes['messageid'].value,
            replyLevel: parametre.replyLevel,
        };
        if (elementMessage._id === target.attributes['messageid'].value)
            target.children[0].children[1].children[0].textContent =
                'Suppresion en cours';
        senddelMessage(JSON.stringify(objectSend)).then((result) => {
            //OBJECTIF RECUPERER L'ELEMENT SUPPRIMER DANS LA LISTE
            //elementMessage_id;
            let boolend = false;
            for (let x = 0; x < listMessage.length; x++) {
                if (listMessage[x]._id !== undefined) {
                    //Page actu
                    /*if(listMessage[x]._id===target.target.closest("div.message").attributes["messageid"].value){
						listMessage[x]={
						...listMessage[x],
						message:objectData.message,
						imageUrl:result.imageUrl,
						};
						setopenReply(0);
						setelementMessage(listMessage[x]);
						break;
					}*/
                } else {
                    //page profil
                    if (boolend === true) break;
                    if (
                        listMessage[x].answerArray[0][0]._id ===
                        elementMessage._id
                    ) {
                        //Detect modif replylevel 0
                        if (profilTarget !== undefined)
                            profilTarget.nbrmessage =
                                profilTarget.nbrmessage - 1;
                        let nbrreplylevel1 =
                            listMessage[x].answerArray[1].length;
                        let nbrreplylevel2 = 0;
                        if (nbrreplylevel1 !== 0) {
                            nbrreplylevel2 =
                                listMessage[x].answerArray.length - 2;
                            //-2 for delete parent et replylevel1
                        }

                        if (profilTarget !== undefined)
                            profilTarget.nbranswer =
                                profilTarget.nbranswer -
                                nbrreplylevel1 -
                                nbrreplylevel2;
                        listMessage.splice(x, 1);
                        // Tampon -1 = remise a zero si aucun message dispo
                        let tampon = listMessage;
                        if (listMessage.length === 0) {
                            tampon = [-1];
                        }
                        setListMessage(tampon);
                        settargetMessage({ messageid: '', replyLevel: 0 });
                    } else {
                        for (
                            let y = 0;
                            y < listMessage[x].answerArray[1].length;
                            y++
                        ) {
                            if (boolend === true) break;
                            if (
                                listMessage[x].answerArray[1][y]._id ===
                                elementMessage._id
                            ) {
                                //Detect modif replylevel 1
                                //Suppression de l'element
                                let nbrsuppresion =
                                    listMessage[x].answerArray[1][y].answer
                                        .length;
                                nbrsuppresion = nbrsuppresion + 1;
                                if (profilTarget !== undefined)
                                    profilTarget.nbranswer =
                                        profilTarget.nbranswer - nbrsuppresion;

                                listMessage[x].answerArray[1].splice(y, 1);
                                //Suppression de l'assosiation element parent
                                listMessage[x].answerArray[0][0].answer.splice(
                                    y,
                                    1
                                );
                                listMessage[x].answerArray.splice(y + 2, 1);

                                setListMessage([...listMessage]);
                                // Reload l'element parent
                                boolend = true;
                                break;
                            } else {
                                for (
                                    let z = 0;
                                    z <
                                    listMessage[x].answerArray[y + 2].length;
                                    z++
                                ) {
                                    if (
                                        listMessage[x].answerArray[y + 2][z]
                                            ._id === elementMessage._id
                                    ) {
                                        //Detect modif replylevel 2
                                        //Suppression de l'element
                                        listMessage[x].answerArray[
                                            y + 2
                                        ].splice(z, 1);
                                        //Suppression de l'assosiation element parent
                                        listMessage[x].answerArray[1][
                                            y
                                        ].answer.splice(z, 1);

                                        if (profilTarget !== undefined)
                                            profilTarget.nbranswer =
                                                profilTarget.nbranswer - 1;
                                        setListMessage([...listMessage]);
                                        boolend = true;
                                        break;
                                    }
                                }
                            }
                        }
                    }
                }
            }
        });
    }
    async function senddelMessage(formData) {
        let adresse;
        parametre.replyLevel === 0
            ? (adresse = 'http://localhost:3000/api/message/deleteMessage')
            : (adresse = 'http://localhost:3000/api/answer/deleteMessage');
        return await fetch(adresse, {
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + auth[2],
            },
            method: 'DELETE',
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
    function getimgpreview() {
        let urlFile;
        if (typeof formFile === 'object') {
            urlFile = URL.createObjectURL(formFile);
        } else urlFile = formFile;

        return (
            <div>
                <span className="container_uploadimg">
                    <img src={urlFile} alt="Image preview" />

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
    function sendlike(e) {
        let target = e;
        let likevalue = 2;
        e.preventDefault();
        if (
            elementMessage.arrayLike.includes(auth[1]) ||
            elementMessage.arrayDislike.includes(auth[1])
        ) {
            likevalue = 0;
        } else if (
            e.target.closest('label').attributes['button-type'].value ===
            'button_like'
        )
            likevalue = 1;
        else likevalue = -1;
        let messageid =
            e.target.closest('div.message').attributes['messageid'].value;
        let formData = {
            messageid: messageid,
            like: likevalue,
        };
        sendLikeApi(JSON.stringify(formData)).then((result) => {
            // Like: 1
            setelementMessage({ ...elementMessage, ...result });
            let endbool = false;
            for (let x = 0; x < listMessage.length; x++) {
                if (endbool === true) break;
                if (
                    listMessage[x].answerArray[0][0]._id ===
                    target.target.closest('div.message').attributes['messageid']
                        .value
                ) {
                    listMessage[x].answerArray[0][0] = {
                        ...listMessage[x].answerArray[0][0],
                        ...result,
                    };
                    setListMessage([...listMessage]);
                    endbool = true;
                    break;
                } else {
                    if (listMessage[x].answerArray[1].length > 0) {
                        for (
                            let y = 0;
                            y < listMessage[x].answerArray[1].length;
                            y++
                        ) {
                            if (endbool === true) break;
                            if (
                                listMessage[x].answerArray[1][y]._id ===
                                target.target.closest('div.message').attributes[
                                    'messageid'
                                ].value
                            ) {
                                //replylevel1 correspondance
                                listMessage[x].answerArray[1][y] = {
                                    ...listMessage[x].answerArray[1][y],
                                    ...result,
                                };
                                setListMessage([...listMessage]);
                                endbool = true;
                                break;
                            } else {
                                //recherche replylevel2
                                if (
                                    listMessage[x].answerArray[y + 2].length > 0
                                ) {
                                    for (
                                        let z = 0;
                                        z <
                                        listMessage[x].answerArray[y + 2]
                                            .length;
                                        z++
                                    ) {
                                        if (
                                            listMessage[x].answerArray[y + 2][z]
                                                ._id ===
                                            target.target.closest('div.message')
                                                .attributes['messageid'].value
                                        ) {
                                            //replylevel1 correspondance
                                            listMessage[x].answerArray[y + 2][
                                                z
                                            ] = {
                                                ...listMessage[x].answerArray[
                                                    y + 2
                                                ][z],
                                                ...result,
                                            };
                                            setListMessage([...listMessage]);
                                            endbool = true;
                                            break;
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        });
    }
    async function sendLikeApi(formData) {
        let adresse;
        parametre.replyLevel === 0
            ? (adresse = 'http://localhost:3000/api/message/sendlike')
            : (adresse = 'http://localhost:3000/api/answer/sendlike');
        return await fetch(adresse, {
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
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
    function sendAnswer(e, replyLevel = 0) {
        e.preventDefault();
        let target = e;
        let objectData = {
            message: e.target.parentElement.children[0].value,
            messageId: Date.now(),
            dateTime: Date.now(),
        };
        objectData = {
            ...objectData,
            replyLevel: replyLevel,
            answer: e.target.closest('div.message').attributes['messageid']
                .value,
            message: formText,
        };
        if (formText === '') {
            seterrorSendAnswer('error');
        } else {
            let formData = new FormData();
            formData.append('message', JSON.stringify(objectData));
            if (formFile !== '') {
                formData.append('image', formFile);
            }
            sendAnswerApi(formData).then((result) => {
                seterrorSendAnswer('');
                let boolend = false;
                if (listMessage[0]._id !== undefined) {
                    if (parametre.replyLevel === 0) {
                        for (let x = 0; x < listMessage.length; x++) {
                            if (
                                listMessage[x]._id ===
                                target.target.closest('div.message').attributes[
                                    'messageid'
                                ].value
                            ) {
                                let array = listMessage[x].answer;
                                array.push(result.answerId);
                                listMessage[x] = {
                                    ...listMessage[x],
                                    answer: array,
                                };
                                setelementMessage(listMessage[x]);
                                setchangeUpdate(changeUpdate + 1);
                                break;
                            }
                        }
                    }
                } else {
                    if (parametre.replyLevel === 0) {
                        for (let x = 0; x < listMessage.length; x++) {
                            if (
                                listMessage[x].answerArray[0][0]._id ===
                                elementMessage._id
                            ) {
                                listMessage[x].answerArray[0][0].answer.push(
                                    result.answerId
                                );
                                listMessage[x].answerArray[1].push(
                                    result.resultmessage
                                );
                                listMessage[x].answerArray.push([]);
                                if (profilTarget !== undefined)
                                    profilTarget.nbranswer =
                                        profilTarget.nbranswer + 1;
                                setListMessage([...listMessage]);
                                boolend = true;
                                break;
                            }
                        }
                    } else if (parametre.replyLevel === 1) {
                        for (let x = 0; x < listMessage.length; x++) {
                            if (boolend === true) break;
                            if (listMessage[x].answerArray[1].length > 0) {
                                for (
                                    let y = 0;
                                    y < listMessage[x].answerArray[1].length;
                                    y++
                                ) {
                                    if (
                                        listMessage[x].answerArray[1][y]._id ===
                                        elementMessage._id
                                    ) {
                                        listMessage[x].answerArray[1][
                                            y
                                        ].answer.push(result.answerId);
                                        listMessage[x].answerArray[y + 2].push(
                                            result.resultmessage
                                        );
                                        if (profilTarget !== undefined)
                                            profilTarget.nbranswer =
                                                profilTarget.nbranswer + 1;
                                        setListMessage([...listMessage]);
                                        boolend = true;
                                        break;
                                    }
                                }
                            }
                        }
                    }
                }
                setopenReply(0);
            });
        }
    }
    async function sendAnswerApi(formData) {
        return await fetch('http://localhost:3000/api/answer/send', {
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
    function getCommentaire(e) {
        if (openReply === 1) setopenReply(0);
        if (openParametre === 1) setopenParametre(0);
        if (parametre.replyLevel < 2) {
            e.preventDefault();
            let messageid =
                e.target.closest('div.message').attributes['messageid'].value;
            //let bistampontargetMessage=tampontargetMessage;
            //bistampontargetMessage.push({messageid:messageid,replyLevel:parametre.replyLevel});
            //console.log(bistampontargetMessage);
            //settampontargetMessage(bistampontargetMessage);
            settargetMessage({
                messageid: messageid,
                replyLevel: parametre.replyLevel,
            });
        }
    }
    function getIntervalDate(dateTime) {
        dateTime = Math.round(
            (new Date(Date.now()) - new Date(dateTime).getTime()) / 1000
        );
        if (dateTime < 60) return 'Posté il y a ' + dateTime + ' secondes';
        else if (dateTime >= 60 && dateTime < 3600)
            return 'Posté il y a ' + Math.round(dateTime / 60) + ' minutes';
        else if (dateTime >= 3600 && dateTime < 3600 * 24)
            return 'Posté il y a ' + Math.round(dateTime / 3600) + ' heures';
        else if (dateTime >= 3600 * 24)
            return (
                'Posté il y a ' + Math.round(dateTime / (3600 * 24)) + ' jours'
            );
        else return 'Erreur';
    }
    return (
        <>
            <div
                className={
                    'message replylevel' +
                    parametre.replyLevel +
                    ' ' +
                    parametre.messageFocus
                }
                messageid={elementMessage._id}
                onMouseLeave={(e) => {}}
            >
                <div className="message_content">
                    <div className="userInfo">
                        <img
                            src={elementMessage.userImageUrl}
                            alt={
                                'Image de ' +
                                elementMessage.userName +
                                ' ' +
                                elementMessage.userPrename
                            }
                        />
                        <p>
                            {elementMessage.userName}{' '}
                            {elementMessage.userPrename}
                        </p>
                    </div>
                    <div className="userMessage">
                        <p className="userMessage_ptext">
                            {elementMessage.message}
                        </p>
                        <p className="userMessage_pdate">
                            {getIntervalDate(elementMessage.dateTime)}
                        </p>
                    </div>
                </div>
                <div className="message_image">
                    {elementMessage.imageUrl && (
                        <img
                            src={elementMessage.imageUrl}
                            alt={
                                'Image de ' +
                                elementMessage.userName +
                                ' ' +
                                elementMessage.userPrename
                            }
                        />
                    )}
                </div>
                <div className="answer">
                    <ButtonGroup variant="text" aria-label="text button group">
                        <div>
                            <div className="container_information">
                                <IconButton
                                    disabled={disableButtonLike}
                                    color="primary"
                                    button-type="button_like"
                                    onClick={(e) => {
                                        sendlike(e);
                                    }}
                                    aria-label="Like"
                                    component="label"
                                >
                                    <ThumbUpOffIcon />
                                </IconButton>
                                <p className="informationBox">
                                    {elementMessage.Like}
                                </p>
                            </div>
                            <div className="container_information">
                                <IconButton
                                    disabled={disableButtonDislike}
                                    color="primary"
                                    button-type="button_dislike"
                                    onClick={(e) => {
                                        sendlike(e);
                                    }}
                                    aria-label="Dislike"
                                    component="label"
                                >
                                    <ThumbDownIcon />
                                </IconButton>
                                <p className="informationBox">
                                    {elementMessage.Dislike}
                                </p>
                            </div>
                            <div className="container_information">
                                <IconButton
                                    disabled={disablegetCommentaire}
                                    color="primary"
                                    aria-label="Show commentary"
                                    onClick={(e) => {
                                        getCommentaire(e);
                                    }}
                                    component="label"
                                >
                                    <CommentIcon />
                                </IconButton>
                                <p className="informationBox">
                                    {elementMessage.answer.length}
                                </p>
                            </div>
                            {parametre.sendReply === 1 && (
                                <div className="container_information">
                                    <IconButton
                                        color="primary"
                                        aria-label="Add commentary"
                                        onClick={(e) => {
                                            setopenReply(
                                                openReply === 1 ? 0 : 1
                                            );
                                        }}
                                        component="label"
                                    >
                                        <AddCommentIcon />
                                    </IconButton>
                                </div>
                            )}
                        </div>
                        {(elementMessage.userId === auth[1] ||
                            profilData.adminLevel === 1) && (
                            <div className="container_parametre">
                                <IconButton
                                    color="primary"
                                    aria-label="delete message"
                                    onClick={(e) => {
                                        setopenParametre(
                                            openParametre === 0 ? 1 : 0
                                        );
                                    }}
                                    component="label"
                                >
                                    <SettingsIcon />
                                </IconButton>
                                {openParametre === 1 && (
                                    <div
                                        className="popupParametre"
                                        onMouseLeave={(e) => {
                                            setopenParametre(0);
                                            e.target.closest('div.message');
                                        }}
                                    >
                                        <ul>
                                            <li>
                                                <button
                                                    onClick={(e) => {
                                                        delMessage(e);
                                                    }}
                                                >
                                                    Delete
                                                </button>
                                            </li>
                                            <li>
                                                <button
                                                    onClick={(e) => {
                                                        setopenReply(2);
                                                        setformText(
                                                            elementMessage.message
                                                        );
                                                        e.target.closest(
                                                            'div.message'
                                                        ).children[0].children
                                                            .length === 3 &&
                                                            setformFile(
                                                                e.target.closest(
                                                                    'div.message'
                                                                ).children[0]
                                                                    .children[2]
                                                                    .src
                                                            );
                                                    }}
                                                >
                                                    Edit
                                                </button>
                                            </li>
                                        </ul>
                                    </div>
                                )}
                            </div>
                        )}
                    </ButtonGroup>
                </div>
                {openReply === 1 || openReply === 2 ? (
                    <div className="sendreply">
                        <ThemeProvider theme={theme}>
                            <TextField
                                error={errorSendAnswer}
                                color="neutral"
                                className="formText"
                                label="Message"
                                onChange={(e) => setformText(e.target.value)}
                                value={formText}
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
                                                setformFile(e.target.files[0])
                                            }
                                            type="file"
                                            id="formFile"
                                        />
                                        <PhotoCamera />
                                    </IconButton>
                                ) : (
                                    <>{getimgpreview()}</>
                                )}
                                {openReply === 1 ? (
                                    <Button
                                        color="primary"
                                        variant="contained"
                                        onClick={(e) =>
                                            sendAnswer(e, parametre.replyLevel)
                                        }
                                    >
                                        Envoyer
                                    </Button>
                                ) : (
                                    openReply === 2 && (
                                        <Button
                                            color="primary"
                                            variant="contained"
                                            onClick={(e) =>
                                                modifAnswer(
                                                    e,
                                                    parametre.replyLevel
                                                )
                                            }
                                        >
                                            Modifier
                                        </Button>
                                    )
                                )}
                            </div>
                        </ThemeProvider>
                    </div>
                ) : (
                    openReply === 3 && <div className="sendreply">Load...</div>
                )}
            </div>
        </>
    );
}

export default Message;
