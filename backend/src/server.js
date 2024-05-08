const { MongoClient } = require('mongodb');
const dotenv = require('dotenv');
const express = require('express');
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



