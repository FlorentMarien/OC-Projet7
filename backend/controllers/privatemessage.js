const Privatemessage = require('../models/Privatemessage');
const User = require('../models/User');
exports.sendMessage = (msg) => {
    let message = new Privatemessage({
        ...msg,
        message: msg.msg,
    });
    delete message.msg;
    message.save().then(() => {
        return 1;
    });
};

exports.getMessages = (req, res) => {
    Privatemessage.find({
        userId: { $in: [req.body.userId, req.body.destuserId] },
        destuserId: { $in: [req.body.userId, req.body.destuserId] },
    })
        .then((result) => {
            res.status(200).json({ conversation: result });
        })
        .catch((err) => res.status(400).json({ err }));
};
function indexOfArray(val, array) {
    var hash = {};
    for (var i = 0; i < array.length; i++) {
        hash[array[i]] = i;
    }
    return hash.hasOwnProperty(val) ? hash[val] : -1;
}
exports.getAllLastMessageofuser = (req, res) => {
    Privatemessage.find({ userId: req.body.userId })
        .then((result) => {
            Privatemessage.find({ destuserId: req.body.userId }).then(
                (result2) => {
                    let array = [...result, ...result2];
                    array.sort(function (a, b) {
                        if (a.dateTime > b.dateTime) return 1;
                        if (a.dateTime < b.dateTime) return -1;
                        return 0;
                    });
                    array.reverse();
                    let arrayReturn = [];
                    let doublonArray = [];

                    array.forEach((element) => {
                        let doublon = false;
                        if (
                            indexOfArray(
                                [[element.userId, element.destuserId]],
                                doublonArray
                            ) !== -1
                        ) {
                            doublon = true;
                        }
                        if (doublon === false) {
                            doublonArray.push([
                                element.userId,
                                element.destuserId,
                            ]);
                            doublonArray.push([
                                element.destuserId,
                                element.userId,
                            ]);
                            arrayReturn.push(element);
                        }
                    });
                    getuserinfo(arrayReturn, req).then((array) => {
                        res.status(200).json({ conversation: array });
                    });
                }
            );
        })
        .catch((err) => res.status(400).json({ err }));
};
async function getuserinfo(array, req) {
    let parametre;
    for (let x = 0; x < array.length; x++) {
        if (array[x].userId === req.auth.userId)
            parametre = array[x].destuserId;
        else parametre = array[x].userId;
        await User.findOne({ _id: parametre }).then((result) => {
            array[x] = {
                ...array[x]._doc,
                profilname: result.name,
                profilprename: result.prename,
                profilimageUrl: result.imageUrl,
            };
        });
    }
    return array;
}
