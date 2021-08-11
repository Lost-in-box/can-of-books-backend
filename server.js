'use strict';

const express = require('express');
require('dotenv').config();
const cors = require('cors');
const app = express();
const mongoose = require('mongoose');

const jwt = require('jsonwebtoken');
const jwksClient = require('jwks-rsa');

const PORT = process.env.PORT;
const JWKSURI = process.env.JWKSURI;
const MONGO_DB_URL = process.env.MONGO_DB_URL;

const { seedUsersCollection } = require('./models/User');
const {User} = require('./models/User');

app.use(express.json());
app.use(cors());

mongoose.connect(`${MONGO_DB_URL}/books`, { useNewUrlParser: true, useUnifiedTopology: true });


const client = jwksClient({
  jwksUri: JWKSURI
});

function getKey(header, callback) {
  client.getSigningKey(header.kid, function (err, key) {
    var signingKey = key.publicKey || key.rsaPublicKey;
    callback(null, signingKey);
  });
}

app.get('/test', (request, response) => {

  const token = request.headers.authorization.split(' ')[1];

  jwt.verify(token, getKey, {}, (error, user) => {
    if (error) {
      response.send('invalid token');
    } else{
      response.json(user);
    }

  });
});

//============================== Mongo DB => GET Method ================================//

// seedUsersCollection();

let booksHandler = async (request, response) => {
  let email = request.query.email;

  User.findOne({ email : email },(err,user) =>{

    if(err){ console.log('Something Wrong');
    }
    else{
      response.json(user.books);
    }

  });
};

app.get('/books', booksHandler);

//============================== Mongo DB => POST Method ================================//

let createBook = async (request, response) => {

  let {

    title,
    description,
    status
  } = request.body;

  let newBookObj = new User({

    title,
    description,
    status
  });
  newBookObj.save();

  response.json(newBookObj);
};

app.post('/books', createBook);

// ================================== Mongo DB => DELETE Method ==================================== //

let deleteBook = async (request, response) => {
  let bookId = request.params.books_id;

  User.deleteOne({ _id: bookId }, (error, deleted) => {
    response.send(deleted);
  });
};

app.delete('/books/:books_id', deleteBook);

app.listen(PORT, () => console.log(`listening on port ${PORT}`));
