const bcrypt = require('bcrypt');
const User = require('../models/User');
const jwt = require('jsonwebtoken');

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

exports.getlogin = (req, res) => {
    User.findOne({ _id: req.auth.userId })
        .then((user) => {
            if (!user) {
                return res.status(401).json({
                    message: 'Utilisateur introuvable',
                });
            }
            res.status(200).json({
                name: user.name,
                prename: user.prename,
                imageUrl: user.imageUrl,
                adminLevel: user.adminLevel,
                imageArray: user.imageArray,
                email: user.email,
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
