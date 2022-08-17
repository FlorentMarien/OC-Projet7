const Message = require('../models/Message');
const User = require('../models/User');
exports.sendMessage = (req, res) => {
    const messageObject = req.file && {
        imageUrl: `${req.protocol}://${req.get('host')}/images/${
            req.file.filename
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
        .then(() => res.status(201).json({ message: 'Message enregistré !' }))
        .catch((error) =>
            res.status(400).json({ message: 'Echec création', error })
        );
};
exports.getMessages = (req, res) => {
    Message.find()
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
