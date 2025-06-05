customElements.define('knob-component', class extends HTMLElement {

  constructor() {
    super(); 


    // Create shadow DOM for the component.
    let shadowRoot = this.attachShadow({mode: 'open'});

    this.knobvalue=this.getAttribute("value")|| 100;
    this.knobtitle=this.getAttribute("title")|| "Knob";
    this.knobmin=this.getAttribute("min")|| 0;
    this.knobmax=this.getAttribute("max")|| 128;
    this.knobstep=this.getAttribute("step")|| 1;
    this.knobid=this.getAttribute("id")|| 1;


    this.offset;
    this.offsetangle=this.getAttribute("offsetangle")|| 0;
    this.knobuievent = new Event('knobuievent');


    shadowRoot.innerHTML = `
    <style>
        :host {
          width: 52px;
          height:52px;
          display: block;
        }
        #knob{
          position:relative;
          width:100%;
          height:100%;
          background:#999;
          border-radius:50%;
          cursor:n-resize;
        }
        #knob::after{
          position:absolute;
          left:50%;
          content:"|";
          font-weight:bolder;
          color:#505050;
        }        


    </style>
      
        <div id="knob" class="knobclass" draggable="true" title="Knob"></div>
        
    `;

    this.knob = this.shadowRoot.querySelector('#knob');
    this.starty;
    this.startval;
  }
  

  connectedCallback() { 
    var _this=this;

    this.knob.title=this.knobtitle

    this.knob.addEventListener("drag", this._dragging.bind(this), true);

    this.knob.addEventListener("dragstart", function(e){
      //next bit to hide the knob image whne dragging
      var crt = this.cloneNode(true);
      crt.style.display = "none"; 
      e.dataTransfer.setDragImage(crt, 0, 0);
      _this.starty=e.clientY;
      _this.startval=_this.knobvalue;

    }, true);



    this.knob.addEventListener("touchmove", this._touchdragging.bind(this), false);

    this.knob.addEventListener("touchstart", function(e){
      _this.starty=e.touches[0].clientY;
      _this.startval=_this.knobvalue;
    }, false);


    this.knob.addEventListener("wheel", function(e){

      console.log("wheel",e.deltaY)

          var valtoset = _this.knobvalue;

          if(e.deltaY>0){
             valtoset-=5;
          }else{
             valtoset-=-5;
          }

          if(valtoset<_this.knobmin){
              valtoset=_this.knobmin;
          }
          if(valtoset>_this.knobmax){
              valtoset=_this.knobmax;
          }
          _this.value = valtoset;

    },{
      capture: true,
      passive: true
    });



  }

  static get observedAttributes() {
    return ['id','value','min','max'];
  }

 
  _adjustknobangle(val){
      var angle = ((360/this.knobmax)*val)-this.offsetangle+"deg";
      this.knob.style.transform = "rotate("+angle+")";
  }


  attributeChangedCallback(name, oldValue, newValue) {
    // console.log("attributeChangedCallback",name, oldValue, newValue)
    
    if(name=="value"){
      this.knobvalue=newValue;
      this._adjustknobangle(newValue)
      
      this.knobuievent.detail = {'id':this.getAttribute("id"),'data1':176, 'data2':this.getAttribute("mid"), 'data3':newValue};
      document.dispatchEvent(this.knobuievent); 
    }
    if(name=="max"){
      this.knobmax=newValue;
    }
    if(name=="min"){
      this.knobmin=newValue;
    }
    if(name=="step"){
      this.knobstep=newValue;
    }
  }  
 


  _dragging(e){
    this.style.cursor = "pointer";
    if(e.screenY!=0){  

        this.offset=parseInt(this.starty)-(e.y)
        this.offset=this.offset+parseInt(this.startval)+(this.knob.style.height/2);
        console.log("this.startval",this.startval)

        if(this.offset>=this.knobmin && this.offset<this.knobmax){
           this.value=this.offset;        
        }
     }
  }

  _touchdragging(e){
    this.style.cursor = "pointer";
    if(e.touches[0].screenY!=0){  

        this.offset=parseInt(this.starty)-(e.touches[0].clientY)
        this.offset=this.offset+parseInt(this.startval)+(this.knob.style.height/2);

        if(this.offset>this.knobmin && this.offset<this.knobmax){
          this.value=this.offset;
        }
     }
  }


  set value(val){
      this.setAttribute('value', val);
  } 

  get value(){
    return this.knobvalue;
  }


  
});