var bcrypt = require('bcrypt');
var password = bcrypt.hashSync('password', 10);

exports.seed = function(knex, Promise) {
  return Promise.join(
    // Deletes ALL existing entries
    knex('users').del()
  ).then(function(){

    return Promise.join(
      // Inserts seed entries
      knex('users').insert({email: 'user1@example.com', name: 'Bob', password: password}),
      knex('users').insert({email: 'user2@example.com', name: 'Steve', password: password}),
      knex('users').insert({email: 'user3@example.com', name: 'Dave', password: password})
    )
  })
};
