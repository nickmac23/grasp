angular.module('panic')
  .factory('lectureStudentService', service);

service.$inject = ['$window', '$rootScope', '$stateParams'];

function service($window, $scope, $stateParams){
  var defaultTimerValue = 31000;
  var lectures = getLectures();
  var lecture = lectures[$stateParams.id] ||
                { userCanVote: true,
                  currentUnderstanding: "",
                  timer: Date.now()-defaultTimerValue };
  lectures[$stateParams.id] = lecture;
  lecture.timer = new Date(lecture.timer)

  $scope.$on("$stateChangeSuccess", function(event, toState, toParams, fromState, fromParams){
    lectures = getLectures();
    lecture = lectures[$stateParams.id] ||
              { userCanVote: true,
                currentUnderstanding: "",
                timer: Date.now()-defaultTimerValue };
    lectures[$stateParams.id] = lecture;
    lecture.timer = new Date(lecture.timer)
  })

  var lectureStudentService = {
    canVote: canVote,
    voted: voted,
    resetTimer: resetTimer,
    getTimer: getTimer,
    getCurrentUnderstanding: getCurrentUnderstanding,
    setCurrentUnderstanding: setCurrentUnderstanding
  }

  return lectureStudentService;


  function canVote() {
    return lecture.userCanVote;
  }

  function voted() {
    lecture.userCanVote = false;
    lecture.timer = new Date(Date.now() + defaultTimerValue);
    setLectures();
    return lecture.userCanVote;
  }

  function resetTimer() {
    lecture.timer = new Date(Date.now() - defaultTimerValue);
    lecture.userCanVote = true;
    setLectures();
    return lecture.timer;
  }

  function getTimer() {
    var timer = (lecture.timer.getTime() - Date.now())
    return Math.floor((lecture.timer.getTime() - Date.now()) / 1000);
  }

  function getCurrentUnderstanding() {
    return lecture.currentUnderstanding;
  }

  function setCurrentUnderstanding(understanding) {
    lecture.currentUnderstanding = understanding;
    setLectures();
    return lecture.currentUnderstanding;
  }

  function getLectures() {
    return JSON.parse($window.localStorage.getItem('lectures')) || {};
  }

  function setLectures() {
    return $window.localStorage.setItem('lectures', JSON.stringify(lectures));
  }
}
