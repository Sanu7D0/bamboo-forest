import pkg from "matter-js";
const { Engine, Render, Runner, Bodies, Composite } = pkg;
import { emitObjectsInfo } from "../server.js";

/*const { Engine, Render, Runner, Bodies, Composite } = require("matter-js");
const {
  Worker,
  isMainThread,
  parentPort,
  workerData,
} = require("worker_threads");*/

export default class TextHole {
  constructor() {
    this.objects = [];
    this.objectsInfo = [];

    this.engine = Engine.create();

    this.ground = Bodies.rectangle(400, 610, 810, 100, { isStatic: true });
  }

  get objectsJsonArray() {
    return JSON.stringify(this.objectsInfo);
  }

  updateObjectsInfo() {
    for (let o in this.objects) {
      this.objectsInfo.text = o.text;
      this.objectsInfo.x = o.x;
      this.objectsInfo.y = o.y;
      this.objectsInfo.angle = o.angle;
    }
  }

  createTextObject(_text, x, y) {
    // TODO: width, height 지정
    let textObject = Bodies.rectangle(x, y, 80, 80);
    textObject.text = _text;
    this.objects.push(textObject);
    this.objectsInfo.push({
      text: textObject.text,
      x: textObject.position.x,
      y: textObject.position.y,
      angle: textObject.angle,
    });
  }

  test() {
    this.createTextObject("A", 400, 200);
    this.createTextObject("B", 450, 50);

    // add all of the bodies to the world
    Composite.add(this.engine.world, [...this.objects, this.ground]);

    // run the engine
    setInterval(() => {
      Engine.update(this.engine, 1000 / 30);
      console.log(this.objects[0].position, this.objects[0].angle);

      // update and emit info
      this.updateObjectsInfo();
      emitObjectsInfo(this.objectsJsonArray);
    }, 1000 / 30);
  }
}
