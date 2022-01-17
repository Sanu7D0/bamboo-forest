var Bascket = Bascket || {};

let DEBUG_MODE = false;

const COLORS = ["#220C10", "#506C64", "#75CBB9", "#75B8C8"];

Bascket.context = function (canvas, ctx) {
  const Engine = Matter.Engine,
    Render = Matter.Render,
    Runner = Matter.Runner,
    Composites = Matter.Composites,
    MouseConstraint = Matter.MouseConstraint,
    Mouse = Matter.Mouse,
    Composite = Matter.Composite,
    Bodies = Matter.Bodies,
    Body = Matter.Body,
    Vector = Matter.Vector;

  const timer = (ms) => new Promise((res) => setTimeout(res, ms));

  // create engine
  let engine = Engine.create(),
    world = engine.world;

  // create runner
  let runner = Runner.create();
  Runner.run(runner, engine);

  canvas.width = document.body.clientWidth;
  canvas.height = document.body.clientHeight;

  // walls
  let walls = [];
  // left
  walls.push(
    Bodies.rectangle(0, canvas.height / 2, canvas.height, 10, {
      isStatic: true,
      text: "",
      angle: Math.PI / 2,
      restitution: 1,
      friction: 0,
      frictionStatic: 0,
    })
  );
  // top
  walls.push(
    Bodies.rectangle(canvas.width / 2, 0, canvas.width, 10, {
      isStatic: true,
      text: "",
      restitution: 1,
      friction: 0,
      frictionStatic: 0,
    })
  );
  // right
  walls.push(
    Bodies.rectangle(canvas.width, canvas.height / 2, canvas.height, 10, {
      isStatic: true,
      text: "",
      angle: Math.PI / 2,
      restitution: 1,
      friction: 0,
      frictionStatic: 0,
    })
  );
  // bottom
  walls.push(
    Bodies.rectangle(canvas.width / 2, canvas.height, canvas.width, 10, {
      isStatic: true,
      text: "",
      restitution: 1,
      friction: 0,
      frictionStatic: 0,
    })
  );

  Composite.add(world, walls);

  // 중력 0
  engine.gravity.y = 0;

  // Test

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
    // update canvas width, height
    /*const xScale = document.body.clientWidth / canvas.width,
      yScale = document.body.clientHeight / canvas.height;*/
    canvas.width = document.body.clientWidth;
    canvas.height = document.body.clientHeight;

    // console.log(xScale, yScale);
    // update wall width, height
    /*walls.forEach((wall) => {
      Body.scale(wall, xScale, yScale);
    });*/

    let bodies = Composite.allBodies(engine.world);

    window.requestAnimationFrame(render);

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    var img = new Image();
    img.src = "bamboo.svg";    
    ctx.drawImage(img, 500, 250, 700, 700);

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

      ctx.font = `${30 * b.scale}px BMDOHYEON`;
      ctx.fillStyle = b.color;
      ctx.fillText(b.text, 0, 3 * b.scale); // y 보정 (baseline이 안 맞는다)

      ctx.restore(); // restore ctx properties
    }
  }

  async function addText(obj, scale) {
    let _id = obj.id,
      text = obj.text;

    const vector = getRandomVector();
    const color = COLORS[getRandomIntInclusive(0, COLORS.length)];
    const textArray = text.split("");

    // 왼쪽에서 오면 글자 순서 반대로
    if (vector.from.x < canvas.width / 2) {
      textArray.reverse();
    }

    for (let i = 0; i < text.length; i++) {
      let waitTime = 50 * scale;
      let char = textArray[i];

      if (char === " " || char === "") {
        // space, null 이면 더 오래 기다리기
        waitTime = 100;
        continue;
      } else {
        const mass = 1 * scale;
        const radius = 17 * scale;
        const f = vector.from,
          t = vector.to;
        const angle = Math.atan((t.y - f.y) / (t.x - f.x));
        const speed = 7;

        // TODO: 바운더리 안에서 소환하기

        let b = Bodies.circle(f.x, f.y, radius, {
          id: _id,
          frictionAir: 0,
          friction: 0,
          restitution: 1,
          mass: mass,
          inverseMass: 1 / mass,
          angle: angle,
          inertia: Infinity,
          inverseInertia: 0,
          text: char,
          scale: scale,
          color: color,
        });

        Body.setVelocity(
          b,
          Vector.mult(
            Vector.normalise(Vector.create(t.x - f.x, t.y - f.y)),
            speed
          )
        );

        Composite.add(world, b);
      }

      await timer(100);
    }
  }

  function deleteText(_id) {
    let bodies = world.bodies;

    // pop 하면 index 줄어들기 때문에 뒤에서 부터 순회
    for (let i = bodies.length - 1; i >= 0; i--) {
      if (bodies[i].id === _id) {
        bodies.splice(i, 1);
      }
    }
  }

  function getRandomVector() {
    // from = 캔버스 경계 위 임의의 점
    // to = 중앙에서 특정 반지름을 가진 원 안 임의의 점

    let f = [0, 0];
    const randomLength = getRandom(0, 2 * canvas.width + 2 * canvas.height);
    if (0 <= randomLength && randomLength < canvas.width) {
      f[0] = randomLength;
    } else if (
      canvas.width <= randomLength &&
      randomLength < canvas.width + canvas.height
    ) {
      f[0] = canvas.width;
      f[1] = randomLength - canvas.width;
    } else if (
      canvas.width + canvas.height <= randomLength &&
      randomLength < 2 * canvas.width + canvas.height
    ) {
      f[0] = canvas.width - (randomLength - (canvas.width + canvas.height));
      f[1] = canvas.height;
    } else {
      f[1] =
        canvas.height - (randomLength - (2 * canvas.width + canvas.height));
    }

    let t = [0, 0];
    const maxRadius = Math.min(canvas.width, canvas.height) / 3;
    const radius = getRandom(0, maxRadius);
    t[0] = canvas.width / 2 + radius * Math.sin(getRandom(0, 2 * Math.PI));
    t[1] = canvas.height / 2 + radius * Math.cos(getRandom(0, 2 * Math.PI));

    return {
      from: {
        x: f[0],
        y: f[1],
      },
      to: {
        x: t[0],
        y: t[1],
      },
    };
  }

  function getRandom(min, max) {
    return Math.random() * (max - min) + min;
  }

  function getRandomIntInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min; //최댓값도 포함, 최솟값도 포함
  }

  function setDebugMode(bool) {
    DEBUG_MODE = bool;
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
    deleteText: deleteText,
    setDebugMode: setDebugMode,
  };
};

if (typeof module !== "undefined") {
  module.exports = Bascket.context;
}
