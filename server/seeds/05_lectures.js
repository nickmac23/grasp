exports.seed = function(knex, Promise) {
  return Promise.join(
      // Deletes ALL existing entries
      knex('lectures').del()
  ).then(function(){

    return Promise.join(

      addLectureWithClassNameInstructorName("Steve", "Angular 0001", { name: "Angular Stuff" , description: 'All about angular stuff.', ended_at: new Date(Date.now()+50000000), started_at: new Date(Date.now()), is_active: true} ),
      addLectureWithClassNameInstructorName("Bob", "Angular 0001", { name: "More Angular Stuff" , description: 'All about angular stuff.', ended_at: null, started_at: new Date(Date.now()), is_active: true} ),
      addLectureWithClassNameInstructorName("Bob", "JS 101", { name: "javascript Stuff" , description: 'All about js stuff.', ended_at: null, started_at: new Date(Date.now()), is_active: true} ),
      addLectureWithClassNameInstructorName("Dave", "Sockets 400", { name: "Sockets Stuff" , description: 'All about sockets stuff.', ended_at: null, started_at: new Date(Date.now()), is_active: true} )

    )
  });

  function addLectureWithClassNameInstructorName(instructorName, className, lectureData) {

    return knex('classes').where('name', className).first().then(function(classObj){
      lectureData.class_id = classObj.id;
      return knex('users').where({name: instructorName}).first()
    }).then(function(user){
      return knex('participants').where({'participants.user_id': user.id, 'participants.class_id': lectureData.class_id}).first()
    }).then(function(participants){
      lectureData.instructor_id = participants.id;
      return knex('lectures').insert(lectureData);
    }).catch(function(err){
      console.log(err);
    })
  }

};
