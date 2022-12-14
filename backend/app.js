const express = require('express');
const mongoose = require('mongoose');
const userRoutes = require('./routes/user');
const messageRoutes = require('./routes/message');
const path = require('path');
const answerRoute = require('./routes/answer');
const privatemessageRoute = require('./routes/privatemessage');
const socket = require('./socket');
const dotenv = require('dotenv');
dotenv.config();

const app = express();
mongoose
    .connect(process.env.MONGODB_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        dbName: 'Project7',
    })
    .then(() => console.log('Connexion à MongoDB réussie !'))
    .catch(() => console.log('Connexion à MongoDB échouée !'));

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization'
    );
    res.setHeader(
        'Access-Control-Allow-Methods',
        'GET, POST, PUT, DELETE, PATCH, OPTIONS'
    );
    next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/auth', userRoutes);
app.use('/api/message', messageRoutes);
app.use('/api/answer', answerRoute);
app.use('/api/privatemessage', privatemessageRoute);
app.use('/images/', express.static(path.join(__dirname, 'images')));

module.exports = app;
