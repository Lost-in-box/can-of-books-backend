'use strict';

const mongoose = require('mongoose');


const bookSchema = new mongoose.Schema({

  title: { type: String },
  description: { type: String },
  status: { type: Boolean }
});

module.exports = bookSchema;
