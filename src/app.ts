import { Rect, Canvas as fC, StaticCanvas, FabricText } from "fabric";
import * as fabric from "fabric";
import axios from "axios";
import tippy from "tippy.js";
import "tippy.js/dist/tippy.css";
import $ from "jquery";

async function importOnrs(canvas: fC) {
  const onrs = await axios.get("assets/onrs.json");
  onrs.data.forEach((onr: any, index: number) => {
    const o1 = new FabricText(onr.name, {
      fontFamily: "Arial",
      fill: "red",
      fontWeight: "bold",
      textAlign: "center",
      fontSize: 18,
      top: 50 + index * 25,
      selectable: false,
    });
    o1.on("mouseover", (e1) => {
      document.getElementById("toolTip")!.style.visibility = "visible";
      document.getElementById("toolTip")!.style.left = e1.scenePoint.x + "px";
      document.getElementById("toolTip")!.style.top =
        e1.scenePoint.y - 1.3 * o1.getBoundingRect().height + "px";
    });
    o1.on("mouseout", (e) => {
      document.getElementById("toolTip")!.style.visibility = "hidden";
    });
    canvas.add(o1);
  });
}

let scale = 1;
let translateX=0
let translateY=0

  async function importSVGMap(canvas: fC) {
  const o = await fabric.loadSVGFromURL("assets/france.svg");
  var obj = fabric.util.groupSVGElements(o.objects as any);
  scale = Math.floor(window.innerHeight*0.9 /100.0)
  obj.scale(scale);
  const oldX = obj.getX();
  const oldY = obj.getY();
  canvas.centerObject(obj);
  translateX = obj.getX() -oldX;
  translateY = obj.getY()-oldY;

  obj.selectable = false;
  canvas.add(obj);
}

async function importUnivs(canvas: fC) {
  const univs = await axios.get("assets/univs.json");
  univs.data.forEach((univ: any, index: number) => {


  const c = new fabric.Circle({
    radius: 10,
    fill: "#525FFF",
    left: 10,
    top: 10,
    selectable: false,
    centeredScaling: true,
  });
  const c1 = new fabric.Circle({
    radius: 5,
    fill: "#FFFFFF",
    left: 15,
    top: 15,
    selectable: false,
    centeredScaling: true,
  });
  const g = [];
  g.push(c);
  g.push(c1);
  
  const fg = new fabric.Group(g, {
    centeredScaling: true,
    left: (univ.position.left )*scale+ translateX,
    top: (univ.position.top)*scale +translateY,
  });
  fg.selectable = false;

  fg.on("mouseover", (e) => {
    fabric.util.animate({
      startValue: [1, fg.left, fg.top],
      endValue: [1.2, fg.left - 1, fg.top - 1],
      onChange: ([sca, left, top]) => {
        fg.scale(sca);
        fg.top = top;
        fg.left = left;
        canvas.renderAll();
      },
      duration: 1000,
    });

    document.getElementById("toolTip")!.style.visibility = "visible";
    document.getElementById("toolTip")!.style.left = fg.getX() + "px";
    document.getElementById("toolTip")!.style.top =
      fg.getY() -1 * fg.getBoundingRect().height + "px";
  });

  fg.on("mouseout", (e) => {
    document.getElementById("toolTip")!.style.visibility = "hidden";
            fg.scale(1);
        fg.left = fg.left;
        fg.top = fg.top ;
        canvas.renderAll();

  });

  canvas.add(fg);
})
}

async function main() {
    const canvas1 = document.getElementById('c') as HTMLCanvasElement;
  const context = canvas1.getContext('2d');

  // resize the canvas to fill browser window dynamically
  window.addEventListener('resize', resizeCanvas, false);
          
  await resizeCanvas();

 
}
main();

var canvas: fC | undefined;

  async function resizeCanvas() {
    const c1 = document.getElementById('c') as HTMLCanvasElement;
    c1.width = window.innerWidth*0.9;
    c1.height = window.innerHeight*0.9;  
    if (canvas) {
      canvas.dispose();
      canvas.remove();
    }    
      canvas = new fC("c", {
    centeredScaling: true,
    });
    

  const onr = new FabricText("Organismes de recherche");
  onr.fontSize = 24;
  canvas.add(onr);

  canvas.on("mouse:dblclick", (e) => {
    console.error("Double click detected", (e.scenePoint.x- translateX)/scale ,(e.scenePoint.y-translateY)/scale );
  });
  await importSVGMap(canvas);
  await importOnrs(canvas);
  await importUnivs(canvas);
  canvas.renderAll()
  }


// create a rectangle object
