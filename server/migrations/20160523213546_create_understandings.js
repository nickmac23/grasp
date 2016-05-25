exports.up = function(knex, Promise) {
  return knex.schema.createTable('understandings', function(table){
    table.increments();
    table.timestamp('created_at').defaultTo(knex.fn.now());

    table.integer('status_id')
         .notNullable()
         .references("id")
         .inTable('understanding_statuses')
         .onDelete('cascade');

    table.integer('user_id')
         .unsigned()
         .notNullable()
         .references("id")
         .inTable('users')
         .onDelete('cascade');

    table.integer('lecture_id')
         .unsigned()
         .notNullable()
         .references("id")
         .inTable('lectures')
         .onDelete('cascade');

  })
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('understandings');
};
