exports.up = function(knex, Promise) {
  return knex.schema.createTable('understanding_statuses', function(table){
    table.increments();
    table.string('understanding_status');
    table.timestamp('created_at').defaultTo(knex.fn.now());
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('understanding_statuses');
};
