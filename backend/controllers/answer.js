const Answer = require('../models/Answer');
const User = require('../models/User');
const Message = require('../models/Message');

exports.getAnswer = (req, res) => {
    Answer.find()
        .sort({ dateTime: -1 })
        .then((message) => {
            //Profil
            getUser(message).then((result) => {
                res.status(200).json(result);
            });
        })
        .catch((error) => ({ error }));
};
async function getUser(message) {
    for (let y = 0; y < message.length; y++) {
        await User.findOne({ _id: message[y].userId }).then((userProfil) => {
            message[y] = {
                ...message[y]._doc,
                userName: userProfil.name,
                userPrename: userProfil.prename,
                userImageUrl: userProfil.imageUrl,
            };
        });
    }
    return message;
}
exports.sendAnswer = (req, res) => {
    const messageObject = req.files[0] && {
        imageUrl: `${req.protocol}://${req.get('host')}/images/${
            req.files[0].filename
        }`,
    };
    let answer = new Answer({
        ...messageObject,
        ...JSON.parse(req.body.message),
        userId: req.auth.userId,
        answer: [],
        Like: 0,
        Dislike: 0,
    });
    if (JSON.parse(req.body.message).replyLevel < 1) {
        Message.findOne({ _id: JSON.parse(req.body.message).answer }).then(
            (result) => {
                result.answer.push(answer._id.toString());
                result
                    .save()
                    .then(() => console.log('Modif OK'))
                    .catch((error) => console.log(error));
            }
        );
    } else {
        Answer.findOne({ _id: JSON.parse(req.body.message).answer }).then(
            (result) => {
                result.answer.push(answer._id.toString());
                result
                    .save()
                    .then(() => console.log('Modif OK'))
                    .catch((error) => console.log(error));
            }
        );
    }

    answer
        .save()
        .then(() =>
            res
                .status(201)
                .json({ message: 'answer enregistré !', answerId: answer._id })
        )
        .catch((error) =>
            res.status(400).json({ message: 'Echec création', error })
        );
};
exports.sendLike = (req, res) => {
    let objectReq = {
        userId: req.auth.userId,
        messageid: req.body.messageid,
        like: req.body.like,
    };
    Answer.findOne({ _id: objectReq.messageid }).then((result) => {
        if (objectReq.like == -1) {
            //dislike
            result.arrayDislike.push(objectReq.userId);
        } else if (objectReq.like == 1) {
            //like
            result.arrayLike.push(objectReq.userId);
        } else if (objectReq.like == 0) {
            // Retrait like ou retrait dislike
            if (result.arrayLike.includes(objectReq.userId))
                result.arrayLike.splice(objectReq.userId, 1);
            else result.arrayDislike.splice(objectReq.userId, 1);
        }
        const returnLikeDislike = {
            Like: result.arrayLike.length,
            Dislike: result.arrayDislike.length,
            arrayLike: result.arrayLike,
            arrayDislike: result.arrayDislike,
        };
        Answer.updateOne({ _id: objectReq.messageid }, { ...returnLikeDislike })
            .then(() => res.status(200).json(returnLikeDislike))
            .catch(() => res.status(400));
    });
};
exports.deleteMessage = (req, res) => {
    User.findOne({ _id: req.auth.userId }).then((resultUser) => {
        let adminLevel = resultUser.adminLevel;
        Answer.findOne({ _id: req.body.messageId }).then((result) => {
            if (result.userId === req.auth.userId || adminLevel === 1) {
                let replyLevel = req.body.replyLevel;
                if (replyLevel === 1) {
                    Message.findOne({ answer: req.body.messageId }).then(
                        (messageBack) => {
                            messageBack.answer.splice(
                                messageBack.answer.indexOf(req.body.messageId),
                                1
                            );
                            Message.updateOne(
                                { answer: req.body.messageId },
                                {
                                    answer: messageBack.answer,
                                }
                            )
                                .then((result) => {
                                    console.log(result);
                                    Answer.deleteOne({
                                        _id: req.body.messageId,
                                    })
                                        .then(() =>
                                            res
                                                .status(200)
                                                .json('Suppresion Ok')
                                        )
                                        .catch((error) => error);
                                })
                                .catch((error) => console.log(error));
                        }
                    );
                } else if (replyLevel > 1) {
                    console.log('child');
                    Answer.findOne({ answer: req.body.messageId }).then(
                        (messageBack) => {
                            messageBack.answer.splice(
                                messageBack.answer.indexOf(req.body.messageId),
                                1
                            );
                            Answer.updateOne(
                                { answer: req.body.messageId },
                                {
                                    answer: messageBack.answer,
                                }
                            )
                                .then((result) => {
                                    console.log(result);
                                    Answer.deleteOne({
                                        _id: req.body.messageId,
                                    })
                                        .then(() =>
                                            res
                                                .status(200)
                                                .json('Suppresion Ok')
                                        )
                                        .catch((error) => error);
                                })
                                .catch((error) => console.log(error));
                        }
                    );
                }
            }
        });
    });

    /*Message.findOne({
        answer: req.body.messageId,
    }).then((messageBack) => {
        messageBack.answer.splice(
            messageBack.answer.indexOf(req.body.messageId),
            1
        );
        Message.updateOne(
            { answer: req.body.messageId },
            {
                answer: messageBack.answer,
            }
        )
            .then((result) => console.log(result))
            .catch((error) => console.log(error));
    });
    */
};
exports.modifMessage = (req, res) => {
    let message = JSON.parse(req.body.message);
    User.findOne({ _id: req.auth.userId }).then((resultUser) => {
        let adminLevel = resultUser.adminLevel;
        Answer.findOne({ _id: message.messageId }).then((result) => {
            if (result.userId === req.auth.userId || adminLevel === 1) {
                const messageObject = req.files
                    ? {
                          imageUrl: `${req.protocol}://${req.get(
                              'host'
                          )}/images/${req.files[0].filename}`,
                      }
                    : req.files === undefined
                    ? {
                          imageUrl: '',
                      }
                    : { imageUrl: result.imageUrl };
                Answer.updateOne(
                    { _id: message.messageId },
                    {
                        message: message.message,
                        imageUrl: messageObject.imageUrl,
                    }
                )
                    .then(() => res.status(200).json('Modif Ok'))
                    .catch((error) => error);
            }
        });
    });
};
