var Bascket = Bascket || {};

const DEBUG_MODE = false;

const CANVAS_WIDTH = 1200,
  CANVAS_HEIGHT = 800;

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

  // create runner
  let runner = Runner.create();
  Runner.run(runner, engine);

  canvas.width = CANVAS_WIDTH;
  canvas.height = CANVAS_HEIGHT;

  const charWidth = 35,
    charHeight = 35;

  Composite.add(world, [
    // walls
    Bodies.rectangle(CANVAS_WIDTH / 2, CANVAS_HEIGHT, CANVAS_WIDTH, 50, {
      isStatic: true,
      text: "",
    }),
    Bodies.rectangle(CANVAS_WIDTH, CANVAS_HEIGHT - 200, 500, 50, {
      isStatic: true,
      text: "",
      angle: -Math.PI / 3,
    }),
    Bodies.rectangle(0, CANVAS_HEIGHT - 200, 500, 50, {
      isStatic: true,
      text: "",
      angle: Math.PI / 3,
    }),
  ]);

  // addText("치타는 웃으면서 달리지만 배가 고프다 그래서 달린다 지구 끝까지");

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

  function render() {
    let bodies = Composite.allBodies(engine.world);

    window.requestAnimationFrame(render);

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // DEBUG - 윤곽선
    if (DEBUG_MODE) {
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
    }

    ctx.font = `${charWidth}px BMDOHYEON`;
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

      ctx.fillText(b.text, 0, 3); // y 보정 (baseline이 안 맞는다)

      ctx.restore(); // restore ctx properties
    }
  }

  function addText(text, randomGap = false) {
    let xBase = 0,
      yBase = 50,
      gap = 15;
    for (let i = 0; i < text.length; i++) {
      if (text.charAt(i) === " " || text.charAt(i) === "") {
        // space, null 이면 스킵
        xBase += gap * 1.5;
        continue;
      } else {
        xBase += gap * (randomGap ? getRandom(0.5, 1.5) : 1) + charWidth;
      }

      // 캔버스 가로 넘어가면 다음 줄
      if (xBase + charWidth >= CANVAS_WIDTH) {
        xBase = gap * (randomGap ? getRandom(0.5, 1.5) : 1) + charWidth;
        yBase += gap + charHeight;
      }

      let bodyWidth;
      // 알파벳 체크
      if (text.toUpperCase() != text.toLowerCase()) {
        bodyWidth = charWidth - 10;
      } else {
        bodyWidth = charWidth;
      }

      Composite.add(
        world,
        // 폰트에 따라 박스 width, height 보정
        Bodies.rectangle(
          xBase,
          yBase + getRandom(-5, 5),
          bodyWidth - 3,
          charHeight - 3,
          {
            text: text.charAt(i),
            angle: getRandom(-Math.PI / 2, Math.PI / 2),
          }
        )
      );
    }
  }

  function getRandom(min, max) {
    return Math.random() * (max - min) + min;
  }

  // context for Bascket
  return {
    engine: engine,
    runner: runner,
    render: render,
    canvas: render.canvas,
    stop: function () {
      // Matter.Render.stop(render);
      Matter.Runner.stop(runner);
    },
    addText: addText,
  };
};

if (typeof module !== "undefined") {
  module.exports = Bascket.context;
}
