
exports.seed = function(knex, Promise) {
  return Promise.join(
    // Deletes ALL existing entries
    knex('understanding_statuses').del()
  ).then(function(){
    // Inserts seed entries
    return Promise.join(
      knex('understanding_statuses').insert({status: 'I don\'t get it'}),
      knex('understanding_statuses').insert({status: 'Undecided'}),
      knex('understanding_statuses').insert({status: 'I get it'})
    );
  });
};
