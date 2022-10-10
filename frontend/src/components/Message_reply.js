import '../styles/Message_reply.css';
import AddCommentIcon from '@mui/icons-material/AddComment';
import IconButton from '@mui/material/IconButton';
import { useState, useEffect } from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import TextField from '@mui/material/TextField';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import Button from '@mui/material/Button';
import DeleteIcon from '@mui/icons-material/Delete';
function Message_reply({
    auth,
    parametre,
    messagetarget,
    listMessage,
    setListMessage,
    profilTarget,
}) {
    // Parametre => replylevel, useridmessage
    const [openReply, setopenReply] = useState(0);
    const [formFile, setformFile] = useState('');
    const [formText, setformText] = useState('Votre réponse?');
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
    function sendAnswer(e, replyLevel = 0) {
        e.preventDefault();
        let target = e;
        let objectData = {
            message: e.target.parentElement.children[0].value,
            messageId: Date.now(),
            dateTime: Date.now(),
        };
        let messagetarget;
        if (e.target.closest('div.message') === null) {
            messagetarget =
                e.target.closest('div.listAnswer').children[0].attributes[
                    'messageid'
                ].value;
        } else {
            messagetarget =
                e.target.closest('div.message').attributes['messageid'].value;
        }
        objectData = {
            ...objectData,
            replyLevel: replyLevel,
            answer: messagetarget,
            message: formText,
        };
        let formData = new FormData();
        formData.append('message', JSON.stringify(objectData));
        if (formFile !== '') {
            formData.append('image', formFile);
        }
        sendAnswerApi(formData).then((result) => {
            let boolend = false;
            if (listMessage[0]._id === undefined) {
                if (parametre.replyLevel === 0) {
                    for (let x = 0; x < listMessage.length; x++) {
                        if (
                            listMessage[x].answerArray[0][0]._id ===
                            messagetarget
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
                                    messagetarget
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
    return (
        <div className="listAnswer_sendreply">
            {openReply === 0 ? (
                <IconButton
                    onClick={(e) => {
                        setopenReply(1);
                    }}
                    color="primary"
                    aria-label="Add commentary"
                    component="label"
                >
                    <AddCommentIcon />
                </IconButton>
            ) : (
                <ThemeProvider theme={theme}>
                    <TextField
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
                        <Button
                            color="primary"
                            variant="contained"
                            onClick={(e) => sendAnswer(e, parametre.replyLevel)}
                        >
                            Envoyer
                        </Button>
                        <Button
                            color="primary"
                            variant="contained"
                            onClick={(e) => setopenReply(0)}
                        >
                            Close
                        </Button>
                    </div>
                </ThemeProvider>
            )}
        </div>
    );
}

export default Message_reply;
