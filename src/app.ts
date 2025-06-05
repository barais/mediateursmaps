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
      document.getElementById("toolTip")!.style.left = o1.getX() + "px";
      document.getElementById("toolTip")!.style.top =
        o1.getY() - 2 * o1.getBoundingRect().height + "px";
    });
    o1.on("mouseout", (e) => {
      document.getElementById("toolTip")!.style.visibility = "hidden";
    });
    canvas.add(o1);
  });
}

async function importSVGMap(canvas: fC) {
  const o = await fabric.loadSVGFromURL("assets/france.svg");
  var obj = fabric.util.groupSVGElements(o.objects as any);
  obj.scale(5);
  canvas.centerObject(obj);
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
    left: univ.position.left,
    top: univ.position.top,
  });
  fg.selectable = false;

  fg.on("mouseover", (e) => {
    fabric.util.animate({
      startValue: [1, fg.left, fg.top],
      endValue: [1.2, fg.left - 1, fg.top - 1],
      onChange: ([scale, left, top]) => {
        fg.scale(scale);
        fg.top = top;
        fg.left = left;
        canvas.renderAll();
      },
      duration: 200,
    });

    document.getElementById("toolTip")!.style.visibility = "visible";
    document.getElementById("toolTip")!.style.left = fg.getX() + "px";
    document.getElementById("toolTip")!.style.top =
      fg.getY() - 2 * fg.getBoundingRect().height + "px";
  });

  fg.on("mouseout", (e) => {
    document.getElementById("toolTip")!.style.visibility = "hidden";
  });

  canvas.add(fg);
})
}

async function main() {
  var canvas = new fC("c", {
    centeredScaling: true,
  });

  const onr = new FabricText("Organismes de recherche");
  onr.fontSize = 24;
  canvas.add(onr);

  canvas.on("mouse:dblclick", (e) => {
    console.error("Double click detected", e.scenePoint);
  });
  await importSVGMap(canvas);
  await importOnrs(canvas);
  await importUnivs(canvas);
}

main();

// create a rectangle object
