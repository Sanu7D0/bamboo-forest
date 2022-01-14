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

const WIDTH = 400,
  HEIGHT = 600;

export default class TextHole {
  constructor() {
    this.objects = [];
    this.objectsInfo = [];

    this.engine = Engine.create();

    this.ground = Bodies.rectangle(WIDTH / 2, HEIGHT, WIDTH, 100, {
      isStatic: true,
    });
  }

  get objectsJsonArray() {
    return JSON.stringify(this.objectsInfo);
  }

  updateObjectsInfo() {
    for (let i = 0; i < this.objects.length; i++) {
      this.objectsInfo[i].text = this.objects[i].text;
      this.objectsInfo[i].x = this.objects[i].position.x;
      this.objectsInfo[i].y = this.objects[i].position.y;
      this.objectsInfo[i].angle = this.objects[i].angle;
    }
  }

  createTextObject(_text, x, y) {
    // TODO: width, height 지정
    let textObject = Bodies.rectangle(x, y, 40, 40);
    textObject.text = _text;
    this.objects.push(textObject);
    this.objectsInfo.push({
      text: textObject.text,
      x: textObject.position.x,
      y: textObject.position.y,
      angle: textObject.angle,
    });
  }

  runPhysics(duration) {
    console.log("Physics run started");

    // add all of the bodies to the world
    Composite.add(this.engine.world, [...this.objects, this.ground]);

    let startTime = Date.now();

    // run the engine
    let interval = setInterval(() => {
      if (Date.now() - startTime > duration) {
        clearInterval(interval);
        console.log("Physics run ended");
      }

      Engine.update(this.engine, 1000 / 60);

      // update and emit info
      this.updateObjectsInfo();
      emitObjectsInfo(this.objectsJsonArray);
    }, 1000 / 60);
  }
}
