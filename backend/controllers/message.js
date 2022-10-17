const Message = require('../models/Message');
const User = require('../models/User');
const Answer = require('../models/Answer');

exports.sendMessage = (req, res) => {
    const messageObject = req.files[0] && {
        imageUrl: `${req.protocol}://${req.get('host')}/images/${
            req.files[0].filename
        }`,
    };
    let message = new Message({
        ...messageObject,
        ...JSON.parse(req.body.message),
        userId: req.auth.userId,
        answer: [],
        Like: 0,
        Dislike: 0,
    });
    if (message.reply === true) {
        Message.findOne({ _id: JSON.parse(req.body.message).answer }).then(
            (result) => {
                result.answer.push(message._id);
                result
                    .save()
                    .then(() => console.log('Modif OK'))
                    .catch((error) => console.log(error));
            }
        );
    }
    message
        .save()
        .then((resultmessage) =>
            getUser([resultmessage]).then((result) => {
                res.status(201).json({
                    message: 'Message enregistré !',
                    resultmessage: result[0],
                });
            })
        )
        .catch((error) =>
            res.status(400).json({ message: 'Echec création', error })
        );
};
async function getAnswerParent(message) {
    let resultmessage = [];
    let resultobject;
    for (let x = 0; x < message.length; x++) {
        resultobject = {
            parentArray: [],
            answerArray: [],
            dateTime: message[x].dateTime,
        };
        resultobject.parentArray.push(message[x]);
        resultobject.answerArray.push([message[x]]);
        await Answer.find({ _id: message[x].answer }).then((result) => {
            resultobject.answerArray.push(result);
        });
        for (let y = 0; y < resultobject.answerArray[1].length; y++) {
            await Answer.find({
                _id: resultobject.answerArray[1][y].answer,
            }).then((result) => {
                resultobject.answerArray.push(result);
            });
        }
        resultmessage.push(resultobject);
    }
    return resultmessage;
}
exports.getMessages = (req, res) => {
    let firstmessage = req.body.index;

    let nbrmessage = 0;
    if (req.body.userid === 'allnewanswer') {
        if (req.body.index === '') {
            Message.find()
                .sort({ dateTime: -1 })
                .then((result) => {
                    Message.find().then((messages) => {
                        nbrmessage = messages.length;
                        getAnswerParent(result).then((result) => {
                            getUser(result).then((finalresult) => {
                                res.status(200).json({
                                    message: finalresult,
                                    nbrmessage: nbrmessage,
                                });
                            });
                        });
                    });
                });
        } else {
            Message.find({ _id: { $gt: firstmessage } })
                .sort({ dateTime: -1 })
                .then((result) => {
                    Message.find().then((messages) => {
                        nbrmessage = messages.length;
                        getAnswerParent(result).then((result) => {
                            getUser(result).then((finalresult) => {
                                res.status(200).json({
                                    message: finalresult,
                                    nbrmessage: nbrmessage,
                                });
                            });
                        });
                    });
                });
        }
    } else if (firstmessage === '') {
        Message.findOne()
            .sort({ dateTime: -1 })
            .then((idindex) => {
                if (idindex === null)
                    res.status(200).json({
                        error: "Aucun message n'est enregistré",
                    });
                else {
                    firstmessage = idindex._id;
                    Message.find({ _id: { $lte: firstmessage } })
                        .sort({ dateTime: -1 })
                        .skip(req.body.limitmessage.skipmessage)
                        .limit(req.body.limitmessage.nbrmessage)
                        .then((message) => {
                            Message.find().then((messages) => {
                                nbrmessage = messages.length;
                                getAnswerParent(message).then((result) => {
                                    getUser(result).then((finalresult) => {
                                        res.status(200).json({
                                            message: finalresult,
                                            nbrmessage: nbrmessage,
                                        });
                                    });
                                });
                            });
                        });
                }
            });
    } else {
        Message.find({ _id: { $lte: firstmessage } })
            .sort({ dateTime: -1 })
            .skip(req.body.limitmessage.skipmessage)
            .limit(req.body.limitmessage.nbrmessage)
            .then((message) => {
                Message.find().then((messages) => {
                    nbrmessage = messages.length;
                    getAnswerParent(message).then((result) => {
                        getUser(result).then((finalresult) => {
                            res.status(200).json({
                                message: finalresult,
                                nbrmessage: nbrmessage,
                            });
                        });
                    });
                });
            });
    }
};
async function getUser(message) {
    for (let y = 0; y < message.length; y++) {
        if (message[y].userId !== undefined) {
            await User.findOne({ _id: message[y].userId }).then(
                (userProfil) => {
                    message[y] = {
                        ...message[y]._doc,
                        userName: userProfil.name,
                        userPrename: userProfil.prename,
                        userImageUrl: userProfil.imageUrl,
                    };
                }
            );
        } else {
            for (let x = 0; x < message[y].answerArray.length; x++) {
                for (let z = 0; z < message[y].answerArray[x].length; z++) {
                    await User.findOne({
                        _id: message[y].answerArray[x][z].userId,
                    }).then((userProfil) => {
                        message[y].answerArray[x][z] = {
                            ...message[y].answerArray[x][z]._doc,
                            userName: userProfil.name,
                            userPrename: userProfil.prename,
                            userImageUrl: userProfil.imageUrl,
                        };
                    });
                }
            }
        }
    }
    return message;
}
exports.getNbrMessage = (req, res) => {
    Message.find()
        .sort({ dateTime: -1 })
        .then((result) => {
            res.status(200).json(result.length);
        });
};
exports.getNbrNewMessage = (req, res) => {
    let indexId = req.body.indexId;
    if (req.body.indexId === '') {
        Message.find()
            .sort({ dateTime: -1 })
            .then((result) => {
                res.status(200).json({ newmessage: result.length });
            });
    } else {
        Message.find({ _id: { $gt: indexId } })
            .sort({ dateTime: -1 })
            .then((result) => {
                res.status(200).json({ newmessage: result.length });
            });
    }
};
async function getParentAnswer(message, limitmessage) {
    let parentanswer = [];
    let tamponparent = [];
    let incrementOld = 0;
    let skipmessage = limitmessage.skipmessage;
    let nbrmessage = limitmessage.nbrmessage;
    // limitmessage = skip
    for (let x = 0; x < message.length; x++) {
        if (parentanswer.length < nbrmessage) {
            let elementparent = null;
            await Message.findOne({ _id: message[x]._id.valueOf() }).then(
                (res) => {
                    elementparent = res;
                }
            );
            if (elementparent === null) {
                await Message.findOne({
                    answer: message[x]._id.valueOf(),
                }).then((res) => {
                    elementparent = res;
                });
            }

            if (elementparent === null || elementparent === undefined) {
                //Aucun resultat dans les messages
                //GERER MESSAGE NIV 2
                //GERER DOUBLE ANSWER MEME MESSAGE PARENT
            } else {
                //Verif doublon
                let doublon = false;
                if (tamponparent.includes(elementparent._id.valueOf())) {
                    doublon = true;
                }
                if (doublon === true) {
                    //Doublon
                } else {
                    tamponparent.push(elementparent._id.valueOf());

                    if (skipmessage <= incrementOld) {
                        let answerArray = [];
                        answerArray.push([elementparent]);
                        let elementreponse;
                        await Answer.find({ _id: elementparent.answer }).then(
                            (result) => {
                                answerArray.push(result);
                                elementreponse = result;
                            }
                        );
                        for (let x = 0; x < elementreponse.length; x++) {
                            await Answer.find({
                                _id: elementreponse[x].answer,
                            }).then((result) => {
                                answerArray.push(result);
                            });
                        }
                        let objectData = {
                            dateTime: message[x].dateTime,
                            parentArray: elementparent,
                            answerArray: answerArray,
                        };
                        parentanswer.push(objectData);
                    }
                    incrementOld = incrementOld + 1;
                }
            }
        } else {
            break;
        }
    }
    return parentanswer;
}
exports.sendLike = (req, res) => {
    let objectReq = {
        userId: req.auth.userId,
        messageid: req.body.messageid,
        like: req.body.like,
    };
    Message.findOne({ _id: objectReq.messageid }).then((result) => {
        if (objectReq.like == -1) {
            //dislike
            result.arrayDislike.push(objectReq.userId);
        } else if (objectReq.like == 1) {
            //like
            result.arrayLike.push(objectReq.userId);
        } else if (objectReq.like == 0) {
            // Retrait like ou retrait dislike
            if (result.arrayLike.includes(objectReq.userId))
                result.arrayLike.splice(
                    result.arrayLike.indexOf(objectReq.userId),
                    1
                );
            else
                result.arrayDislike.splice(
                    result.arrayDislike.indexOf(objectReq.userId),
                    1
                );
        }
        const returnLikeDislike = {
            Like: result.arrayLike.length,
            Dislike: result.arrayDislike.length,
            arrayLike: result.arrayLike,
            arrayDislike: result.arrayDislike,
        };
        Message.updateOne(
            { _id: objectReq.messageid },
            { ...returnLikeDislike }
        )
            .then(() => res.status(200).json(returnLikeDislike))
            .catch(() => res.status(400));
    });
};
exports.deleteMessage = (req, res) => {
    User.findOne({ _id: req.auth.userId }).then((resultUser) => {
        let adminLevel = resultUser.adminLevel;
        Message.findOne({ _id: req.body.messageId }).then((result) => {
            if (result.userId === req.auth.userId || adminLevel === 1) {
                if (result.answer !== 0) {
                    deleteAllAnswer(result.answer);
                }
                Message.deleteOne({ _id: req.body.messageId })
                    .then(() => {
                        res.status(200).json('Suppresion Ok');
                    })
                    .catch((error) => error);
            }
        });
    });
};
exports.modifMessage = (req, res) => {
    let message = JSON.parse(req.body.message);
    User.findOne({ _id: req.auth.userId }).then((resultUser) => {
        let adminLevel = resultUser.adminLevel;
        Message.findOne({ _id: message.messageId }).then((result) => {
            if (result.userId === req.auth.userId || adminLevel === 1) {
                const messageObject =
                    req.files[0] !== undefined
                        ? {
                              imageUrl: `${req.protocol}://${req.get(
                                  'host'
                              )}/images/${req.files[0].filename}`,
                          }
                        : req.files[0] === undefined
                        ? {
                              imageUrl: '',
                          }
                        : { imageUrl: result.imageUrl };
                Message.updateOne(
                    { _id: message.messageId },
                    {
                        message: message.message,
                        imageUrl: messageObject.imageUrl,
                    }
                )
                    .then(() =>
                        res.status(200).json({
                            msg: 'Modif Ok',
                            imageUrl: messageObject.imageUrl,
                        })
                    )
                    .catch((error) => error);
            }
        });
    });
};
//Recupere tout les messages / réponses de l'utilisateur ( avec les messages associés)
async function getuserMessageAnswer(userid) {
    let arrayMessage = [];
    let arrayAnswer = [];
    let array;
    await Message.find({
        userId: userid,
    }).then((result) => {
        arrayMessage = result;
    });
    await Answer.find({
        userId: userid,
    }).then((resultAnswer) => {
        arrayAnswer = resultAnswer;
    });

    array = [...arrayMessage, ...arrayAnswer];
    array.sort(function (a, b) {
        if (a.dateTime > b.dateTime) return 1;
        if (a.dateTime < b.dateTime) return -1;
        return 0;
    });
    array.reverse();
    return array;
}
exports.getuserMessage = (req, res) => {
    getuserMessageAnswer(req.body.userid, req.body.limitmessage).then(
        (result) => {
            getParentAnswer(result, req.body.limitmessage).then(
                (resparentanswer) => {
                    getUser(resparentanswer).then((result) => {
                        res.status(200).json(result);
                    });
                }
            );
        }
    );
};
exports.getMessageById = (req, res) => {
    getMessageById(req.body._id)
        .then((result) => {
            res.status(200).json(result);
        })
        .catch((error) => {
            res.status(404).json(error);
        });
};
async function getMessageById(id) {
    //let arrayReturn = [];
    let arrayReturn = {
        answerArray: [],
    };
    await Message.findOne({
        _id: id,
    }).then((result) => {
        arrayReturn.parentArray = result;
        arrayReturn.answerArray.push([result]);
    });
    if (arrayReturn.parentArray.answer.length !== 0) {
        await Answer.find({
            _id: arrayReturn.parentArray.answer,
        }).then((resultAnswer) => {
            arrayReturn.answerArray.push(resultAnswer);
        });

        for (let x = 0; x < arrayReturn.answerArray[1].length; x++) {
            await Answer.find({
                _id: arrayReturn.answerArray[1][x].answer,
            }).then((resultAnswer) => {
                arrayReturn.answerArray.push(resultAnswer);
            });
        }
    }
    await getUser([arrayReturn]).then((result) => {
        arrayReturn = result;
    });

    return arrayReturn;
}
async function deleteAllAnswer(arrayAnswerlevel1) {
    let arrayAnswerlevel2;
    for (let x = 0; x < arrayAnswerlevel1.length; x++) {
        await Answer.findOneAndDelete({ _id: arrayAnswerlevel1[x] }).then(
            (element) => {
                arrayAnswerlevel2 = element.answer;
                console.log('Suppresion element:' + element._id);
            }
        );
        if (arrayAnswerlevel2.length > 0) {
            await Answer.deleteMany({ _id: arrayAnswerlevel2 }).then(() => {
                console.log('Suppresion sous réponse:' + arrayAnswerlevel2);
            });
        }
        arrayAnswerlevel2 = [];
    }
}
