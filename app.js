document.querySelector('div').style.display = 'none';

const { Engine, Render, Runner, World, Bodies, MouseConstraint, Mouse } = Matter;

const width = 800;
const height = 600;

const engine = Engine.create();
const { world } = engine;
const render = Render.create({
    element: document.body,
    engine: engine,
    options: {
        wireframes: false,
        width,
        height
    }
});

Render.run(render);
Runner.run(Runner.create(), engine);
World.add(world, MouseConstraint.create(engine, {
    mouse: Mouse.create(render.canvas)
}));

// Walls/Borders
const walls = [
    Bodies.rectangle(width / 2, 0, width, 20, { isStatic: true }),
    Bodies.rectangle(width, height / 2, 20, height, { isStatic: true }),
    Bodies.rectangle(width / 2, height, width, 20, { isStatic: true }),
    Bodies.rectangle(0, height / 2, 20, height, { isStatic: true })
];
World.add(world, walls);

// Random Shapes 
for (let i = 0; i < 50; i++) {
    let w = Math.random() * (60 - 30 + 1) + 30;
    let h = Math.random() * (60 - 30 + 1) + 30;
    let random = Math.random();
    if (random >= .5) {
        World.add(world, Bodies.rectangle(Math.random() * width, Math.random() * height, w, h));
    } else {
        World.add(world, Bodies.circle(Math.random() * width, Math.random() * height, (h+w)/2, {
            render: {
                fillStyle: 'lightgreen'
            }
        }));
    }
}