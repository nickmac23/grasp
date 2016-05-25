
exports.seed = function(knex, Promise) {
  return Promise.join(
    // Deletes ALL existing entries
    knex('classes').del()
  ).then(function(){
    return Promise.join(
      knex('classes').insert({name: 'JS 101', description: 'A really cool class about javascript.'}),
      knex('classes').insert({name: 'Angular 0001', description: 'A really cool class about Angular.'}),
      knex('classes').insert({name: 'Sockets 400', description: 'A really cool class about sockets.'})
    );
  });
};
