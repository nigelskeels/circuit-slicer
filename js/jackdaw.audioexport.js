Jackdaw.Audioexport = ( function( window, undefined ) {


  function Init(){
      console.log("Hello Audioexport")    
  }


  function Download(buf, name, type) {
    console.log("output buf = ",buf)
    
    var buffy = encodeWAV(buf.getChannelData(0),buf.sampleRate)

    var a = document.createElement("a");
    var file = new Blob([buffy], {type: type});
    a.href = window.URL.createObjectURL(file);
    a.innerHTML = name;
    a.download = name;
    a.target = "_blank";
    a.className = "downloadlink";
    
    document.body.appendChild(a)
    a.click();
    // window.URL.revokeObjectURL(a.href); 
    // a.remove();
  }



//next functions are all abot converting to a valid wave file format
   function encodeWAV(buf, sr){
      var buffer = new ArrayBuffer(44 + buf.length * 2);
      var view = new DataView(buffer);
      /* RIFF identifier */
      writeString(view, 0, 'RIFF');
      /* file length */
      view.setUint32(4, 32 + buf.length * 2, true);
      /* RIFF type */
      writeString(view, 8, 'WAVE');
      /* format chunk identifier */
      writeString(view, 12, 'fmt ');
      /* format chunk length */
      view.setUint32(16, 16, true);
      /* sample format (raw) */
      view.setUint16(20, 1, true);
      /* channel count */
      view.setUint16(22, 1, true);
      /* sample rate */
      view.setUint32(24, sr, true);
      /* byte rate (sample rate * block align) */
      view.setUint32(28, sr *2 , true);
      /* block align (channel count * bytes per sample) */
      view.setUint16(32, 2, true);
      /* bits per sample */
      view.setUint16(34, 16, true);
      /* data chunk identifier */
      writeString(view, 36, 'data');
      /* data chunk length */
      view.setUint32(40, buf.length * 2, true);

      floatTo16BitPCM(view, 44, buf);

      return view;
    }    

    function floatTo16BitPCM(output, offset, input){
      for (var i = 0; i < input.length; i++, offset+=2){
        var s = Math.max(-1, Math.min(1, input[i]));
        output.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7FFF, true);
      }
    }

    function writeString(view, offset, string){
      for (var i = 0; i < string.length; i++){
        view.setUint8(offset + i, string.charCodeAt(i));
      }
    } 




return{
                init:Init,
            download:Download
};


} )( window );
