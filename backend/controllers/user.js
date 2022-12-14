const bcrypt = require('bcrypt');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const Message = require('../models/Message');
const Answer = require('../models/Answer');
exports.signup = (req, res) => {
    const objectContact = JSON.parse(req.body.user);
    bcrypt
        .hash(objectContact.password, 10)
        .then((hash) => {
            const user = new User({
                email: objectContact.email,
                password: hash,
                name: objectContact.name,
                prename: objectContact.prename,

                imageUrl: `${req.protocol}://${req.get('host')}/images/${
                    req.files[0].filename
                }`,
                imageArray: [
                    `${req.protocol}://${req.get('host')}/images/${
                        req.files[0].filename
                    }`,
                ],
            });
            user.save()
                .then(() =>
                    res.status(201).json({ message: 'Utilisateur créé !' })
                )
                .catch((error) => res.status(400).json({ error }));
        })
        .catch((error) => res.status(500).json({ error }));
};
exports.login = (req, res) => {
    User.findOne({ email: req.body.email })
        .then((user) => {
            if (!user) {
                return res.status(401).json({
                    message: 'Paire login/mot de passe incorrecte',
                });
            }
            bcrypt
                .compare(req.body.password, user.password)
                .then((valid) => {
                    if (!valid) {
                        return res.status(401).json({
                            message: 'Paire login/mot de passe incorrecte',
                        });
                    }
                    res.status(200).json({
                        userId: user._id,
                        token: jwt.sign(
                            { userId: user._id },
                            'RANDOM_TOKEN_SECRET',
                            {
                                expiresIn: '24h',
                            }
                        ),
                    });
                })
                .catch((error) => res.status(500).json({ error }));
        })
        .catch((error) => res.status(500).json({ error }));
};
async function getnbrmessageanswer(userid) {
    let nbrmessage;
    let nbranswer;
    await Message.find({ userId: userid }).then((res) => {
        nbrmessage = res.length;
    });
    await Answer.find({ userId: userid }).then((res) => {
        nbranswer = res.length;
    });
    let objectRes = {
        nbrmessage: nbrmessage,
        nbranswer: nbranswer,
    };
    return objectRes;
}
exports.getlogin = (req, res) => {
    let userid = req.body.userid;
    User.findOne({ _id: userid })
        .then((user) => {
            if (!user) {
                return res.status(401).json({
                    message: 'Utilisateur introuvable',
                });
            }
            getnbrmessageanswer(req.body.userid).then((result) => {
                res.status(200).json({
                    name: user.name,
                    prename: user.prename,
                    imageUrl: user.imageUrl,
                    adminLevel: user.adminLevel,
                    imageArray: user.imageArray,
                    email: user.email,
                    nbrmessage: result.nbrmessage,
                    nbranswer: result.nbranswer,
                });
            });
        })
        .catch((error) => res.status(500).json({ error }));
};
exports.sendimg = (req, res) => {
    User.findOne({ _id: req.auth.userId })
        .then((user) => {
            if (!user) {
                return res.status(401).json({
                    message: 'Utilisateur introuvable',
                });
            } else {
                let newimageArray = user.imageArray ? user.imageArray : [];
                for (let x = 0; x < req.files.length; x++) {
                    newimageArray.push(
                        `${req.protocol}://${req.get('host')}/images/${
                            req.files[x].filename
                        }`
                    );
                }
                User.updateOne(
                    { _id: req.auth.userId },
                    { imageArray: newimageArray }
                )
                    .then(() => res.status(200).json(newimageArray))
                    .catch((error) => res.status(500).json({ error }));
            }
        })
        .catch((error) => res.status(500).json({ error }));
};
exports.modifpassword = (req, res) => {
    User.findOne({ _id: req.auth.userId }).then((user) => {
        bcrypt.compare(req.body.backPassword, user.password).then((valid) => {
            if (valid) {
                bcrypt.hash(req.body.newPassword, 10).then((hash) => {
                    User.updateOne({ _id: req.auth.userId }, { password: hash })
                        .then(() =>
                            res.status(200).json('Mots de passe modifié')
                        )
                        .catch((error) => res.status(500).json(error));
                });
            } else {
                res.status(401).json("Erreur de l'ancien mots de passe");
            }
        });
    });
};
exports.modifname = (req, res) => {
    let newname = req.body.newname;
    let newprename = req.body.newprename;
    User.updateOne(
        { _id: req.auth.userId },
        { name: newname, prename: newprename }
    )
        .then(() => res.status(200).json('Nom / Prenom modifié'))
        .catch((error) => res.status(500).json(error));
};
exports.modifemail = (req, res) => {
    let newemail = req.body.newemail;
    User.find({ email: newemail }).then((result) => {
        if (result.length === 0) {
            User.updateOne({ _id: req.auth.userId }, { email: newemail })
                .then(() => res.status(200).json({ msg: 'Email modifié' }))
                .catch((error) => res.status(500).json(error));
        } else {
            res.status(400).json({ msg: 'Adresse email déjà enregistré' });
            // return 1 for Doublon
        }
    });
};
exports.deletegallery = (req, res) => {
    User.findOne({ _id: req.auth.userId }).then((user) => {
        let newimageArray = user.imageArray;
        let filename = String(req.body.imageArray);
        newimageArray.splice(newimageArray.indexOf(req.body.imageArray), 1);
        User.updateOne({ _id: req.auth.userId }, { imageArray: newimageArray })
            .then(() => {
                filename = filename.substring(filename.lastIndexOf('/'));
                filename = filename.replace('/', '');
                fs.unlink(`images/${filename}`, () => {});
                res.status(200).json(newimageArray);
            })
            .catch((error) => res.status(200).json('Error' + error));
    });
};
exports.modifpdp = (req, res) => {
    User.findOne({ _id: req.auth.userId }).then(() => {
        User.updateOne(
            { _id: req.auth.userId },
            { imageUrl: req.body.imageArray }
        )
            .then(() => {
                res.status(200).json(req.body.imageArray);
            })
            .catch((error) => res.status(200).json('Error' + error));
    });
};
exports.rechercheuser = (req, res) => {
    let recherche = { name: '', prename: '' };
    if (req.body.keyRecherche.lastIndexOf(' ') === -1) {
        recherche.prename = req.body.keyRecherche.substring(
            0,
            req.body.keyRecherche.length
        );
    } else {
        recherche.prename = req.body.keyRecherche.substring(
            0,
            req.body.keyRecherche.lastIndexOf(' ')
        );
        req.body.keyRecherche.lastIndexOf(' ') !== -1 &&
            (recherche.name = req.body.keyRecherche.substring(
                req.body.keyRecherche.lastIndexOf(' ')
            ));
    }

    User.find({ prename: recherche.prename })
        .then((user) => {
            if (!user) {
                return res.status(401).json({
                    message: 'Utilisateur introuvable',
                });
            }
            let reply = [];
            for (let x = 0; x < user.length; x++) {
                reply[x] = {
                    _id: user[x]._id,
                    //email: user[x].email,
                    imageArray: user[x].imageArray,
                    imageUrl: user[x].imageUrl,
                    name: user[x].name,
                    prename: user[x].prename,
                };
            }
            // Deleting a property completely
            res.status(200).json(reply);
        })
        .catch((error) => res.status(500).json({ error }));
};
