const { Engine, Render, Runner, Bodies, Composite } = require("matter-js");
const {
  Worker,
  isMainThread,
  parentPort,
  workerData,
} = require("worker_threads");

class TextHole {
  constructor() {
    this.objects = [];
    this.objectsInfo = {};

    this.engine = Engine.create();
    /*this.renderer = Render.create({
      element: document.body,
      engine: this.engine,
    });*/

    this.ground = Bodies.rectangle(400, 610, 810, 100, { isStatic: true });

    this.test();
  }

  createTextObject(_text, x, y) {
    // TODO: width, height 지정
    let textObject = Bodies.rectangle(x, y, 80, 80);
    textObject.text = _text;
    this.objects.push(textObject);
  }

  test() {
    this.createTextObject("A", 400, 200);
    this.createTextObject("B", 450, 50);

    // add all of the bodies to the world
    Composite.add(this.engine.world, [...this.objects, this.ground]);
    // console.log([...this.objects, this.ground]);

    // run the renderer
    // Render.run(render);

    // run the engine
    setInterval(() => {
      Engine.update(this.engine, 1000 / 30);
      console.log(this.objects[0].position, this.objects[0].angle);

      // TODO: add emit
    }, 1000 / 30);
  }

  sleep(ms) {
    const wakeUpTime = Date.now() + ms;
    while (Date.now() < wakeUpTime) {}
  }
}

module.exports = TextHole;
