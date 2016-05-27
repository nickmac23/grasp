exports.up = function(knex, Promise) {
  return knex.schema.createTable('lectures', function(table){
    table.increments();
    table.string('name').notNullable();
    table.text('description').defaultTo(null);
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('started_at').defaultTo(null);
    table.timestamp('ended_at').defaultTo(null);
    table.boolean('is_active').defaultTo(false);

    table.integer('instructor_id')
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

    table.index(['instructor_id', 'class_id'], 'lecture');

  })
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('lectures');
};
