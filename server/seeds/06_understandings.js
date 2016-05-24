
exports.seed = function(knex, Promise) {
  return Promise.join(
    // Deletes ALL existing entries
    knex('understandings').del()
  ).then(function(){
    return Promise.join(
      insertUnderstandings('Angular Stuff', 'Undecided', 'Dave', new Date()),
      insertUnderstandings('Angular Stuff', "I don't get it", 'Dave', new Date(Date.now()+10000)),
      insertUnderstandings('Angular Stuff', 'I get it', 'Dave', new Date(Date.now()+50000)),
      insertUnderstandings('Angular Stuff', "I don't get it", 'Dave', new Date(Date.now()+70000)),
      insertUnderstandings('Angular Stuff', 'Undecided', 'Bob', new Date()),
      insertUnderstandings('Angular Stuff', "I don't get it", 'Bob', new Date(Date.now()+15000)),
      insertUnderstandings('Angular Stuff', 'I get it', 'Bob', new Date(Date.now()+200000)),
      insertUnderstandings('Angular Stuff', "I don't get it", 'Bob', new Date(Date.now()+350000))
    );
  });
  function insertUnderstandings(lectureName, status, userName, timestamp){
    console.log(status);
    var result = { created_at: timestamp }
    return knex('users').where('name', userName).first().then(function(user){
      result.user_id = user.id;
      return knex('understanding_statuses').where('status', status).first();
    }).then(function(statusDB){
      console.log(statusDB);
      result.status_id = statusDB.id;
      return knex('lectures').where('name', lectureName).first();
    }).then(function(lecture){
      result.lecture_id = lecture.id;
      return knex('understandings').insert(result);
    })
  }
};

//Statuses
// 'I don\'t get it'
// 'Undecided'
// 'I get it'
