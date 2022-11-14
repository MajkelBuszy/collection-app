require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');
const app = express();

const usersRoutes = require('./routes/users-routes');
const collectionsRoutes = require('./routes/collections-routes');
const itemsRoutes = require('./routes/items-routes');
const ErrorHandler = require('./models/errorHandler');

const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE');
    next();
});

app.use('/api/users', usersRoutes);
app.use('/api/collections', collectionsRoutes);
app.use('/api/items', itemsRoutes);


app.use((error, req, res, next) => {
    if(res.headerSent) return next(error);
    res.status(error.code || 500);
    res.json({error: error.message || 'Unkown error'})
});

app.use(express.static(path.join(__dirname, '/client/build')));

app.use('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
});
app.use((req, res, next) => {
    const error = new ErrorHandler('Could not find this route.', 404);
    throw error;
});

mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Server running on ${PORT}`);
        });
    })
    .catch(err => console.log(err));
