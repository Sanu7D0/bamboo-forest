var Bascket = Bascket || {};

const CANVAS_WIDTH = 400,
  CANVAS_HEIGHT = 600;

Bascket.context = function (canvas, ctx) {
  const Engine = Matter.Engine,
    Render = Matter.Render,
    Runner = Matter.Runner,
    Composites = Matter.Composites,
    MouseConstraint = Matter.MouseConstraint,
    Mouse = Matter.Mouse,
    Composite = Matter.Composite,
    Bodies = Matter.Bodies;

  // create engine
  let engine = Engine.create(),
    world = engine.world;

  // create renderer
  /*let render = Render.create({
    element: document.body,
    engine: engine,
    options: {
      width: CANVAS_WIDTH,
      height: CANVAS_HEIGHT,
      showAngleIndicator: true,
      showCollisions: true,
    },
  });

  Render.run(render);*/
  canvas.width = CANVAS_WIDTH;
  canvas.height = CANVAS_HEIGHT;

  // create runner
  var runner = Runner.create();
  Runner.run(runner, engine);

  // add bodies
  Composite.add(world, [
    // walls
    Bodies.rectangle(CANVAS_WIDTH / 2, CANVAS_HEIGHT, CANVAS_WIDTH, 50, {
      isStatic: true,
    }),
    /*Bodies.rectangle(400, 600, 800, 50, { isStatic: true }),
    Bodies.rectangle(800, 300, 50, 600, { isStatic: true }),
    Bodies.rectangle(0, 300, 50, 600, { isStatic: true }),*/

    // test
    Bodies.rectangle(200, 100, 50, 50, {
      text: "강",
    }),
    Bodies.rectangle(180, 10, 50, 50, {
      text: "의",
    }),
    Bodies.rectangle(100, 10, 50, 50, {
      text: "실",
    }),
    Bodies.rectangle(10, 10, 50, 50, {
      text: "실",
    }),
    Bodies.rectangle(300, 10, 50, 50, {
      text: "실",
    }),
  ]);

  // let scale = 1.0;

  // add mouse control
  /*var mouse = Mouse.create(render.canvas),
    mouseConstraint = MouseConstraint.create(engine, {
      mouse: mouse,
      constraint: {
        stiffness: 0.2,
        render: {
          visible: false,
        },
      },
    });

  Composite.add(world, mouseConstraint);

  // keep the mouse in sync with rendering
  render.mouse = mouse;*/

  // fit the render viewport to the scene
  /*Render.lookAt(render, {
    min: { x: 0, y: 0 },
    max: { x: CANVAS_WIDTH, y: CANVAS_HEIGHT },
  });*/

  function render() {
    let bodies = Composite.allBodies(engine.world);

    window.requestAnimationFrame(render);

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 테스트 윤곽선
    // TEST -----
    ctx.beginPath();
    for (var i = 0; i < bodies.length; i += 1) {
      var vertices = bodies[i].vertices;

      ctx.moveTo(vertices[0].x, vertices[0].y);

      for (var j = 1; j < vertices.length; j += 1) {
        ctx.lineTo(vertices[j].x, vertices[j].y);
      }

      ctx.lineTo(vertices[0].x, vertices[0].y);
    }

    ctx.lineWidth = 1;
    ctx.strokeStyle = "#999";
    ctx.stroke();
    // ----- TEST

    // TODO: width, height 지정하기
    const w = 50,
      h = 50;

    ctx.font = `${w}px BMDOHYEON`;
    ctx.textBaseline = "middle";
    ctx.textAlign = "center";
    ctx.fillStyle = "black";

    for (let i = 0; i < bodies.length; i++) {
      let b = bodies[i];
      let x = b.position.x,
        y = b.position.y;

      ctx.save(); // save ctx properties

      // 회전
      ctx.translate(x, y);
      ctx.rotate(b.angle);

      ctx.fillText(b.text, 0, 5); // y 보정 (baseline이 안 맞는다)

      ctx.restore(); // restore ctx properties

      // TEST -----
      /*ctx.save();
      ctx.fillStyle = "red";
      ctx.beginPath();
      ctx.arc(x, y, 7, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();*/
      // ----- TEST
    }
  }

  function addText(text) {
    let base = 60,
      step = 70;
    for (let i = 0; i < text.length; i++) {
      Composite.add(
        world,
        Bodies.rectangle(base + step * i, 50, 50, 50, {
          name: text.charAt(i),
        })
      );
    }
  }

  // context for Bascket
  return {
    engine: engine,
    runner: runner,
    render: render,
    canvas: render.canvas,
    stop: function () {
      Matter.Render.stop(render);
      Matter.Runner.stop(runner);
    },
    addText: addText,
  };
};

if (typeof module !== "undefined") {
  module.exports = Bascket.context;
}
