(function () {
  'use strict';

  angular.module('panic')
    .directive('audioRecording', audioDirective);

  function audioDirective() {
    return {
      scope: {},
      templateUrl: "partials/audio.recording.html",
      controller: audioController,
      controllerAs: "vm"
    };
  }

    audioController.$inject = [
      "$scope",
      "$rootScope",
      "$window"
    ];

    function audioController($scope, $rootScope, $window) {
      var vm = this;
      vm.isRecording = false;

      if (!navigator.getUserMedia)
        navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia ||
          navigator.mozGetUserMedia || navigator.msGetUserMedia;

      if (navigator.getUserMedia) {
        navigator.getUserMedia({audio:true, video:false}, success, function(e) {
          alert('Error capturing audio.');
        });
      } else alert('getUserMedia not supported in this browser.');

      vm.record = function () {
        vm.isRecording = true;
        console.log('recording started!')
      };

      vm.stopRecording = function () {
        vm.isRecording = false;
        console.log('recording stopped')
        // stop stream

      }

      function success(e) {
        console.log("butt stuff")
        vm.audioContext = $window.AudioContext || $window.webkitAudioContext;
        vm.context = new audioContext();

        // the sample rate is in context.sampleRate
        vm.audioInput = vm.context.createMediaStreamSource(e);

        var bufferSize = 2048;
        vm.recorder = vm.context.createScriptProcessor(bufferSize, 1, 1);

        vm.recorder.onaudioprocess = function(e){
          if(!recording) return;
          console.log ('recording');
          vm.left = e.inputBuffer.getChannelData(0);
          $window.Stream.write(convertoFloat32ToInt16(vm.left));
        }

        vm.audioInput.connect(vm.recorder)
        vm.recorder.connect(vm.context.destination);
      }

      function convertoFloat32ToInt16(buffer) {
        var l = buffer.length;
        var buf = new Int16Array(l)

        while (l--) {
          buf[l] = buffer[l]*0xFFFF;    //convert to 16 bit
        }
        return buf.buffer
      }

    }

}());
