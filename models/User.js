'use strict';

const mongoose = require('mongoose');
const bookSchema = require ('./BookSchema');

const bestBookSchema = new mongoose.Schema({
  email: { type: String, unique: true },
  books: [bookSchema]
});

const User = mongoose.model('books', bestBookSchema);

const seedUsersCollection = () => {
  try {

    let userOne = new User({

      email: 'md20.harb21@gmail.com',
      books: [
        {
          title: 'Nineteen Eighty-Four',
          description: 'The story takes place in an imagined future, the year 1984, when much of the world has fallen victim to perpetual war, omnipresent government surveillance, historical negationism, and propaganda.',
          status: 'true'
        },
        {
          title: 'War and Peace',
          description: `focuses on Napoleon's invasion of Russia in 1812`,
          status: 'true'
        },
        {
          title: 'Crime and Punishmen',
          description: 'focuses on the mental anguish and moral dilemmas of Rodion Raskolnikov, an impoverished ex-student in Saint Petersburg who formulates a plan to kill an unscrupulous pawnbroker for her money.',
          status: 'true'
        }
      ]
    });
    userOne.save();

  } catch (error) {
    console.log('Error while creating the user: ', error.message);
  }
};

module.exports = {
  User,
  seedUsersCollection
};

