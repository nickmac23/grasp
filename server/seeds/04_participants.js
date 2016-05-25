
exports.seed = function(knex, Promise) {
  return Promise.join(
    // Deletes ALL existing entries
    knex('participants').del()
  ).then(function(){
    return Promise.join(
      participantFromUserNameClassName('Bob', 'JS 101', true),
      participantFromUserNameClassName('Dave', 'JS 101', false),
      participantFromUserNameClassName('Steve', 'JS 101', false),
      participantFromUserNameClassName('Steve', 'Angular 0001', true),
      participantFromUserNameClassName('Bob', 'Angular 0001', true),
      participantFromUserNameClassName('Dave', 'Angular 0001', false),
      participantFromUserNameClassName('Dave', 'Sockets 400', true),
      participantFromUserNameClassName('Steve', 'Sockets 400', false),
      participantFromUserNameClassName('Bob', 'Sockets 400', false)
    )
  });

  function participantFromUserNameClassName(username, className, instructor){
    var result = { instructor: instructor };
    return knex('users').where('name', username).first().then(function(user){
      result.user_id = user.id;
      return knex('classes').where('name', className).first()
    }).then(function(classObj){
      result.class_id = classObj.id
      return knex('participants').insert(result);
    });
  }
};
