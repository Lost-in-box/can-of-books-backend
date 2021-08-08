'use strict';

const express = require('express');
require('dotenv').config();
const cors = require('cors');
const app = express();

const jwt = require('jsonwebtoken');
const jwksClient = require('jwks-rsa');
const PORT = process.env.PORT;
const JWKSURI = process.env.JWKSURI;

app.use(cors());


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
    }
    response.json(user);
  });
});

app.listen(PORT, () => console.log(`listening on port ${PORT}`));
