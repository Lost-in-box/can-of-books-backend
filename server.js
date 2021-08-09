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

//============================== Mongo DB ================================//

app.get('/books', seedUsersCollection);

(request,response) => {
  let email = request.query.email;

  User.find({ email : email },(err,user) =>{

    if(err){ console.log('Something Wrong');
    }
    else{
      response.json(user[0].books);
    }

  });
};

app.listen(PORT, () => console.log(`listening on port ${PORT}`));
