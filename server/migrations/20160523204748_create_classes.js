
exports.up = function(knex, Promise) {
  return knex.schema.createTable('classes', function(table){
    table.increments();
    table.string('name').notNullable().unique();
    table.text('description');
    table.timestamp('create_at').defaultTo(knex.fn.now());
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('classes');
};
