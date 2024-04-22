const { MongoClient } = require('mongodb');
const dotenv = require('dotenv');
const express = require('express');
//const Parser = require('rss-parser');
const cors = require('cors');
const bodyParser = require('body-parser');
const router = require('./routes/router');

const app = express();
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true })); 
app.use(bodyParser.json());
dotenv.config();

app.use('/', router); 

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server beží na porte ${PORT}`);
});


/*
import { MongoClient } from 'mongodb';
import { config } from 'dotenv';
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import router from './routes/router.js';

const app = express();
app.use(bodyParser.urlencoded({ extended: true })); 
app.use(bodyParser.json());
app.use(cors());
config();

const uri = process.env.DATABASE; 
const client = new MongoClient(uri);
client.connect();

export function getClient(){
    return client;    
} 

app.use('/', router); 

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server beží na porte ${PORT}`);
});

*/
