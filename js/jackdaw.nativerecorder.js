Jackdaw.Nativerecorder = ( function( window ) {

  var mediaRecorder;

  function Init(){

     console.log("Hello Native recorder")
     
     if (navigator.mediaDevices.getUserMedia) {
        console.log('getUserMedia supported.');

       
          var constraints = { audio: true, video:false };
          var chunks = [];

          navigator.mediaDevices.getUserMedia(constraints)
          .then(function(stream) {


            var options = {
              audioBitsPerSecond : 44100,
              // audioBitsPerSecond : 128000,
              // videoBitsPerSecond : 2500000,
              mimeType : 'audio/webm'
            }
            mediaRecorder = new MediaRecorder(stream,options);

            // visualize(stream);

            mediaRecorder.onstop = function(e) {
              console.log("data available after MediaRecorder.stop() called.",e);
              console.log("is this the buffer???",chunks);

              var blob = new Blob(chunks, { 'type' : 'audio/ogg; codecs=opus' });
              var nativerecorderevent = new CustomEvent('nativerecorderevent', { 'detail': blob});
              document.body.dispatchEvent(nativerecorderevent);

              chunks = [];
              console.log("recorder stopped",blob);
              
            }

            mediaRecorder.ondataavailable = function(e) {
              chunks.push(e.data);
            }

          })
          .catch(function(err) {
            console.log('The following error occured: ' + err);
          })
        
      }

  }

  function Startrecorder(){
        mediaRecorder.start();
        console.log(mediaRecorder.state);
        console.log("recorder started");
        // record.style.background = "red";
        // record.style.color = "black";
  }


  function Stoprecorder(){
        mediaRecorder.stop();
        console.log(mediaRecorder.state);
        console.log("recorder stopped");
        // record.style.background = "";
        // record.style.color = "";
  }





return{
          init:Init,
          startrecorder:Startrecorder,
          stoprecorder:Stoprecorder
};


} )( window );
