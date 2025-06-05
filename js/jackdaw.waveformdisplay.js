Jackdaw.Waveformdisplay = ( function( window, undefined ) {

var canvascontainer;
var canvas;
var lastbuffer;

function Init(){
    console.log("Hello waveformdisplay")
}


function Drawbuffer(buffer,_zoom) {

    canvascontainer = document.getElementById("canvascontainer");
    canvas = document.getElementById("waveform");
    hitpoints = document.getElementById("svg");

    
    if(buffer!=undefined){
        lastbuffer = buffer;
    }else{
        buffer = lastbuffer; 
    }

    // var width =  _zoom || canvascontainer.width;
    var width = canvascontainer.offsetWidth;
    var height = canvascontainer.offsetHeight;
    canvas.width=width;
    canvas.height=height;
    
    hitpoints.setAttribute("width",  width);
    hitpoints.setAttribute("height",  height);
    
    // var height = canvas.height;
    var context = canvas.getContext('2d');

    context.clearRect(0, 0, canvas.width, canvas.height);

    var data = buffer.getChannelData( 0 );
    var step = Math.ceil( data.length / width );
    var amp = height / 2;
    for(var i=0; i < width; i++){
        var min = 1.0;
        var max = -1.0;
        for (var j=0; j<step; j++) {
            var datum = data[(i*step)+j]; 
            if (datum < min)
                min = datum;
            if (datum > max)
                max = datum;
        }
        context.fillRect(i,(1+min)*amp,1,Math.max(1,(max-min)*amp));
    }
    //draw diagonal line test
        // context.moveTo(0,0);
        // context.lineTo(200,100);
        // context.stroke();
}




return{
         init:Init,
   drawbuffer:Drawbuffer
};


} )( window );

//to zoom in 
// Jackdaw.Waveformdisplay.drawbuffer(undefined,"100000")