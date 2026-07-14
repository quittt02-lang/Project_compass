const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

const recordRouter = require('./src/user_router/user_router');

const PORT = process.env.PORT || 5000;
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(recordRouter);

const start = async () => {
    try {
        await mongoose.connect(process.env.mongo_url);
        
        app.listen(PORT, () => {
            console.log(`Server started on PORT ${PORT}`);
        });
    } catch (e) {
        console.log('Error during startup:', e);
    }
};

start();