
exports.seed = function(knex, Promise) {
  return Promise.join(
    // Deletes ALL existing entries
    knex('understandings').del()
  ).then(function(){

    var promises = [];

    for (var i = 0; i < 10000; i++) {
      var daveOffset = Math.random() * 5000000;
      var bobOffset = Math.random() * 5000000;
      var daveStatus = Math.floor(Math.random() * 2 + 1);
      var bobStatus = Math.floor(Math.random() * 2 + 1);

      switch (daveStatus) {
        case 1:
          daveStatus = "I don't get it"
          break;
        case 2:
          daveStatus = "I get it"
          break;
      }
      switch (bobStatus) {
        case 1:
          bobStatus = "I don't get it"
          break;
        case 2:
          bobStatus = "I get it"
          break;
      }

      promises.push(insertUnderstandings('Angular Stuff', daveStatus, 'Dave', new Date(Date.now()+daveOffset)));
      promises.push(insertUnderstandings('Angular Stuff', bobStatus, 'Bob', new Date(Date.now()+bobOffset)));
    }
    return Promise.join(
      Promise.all(promises),
      insertUnderstandings('Sockets Stuff', 'Undecided', 'Dave', new Date()),
      insertUnderstandings('Sockets Stuff', "I don't get it", 'Dave', new Date(Date.now()+10000)),
      insertUnderstandings('Sockets Stuff', 'I get it', 'Dave', new Date(Date.now()+30000)),
      insertUnderstandings('Sockets Stuff', "I don't get it", 'Dave', new Date(Date.now()+100000)),

      insertUnderstandings('Sockets Stuff', 'Undecided', 'Bob', new Date()),
      insertUnderstandings('Sockets Stuff', "I don't get it", 'Bob', new Date(Date.now()+23400)),
      insertUnderstandings('Sockets Stuff', 'I get it', 'Bob', new Date(Date.now()+40000)),
      insertUnderstandings('Sockets Stuff', "I don't get it", 'Bob', new Date(Date.now()+60000))
    );
  });
  function insertUnderstandings(lectureName, status, userName, timestamp){
    var result = { created_at: timestamp }
    return knex('users').where('name', userName).first().then(function(user){
      result.user_id = user.id;
      return knex('understanding_statuses').where('status', status).first();
    }).then(function(statusDB){
      result.status_id = statusDB.id;
      return knex('lectures').where('name', lectureName).first();
    }).then(function(lecture){
      result.lecture_id = lecture.id;
      //console.log(result);
      return knex('understandings').insert(result);
    })
  }
};
