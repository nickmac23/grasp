
exports.up = function(knex, Promise) {
  return knex.schema.createTable('participants', function(table){
    table.increments();
    table.boolean('instructor').defaultTo(false);
    table.timestamp('created_at').defaultTo(knex.fn.now());


    table.integer('user_id')
         .unsigned()
         .notNullable()
         .references("id")
         .inTable('users')
         .onDelete('cascade');

    table.integer('class_id')
         .unsigned()
         .notNullable()
         .references("id")
         .inTable('classes')
         .onDelete('cascade');

    table.index(['user_id', 'class_id'], 'participant');

  })
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('participants');
};
