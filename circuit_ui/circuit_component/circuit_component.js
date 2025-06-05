import {InitMidi, Sendlight} from './midi.js';
import "../knob_component/knob-component.js";

customElements.define('circuit-component', class extends HTMLElement {

  constructor() {
    super(); // always call super() first in the ctor.


    // Create shadow DOM for the component.
    let shadowRoot = this.attachShadow({mode: 'open'});
  
  
    //The following array is like this ... [midinumber,color,buttontitle]

    this.buttonmap=[
                      [null],
                      [101,'grey',''],   [102,'grey','Reverse','Jackdaw.Beatdetection.reverseslice'],[103,'grey','Bass Boost','Jackdaw.Beatdetection.boostbass'],[104,'grey',''],[105,'grey','Paste','Jackdaw.Beatdetection.pasteslice'],[106,'grey','Clear','Jackdaw.Beatdetection.removeslice'],[107,'grey','Duplicate','Jackdaw.Beatdetection.copyslice'],[108,'grey',''],[109,'grey',''],         [110,'grey',''],
                      [111,'grey',''],         [112,'grey',''],[113,'grey','Pitched Mode','Jackdaw.Beatdetection.setPitchPlayMode'],[114,'grey',''],[115,'grey',''],[116,'grey',''],[117,'grey','Load File','openfileuploader'],[118,'grey','Export Slice','Jackdaw.Beatdetection.getcurrentslicebuffer'],[119,'grey','Export All','Jackdaw.Beatdetection.getallslices'],    [120,'grey',''],
                      [121,'grey',''],    [48,'','',0], [50,'','',1], [51,'','',2], [53,'','',3], [55,'','',4], [56,'','',5], [58,'','',6], [60,'','',7],     [134,'grey',''],
                      [135,'grey',''],    [36,'','',8], [38,'','',9], [39,'','',10],[41,'','',11],[43,'','',12],[44,'','',13],[46,'','',14],[47,'','',15],    [127,'grey',''],
                      [128,'grey',''],    [24,'','',16],[26,'','',17],[27,'','',18],[29,'','',19],[31,'','',20],[32,'','',21],[34,'','',22],[35,'','',23],    [140,'grey','Record','Startrecording'],
                      [121,'grey',''],    [12,'','',24],[14,'','',25],[15,'','',26],[17,'','',27],[19,'','',28],[20,'','',29],[22,'','',30],[23,'','',31],    [141,'grey',''] 
    ]

    this.buttonmapclone=this.buttonmap.slice(0);
    
    this.slidermap = {80:1,81:2,82:3,83:4,84:5,85:6,86:7,87:8,74:9}
    this.timeout={}
    this.timeoutval = 500;
    this.midienabled = true;

    this.circuituievent = new Event('circuituievent');

    this.defaultbuttonmap = this.buttonmap.slice(0);

    this.buttonSlot;
  
    shadowRoot.innerHTML = `
  
      <style>
        :host {
          display: block;
          width: 768px;
          height:580px;
          overflow:hidden;
          font-family: 'helvetica';
          contain: content;
          background-color: #656565;
          padding:10px;
          border-radius:10px;
          // background-image:url("");
          // background-repeat: no-repeat;
          // background-position: 746px 562px;I think he's popped off somewhere          // background-size: 33px 27px;
        }
        .but{
          height:60px;
          width:60px;
          float:left;
          border-radius:5px;
          margin:4px;
          position:relative;
          font-family: 'Roboto', sans-serif;
          // font-weight:bold;
          font-size: 12px;
          box-sizing: border-box;
          overflow:hidden;
          outline: 0;
          // white-space: nowrap;
          // text-overflow: ellipsis;
        }
        .round{
          position:relative;
          height:50px;
          width:50px;
          border-radius:50%;
          margin:9px;
          overflow:visible;
        }

        .firstlast{
          margin-right:25px;
          margin-left:25px;
        }

        .but label{
            bottom:2px;
        }

        .round{
          margin-right:30px;
          margin-left:30px;
        }

        .round label{
          display:block;
          position:absolute;
          top:14px;
          // left:40px;
          // white-space: nowrap;
          width:70px;
          text-align:left;
          color:#fff;
        }

        .thin{
           height:30px;
        }
        
        .bot{
          margin:15px 18px 14px 25px;
        }

        .bot label{
          display:block;
          position:absolute;
          top:40px;
          left:-13px;
          text-align:center;
          white-space: normal;
          color:#fff;
        }

        .square{
          border-radius:5px;
          margin: 15px 0 0 16px;
        }
        
        .red{
          background-color:red;
          color:#fff;
        }
        .orange{
          background-color:orange;
          color:#fff; 
        }
        .green{
          background-color:#9be89e;
          color:#fff;
        }
        .yellow{
          background-color:yellow;
          // color:#fff;
        }

        .grey{
          background-color:#999999;
          color:#fff; 
        }

        .greenflash{
          background-color: green;
          color: #fff;
          animation: backgroundblinker .5s step-end infinite alternate;
          -webkit-animation: backgroundblinker .5s step-end infinite alternate;
        }

        .redflash{
          background-color: red;
          color: black;
          animation: backgroundblinker .5s step-end infinite alternate;
          -webkit-animation: backgroundblinker .5s step-end infinite alternate;
        }

        .yellowflash{
          background-color: yellow;
          color: black;
          animation: backgroundblinker .5s step-end infinite alternate;
          -webkit-animation: backgroundblinker .5s step-end infinite alternate;
        }


        @-webkit-keyframes backgroundblinker { 
           // 50% { background-color: transparent; } 
           50% { background-color: #DDD; color:black;} 

        }
        @keyframes backgroundblinker { 
           // 50% { background-color: transparent; } 
           50% { background-color: #DDD; color:black;} 

        }
        
        #sliders{
          // border:solid red 1px;
          // width:665px;
          margin:30px 0 30px 30px;
          position:relative;
        }

        knob-component{
          display:inline-block;
          margin-right:11px;
          padding: 0 0 41px 0 ;
        }

         knob-component:nth-child(odd){
          padding:0;
         }

         knob-component:nth-child(1){
          margin-right:30px;
         }

         knob-component:nth-child(10){
          position:absolute;
          top:0;
          right:16px;
          height:70px;
          width:70px;
        }

        input[type=range].vertical
        {
            display:inline-block;
            writing-mode: bt-lr; /* IE */
            -webkit-appearance: slider-vertical; /* WebKit */
            width: 72px;
            height: 50px;
            margin-top:0px;
            margin-bottom: 10px;
            padding-top:0px;
            padding-bottom: 10px;
        }

        input[type=range].vertical.low{
            display:inline-block;
            margin-top:10px;
            margin-bottom: 0px;
            padding-top:10px;
            padding-bottom: 0px;
        }
        
        

      </style>
      <div id="sliders">
        <knob-component title="Volume" id="slider1" mid="48" value="64" min="0" max="128" step="128" offsetangle="180"></knob-component>
        <knob-component title="Start" id="slider2" mid="49" value="64" min="0" max="128" step="128" offsetangle="180"></knob-component>
        <knob-component title="Start Fine" id="slider3" mid="50" value="64" min="0" max="128" offsetangle="180"></knob-component>
        <knob-component title="End" id="slider4" mid="51" value="64" min="0" max="128" offsetangle="180"></knob-component>
        <knob-component title="End Fine" id="slider5" mid="52" value="64" min="0" max="128" offsetangle="180"></knob-component>
        <knob-component id="slider6" mid="53" value="64" min="0" max="128" offsetangle="180"></knob-component>
        <knob-component id="slider7" mid="54" value="64" min="0" max="128" offsetangle="180"></knob-component>
        <knob-component id="slider8" mid="55" value="64" min="0" max="128" offsetangle="180"></knob-component>
        <knob-component id="slider9" mid="56" value="64" min="0" max="128" offsetangle="180"></knob-component>
        <knob-component title="Threshold" id="slider10" mid="57" value="64" min="0" max="128" offsetangle="180"></knob-component>

      </div>
      <div id="buttonSlot"></div>
    `;
  }
  
        // <label for="slider1"></label><input id="slider1" mid="48" type="range" min="0" max="128" value="0" class="vertical low">
        // <label for="slider2"></label><input id="slider2" mid="49" type="range" min="0" max="128" value="0" class="vertical">
        // <label for="slider3"></label><input id="slider3" mid="50" type="range" min="0" max="128" value="0" class="vertical low">
        // <label for="slider4"></label><input id="slider4" mid="51" type="range" min="0" max="128" value="0" class="vertical">
        // <label for="slider5"></label><input id="slider5" mid="52" type="range" min="0" max="128" value="0" class="vertical low">
        // <label for="slider6"></label><input id="slider6" mid="53" type="range" min="0" max="128" value="0" class="vertical">
        // <label for="slider7"></label><input id="slider7" mid="54" type="range" min="0" max="128" value="0" class="vertical low">
        // <label for="slider8"></label><input id="slider8" mid="55" type="range" min="0" max="128" value="0" class="vertical">
        // <label for="slider9"></label><input id="slider8" mid="56" type="range" min="0" max="128" value="0" class="vertical low">
  
  set data(data){
    this.buttonmap=data
    this._updateshaddowdom()
  }

  _resetdata(){
    this.buttonmap=this.buttonmapclone.slice();
    this._updateshaddowdom();
  }


  get data(){
    return this.buttonmap;
  }

  _returnslider(which){
    return this.sliders[which];
  } 

  _slidervalue(which,what,val){

      if(what=="value"){
        this.sliders[which].knobvalue=val;
        this.sliders[which]._adjustknobangle(val)
      }
      else{
        this.sliders[which].setAttribute(what,val);
      }

  }

  
  _setbutton(data){
    var index = this.buttonmap.findIndex(x => x[0]==data[0]);
    this.buttonmap[index]=data
    this._updateshaddowdom()
  }

  _getbuttonnumber(data){
    var index = this.buttonmap.findIndex(x => x[0]==data);
     return this.buttonmap[index][3]  
    //return this.buttonmap[index]
  }

  _getbuttonnumberreverse(data){
    var index = this.buttonmap.findIndex(x => x[3]==data);
    return this.buttonmap[index][0] 
  }


  connectedCallback() {  
    
      if(this.midienabled==true){
        InitMidi()
      }

      this.buttonSlot = this.shadowRoot.querySelector('#buttonSlot');
      this.sliders = this.shadowRoot.querySelector('#sliders').getElementsByTagName("knob-component")
      this.test = this.getAttribute('name');


      this.buttonSlot.addEventListener("mousedown", this._onclickbuttondown.bind(this), true);
      this.buttonSlot.addEventListener("mouseup", this._onclickbuttonup.bind(this), true);

      // for (var i = 0; i < this.sliders.length; i++) {
        // this.sliders[i].addEventListener("input", function(e){
        //   _this._broadcastevent(176,e.path[0].getAttribute("mid"),e.path[0].value)
        // });

         
        
      // };

     
      var _this=this;


          document.body.addEventListener('webmidievent', function (e) {
              if(_this.midienabled==true){

                 // console.info('webmidievent recieved',e.detail)
                  _this._broadcastevent(e.detail.data1,e.detail.data2,e.detail.data3)

                  switch (e.detail.data1 & 0xf0) {
                  //   case 144:
                  //       //Note On 
                  //       if (e.detail.data2!=0) {  // if velocity != 0, this is a note-on message
                  //         console.log("midi call back button= ",midiassignmentmap.pads[e.detail.data2])
                  //          return;
                  //       }
                  //   case 128:
                  //         //Note off
                  //         console.log("note off = ",e.detail.data2)
                  //         return;

                    case 176:
                          //cc value
                          // console.log("midi knob= ",e.detail.data2)
                          
                          _this.sliders[_this.slidermap[e.detail.data2]].value=e.detail.data3;
                          return;
                  }

              }
          }, false);


      setTimeout(function(){
        _this._updateshaddowdom()
      },100);  


      document.addEventListener('knobuievent', function (ev) { 
          // console.log("knobuievent",ev.detail) 
          _this._broadcastevent(ev.detail.data1,ev.detail.data2,ev.detail.data3)
      }, false);
     
  }


  _updateshaddowdom(){

     

      this.buttonSlot.innerHTML=""

          
      for (var i = 1; i < 61; i++) {      
              var contactbut = document.createElement('button');
              var label = document.createElement('label');

              if(i<11){
                  contactbut.className = "but thin"     
                     
                  if(i==1 || i==10){
                    contactbut.className = "but thin firstlast" 
                  }
              }
              else{
                if(i % 10===1){
                    contactbut.className = "but round"   
                    
                }
                else if(i % 10===0){
                    contactbut.className = "but round"   
                    
                }
                else{
                    contactbut.className = "but"
                }
              }

              if(this.buttonmap[i][2]!=undefined){
                contactbut.className = contactbut.className+" "+ this.buttonmap[i][1]
              }
           
              contactbut.id = "but"+i;
              if(this.buttonmap[i][2]!=undefined){
                label.innerHTML = this.buttonmap[i][2]
              }
              else{
                //show numbers
                // label.innerHTML = this.buttonmap[i][0]
              }
              
              label.setAttribute('uid', this.buttonmap[i][0]);

              contactbut.setAttribute('uid', this.buttonmap[i][0]);
              this.buttonSlot.appendChild(contactbut)
              contactbut.appendChild(label)


              //set midilights here
              // if(this.buttonmap[i][1]!=undefined){

              //   var colorcode;
              //   switch(this.buttonmap[i][1]) {
              //       case "red":
              //           colorcode="03";  
              //           break;
              //       case "green":
              //           colorcode="01";  
              //           break;
              //       case "yellow":
              //           colorcode="05"; 
              //           break;
              //       case "redflash":
              //           colorcode="04"; 
              //           break;
              //       case "greenflash":
              //           colorcode="02"; 
              //           break;
              //       case "yellowflash":
              //           colorcode="06"; 
              //           break;
              //       default:
              //           //off
              //           colorcode="00";
              //   }

              //   //overide for round red buts
              //   if(i>72){
              //         if(this.buttonmap[i][1]=="redflash"){
              //             colorcode="02";
              //         }          
              //   }
                
              //   if(this.midienabled==true){
              //     Sendlight("144",this.buttonmap[i][0],colorcode)
              //   }
              // }else{
              //   if(this.midienabled==true){
              //     if(i==1){
              //       console.log("1")
              //       Sendlight("144","56","00")

              //     }
              //     Sendlight("144",this.buttonmap[i][0],"00")
              //   }
              // }

      }

      // this.buttonSlot.addEventListener("mousedown", this._onclickbuttondown.bind(this), true);
      // this.buttonSlot.addEventListener("mouseup", this._onclickbuttonup.bind(this), true);

  }

  _onclickbuttondown(e){
      var userclicked = e.target.getAttribute("uid")
      // console.info("Clicked down > ", e.target.getAttribute("uid"))
      this._broadcastevent(144,userclicked,127)
  }
  _onclickbuttonup(e){
      var userclicked = e.target.getAttribute("uid")
      // console.info("Clicked up> ",userclicked)
      this._broadcastevent(128,userclicked,127)
  }


  resetlights(){
      // reset midi lights
      // for (var i = 1; i < 82; i++) {
      //   if(this.midienabled==true){
      //     Sendlight("144",this.buttonmap[i][0],"00"); 
      //   } 
      // }
  }

  loaddefaults(){
      this.buttonmap = this.defaultbuttonmap.slice(0)
      this._updateshaddowdom()
  }


  _broadcastevent(data1,data2,data3){

    var _this=this; 
    
    console.log("broadcast",data1,data2,data3)

    if(parseInt(data1)==176){
      this.circuituievent.detail = {'type':'knob','data1':parseInt(data1), 'data2':parseInt(data2), 'data3':parseInt(data3)};
      document.body.dispatchEvent(this.circuituievent); 
    }

    
    //test for key held
    if(parseInt(data1)==144){

      _this.circuituievent.detail = {'type':'buttondown', 'data1':parseInt(data1), 'data2':parseInt(data2), 'data3':parseInt(data3)};
       document.body.dispatchEvent(_this.circuituievent); 

       //was this cuseing double triggering?
      // this.timeout[parseInt(data2)] = setTimeout(function(){
      
      //     _this.circuituievent.detail = {'type':'buttonheld', 'data1':parseInt(data1), 'data2':parseInt(data2), 'data3':parseInt(data3)};
      //     document.body.dispatchEvent(_this.circuituievent); 

      // }, this.timeoutval);
    }

    if(parseInt(data1)==128){
        // clearTimeout(this.timeout[parseInt(data2)])
       
        _this.circuituievent.detail = {'type':'buttonreleased', 'data1':parseInt(data1), 'data2':parseInt(data2), 'data3':parseInt(data3)};
        document.body.dispatchEvent(_this.circuituievent); 
    };

  }



});