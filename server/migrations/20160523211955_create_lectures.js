exports.up = function(knex, Promise) {
  return knex.schema.createTable('lectures', function(table){
    table.increments();
    table.string('name').notNullable();
    table.text('description').defaultTo(null);
    table.timestamp('created_at').defaultTo(knex.fn.now());

    table.integer('participant_id')
         .unsigned()
         .notNullable()
         .references("id")
         .inTable('participants')
         .onDelete('cascade');

    table.integer('class_id')
         .unsigned()
         .notNullable()
         .references("id")
         .inTable('classes')
         .onDelete('cascade');

    table.index(['participant_id', 'class_id'], 'lecture');

  })
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('lectures');
};
