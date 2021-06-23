import { AfterContentInit, AfterViewInit, Component, Input, NgZone, OnDestroy, OnInit } from '@angular/core';
import { fabric } from 'fabric';




@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  title = 'fabrik-booking-workspace';
  // image: any;
  // file:File = null;
  // canvas:any;

  isAdminMode = true;
  number = 0;

   backgroundColor = '#f8f8f8';
 lineStroke = '#ebebeb';
 tableFill = 'rgba(150, 111, 51, 0.7)';
 tableStroke = '#694d23';
 tableShadow = 'rgba(0, 0, 0, 0.4) 3px 3px 7px';
 chairFill = 'rgba(67, 42, 4, 0.7)';
 chairStroke = '#32230b';
 chairShadow = 'rgba(0, 0, 0, 0.4) 3px 3px 7px';
 barFill = 'rgba(0, 93, 127, 0.7)';
 barStroke = '#003e54';
 barShadow = 'rgba(0, 0, 0, 0.4) 3px 3px 7px';
 barText = 'Bar';
 wallFill = 'rgba(136, 136, 136, 0.7)';
 wallStroke = '#686868';
 wallShadow = 'rgba(0, 0, 0, 0.4) 5px 5px 20px';


  private canvas: any;
  private props: any = {
    canvasFill: '#ffffff',
    canvasImage: '',
    id: null,
    opacity: null,
    fill: null,
    fontSize: null,
    lineHeight: null,
    charSpacing: null,
    fontWeight: null,
    fontStyle: null,
    textAlign: null,
    fontFamily: null,
    TextDecoration: ''
  };

  private textString: string;
  private url: string = '';
  private size: any = {
    width: 1500,
    height: 800
  };

  private json: any;
  private globalEditor: boolean = false;
  private textEditor: boolean = false;
  private imageEditor: boolean = false;
  private figureEditor: boolean = false;
  private selected: any;

  constructor() {}

  ngOnInit() {

    let imgUrl = '../assets/images/workspace.png';
    let img = new Image(); 

    img.src = imgUrl;
    let self = this;
    img.onload = function (event) {
          let  loadedImage = event.currentTarget;
          loadedImage['naturalHeight'];
          console.log(loadedImage['naturalHeight']);
          console.log(loadedImage['naturalWidth']);
          self.size.width = loadedImage['naturalWidth'];
          self.size.height = loadedImage['naturalHeight'];
    } 


    this.canvas = new fabric.Canvas('canvas', {
      backgroundImage: '../assets/images/workspace.png',
      hoverCursor: 'pointer',
      selection: true,
      selectionBorderColor: 'blue'
    });

     this.canvas.setWidth(2587);
     this.canvas.setHeight(1438);

    this.canvas.on({
      'mouse:up': (e)=>{
        this.myfunction(e)
      }
    })

    this.canvas.on('mouse:wheel', function(opt) {
      console.log("EVT ok")
      var delta = opt.e.deltaY;
  var zoom = this.canvas.getZoom();
  zoom *= 0.999 ** delta;
  if (zoom > 20) zoom = 20;
  if (zoom < 0.01) zoom = 0.01;
  this.canvas.zoomToPoint({ x: opt.e.offsetX, y: opt.e.offsetY }, zoom);
  opt.e.preventDefault();
  opt.e.stopPropagation();
    })

    
  }

  resizeCanvas() {
    this.canvas.setHeight(1000);
    this.canvas.setWidth(1000);
    this.canvas.renderAll();
  }

   myfunction(e){
    console.log(e);
   }

  addFigure(figure) {
    let add: any;
    switch (figure) {
      case 'rectangle':
        this.addRect(0, 0, 60, 60);
        break;
      case 'square':
       this.addChair(0, 0);
        break;
      case 'triangle':
        add = new fabric.Triangle({
          width: 100, height: 100, left: 10, top: 10, fill: '#2196f3'
        });
        break;
      case 'circle':
        this.addHalfCircle();
         break;
    }
    this.extend(add, this.randomId());
    this.canvas.add(add);
    this.selectItemAfterAdded(add);
  }

  extend(obj, id) {
    obj.toObject = (function (toObject) {
      return function () {
        return fabric.util.object.extend(toObject.call(this), {
          id: id
        });
      };
    })(obj.toObject);
  }

  randomId() {
    return Math.floor(Math.random() * 999999) + 1;
  }

  selectItemAfterAdded(obj) {
   // this.canvas.deactivateAll();
    this.canvas.renderAll();
    this.canvas.setActiveObject(obj);

    console.log(this.canvas);
  }

  customerMode(){
    this.isAdminMode=false;
    this.canvas.getObjects().map(o => {
      o.hasControls = false;
      o.lockMovementX = true;
      o.lockMovementY = true;
      if (o.type === 'chair' || o.type === 'bar' || o.type === 'wall') {
        o.selectable = false
      }
       
      
      o.borderColor = '#38A62E';
      o.borderScaleFactor = 2.5;
    });
    this.canvas.selection = false;
    this.canvas.hoverCursor = 'pointer';
    this.canvas.discardActiveObject();
    this.canvas.renderAll();
  }

  adminMode(){
    this.isAdminMode=true;
    this.canvas.getObjects().map(o => {
      o.hasControls = true;
    o.lockMovementX = false;
    o.lockMovementY = false;
    if (o.type === 'chair' || o.type === 'bar' || o.type === 'wall') {
      o.selectable = true;
    }
      
      o.borderColor = 'rgba(102, 153, 255, 0.75)';
      o.borderScaleFactor = 1;
    });
    this.canvas.selection = true
    this.canvas.hoverCursor = 'move'
    this.canvas.discardActiveObject()
    this.canvas.renderAll()
  }

  addHalfCircle(){
    const id = JSON.stringify(this.generateId());
    const o = new fabric.Circle({
      fill: '#ff5722',
      radius: 20,
      left: 60,
      top: 10,
      angle: 90,
      startAngle: 0,
      endAngle: Math.PI,
      stroke: '#000',
      strokeWidth: 3,
    })
    o["id"]=id;
    this.canvas.add(o)
    return o
  }

  addChair(left, top, width?:number, height?:number) {
    const id = JSON.stringify(this.generateId())
    const o = new fabric.Rect({
      left: left,
      top: top,
      width: 30,
      height: 30,
      fill: this.chairFill,
      stroke: this.chairStroke,
      strokeWidth: 2,
      shadow: this.chairShadow,
      originX: 'left',
      originY: 'top',
      centeredRotation: true,
      snapAngle: 45,
      selectable: true,
      type: 'chair'
    })
    o["id"]=id;
    this.canvas.add(o)
    return o
  }

  addBar(left, top, width, height) {
    const id = JSON.stringify(this.generateId())
    const o = new fabric.Rect({
      width: width,
      height: height,
      fill: this.barFill,
      stroke: this.barStroke,
      strokeWidth: 2,
      shadow: this.barShadow,
      originX: 'center',
      originY: 'center',
      type: 'bar'
    })
    o["id"]=id;
    const t = new fabric.IText("Bar", {
      fontFamily: 'Calibri',
      fontSize: 14,
      fill: '#fff',
      textAlign: 'center',
      originX: 'center',
      originY: 'center'
    })
    const g = new fabric.Group([o, t], {
      left: left,
      top: top,
      centeredRotation: true,
      snapAngle: 45,
      selectable: true,
      type: 'bar'
    })
    this.canvas.add(g)
    return g
  }

  addWall(left, top, width, height) {
    const id = JSON.stringify(this.generateId())
    const o = new fabric.Rect({
      left: left,
      top: top,
      width: width,
      height: height,
      fill: this.wallFill,
      stroke: this.wallStroke,
      strokeWidth: 2,
      shadow: this.wallShadow,
      originX: 'left',
      originY: 'top',
      centeredRotation: true,
      snapAngle: 45,
      selectable: true,
      type: 'wall'
    })
    o["id"]=id;
    this.canvas.add(o)
    return o
  }

  addRect(left, top, width, height) {
    const id = this.generateId()
    const o = new fabric.Rect({
      width: width,
      height: height,
      fill: this.tableFill,
      stroke: this.tableStroke,
      strokeWidth: 2,
      shadow: this.tableShadow,
      originX: 'center',
      originY: 'center',
      centeredRotation: true,
      snapAngle: 45,
      selectable: true
    })
    o["id"]=id;
    const t = new fabric.IText(this.number.toString(), {
      fontFamily: 'Calibri',
      fontSize: 14,
      fill: '#fff',
      textAlign: 'center',
      originX: 'center',
      originY: 'center'
    })
    const g = new fabric.Group([o, t], {
      left: left,
      top: top,
      centeredRotation: true,
      snapAngle: 45,
      selectable: true,
      type: 'table'
    })
    g["id"]=id;
    this.canvas.add(g)
    this.number++
    return g
  }

  generateId() {
    return Math.random().toString(36).substr(2, 8)
  }

  remove(){
    const o = this.canvas.getActiveObject()
    if (o) {
      o.remove()
      this.canvas.remove(o)
      this.canvas.discardActiveObject()
      this.canvas.renderAll()
    }
    //var objects = this.canvas.getObjects();
  // for(var i = 0; i < objects.length; i++){
  // //console.log(objects[i]);     
  //   this.canvas.remove(objects[i]);
  //   }this.canvas.renderAll();
  }

  book(){
    const o = this.canvas.getActiveObject();
    console.log(o);
  }


  addDefaultObjects() {
    this.addChair(15, 105);
    this.addChair(15, 135)
    this.addChair(75, 105)
    this.addChair(75, 135)
    this.addChair(225, 75)
    this.addChair(255, 75)
    this.addChair(225, 135)
    this.addChair(255, 135)
    this.addChair(225, 195)
    this.addChair(255, 195)
    this.addChair(225, 255)
    this.addChair(255, 255)
    this.addChair(15, 195)
    this.addChair(45, 195)
    this.addChair(15, 255)
    this.addChair(45, 255)
    this.addChair(15, 315)
    this.addChair(45, 315)
    this.addChair(15, 375)
    this.addChair(45, 375)
    this.addChair(225, 315)
    this.addChair(255, 315)
    this.addChair(225, 375)
    this.addChair(255, 375)
    this.addChair(15, 435)
    this.addChair(15, 495)
    this.addChair(15, 555)
    this.addChair(15, 615)
    this.addChair(225, 615)
    this.addChair(255, 615)
    this.addChair(195, 495)
    this.addChair(195, 525)
    this.addChair(255, 495)
    this.addChair(255, 525)
    this.addChair(225, 675)
    this.addChair(255, 675)
  
    this.addRect(30, 90, 60, 90)
    this.addRect(210, 90, 90, 60)
    this.addRect(210, 210, 90, 60)
    this.addRect(0, 210, 90, 60)
    this.addRect(0, 330, 90, 60)
    this.addRect(210, 330, 90, 60)
    this.addRect(0, 450, 60, 60)
    this.addRect(0, 570, 60, 60)
    this.addRect(210, 480, 60, 90)
    this.addRect(210, 630, 90, 60)
  
    this.addBar(120, 0, 180, 60)
  
    this.addWall(120, 510, 60, 60)
  }


  


}



