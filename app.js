document.querySelector('div').style.display = 'none';

const { Engine, Render, Runner, World, Bodies } = Matter;

const cells = 3;
const width = 600;
const height = 600;

const engine = Engine.create();
const { world } = engine;
const render = Render.create({
    element: document.body,
    engine: engine,
    options: {
        wireframes: true,
        width,
        height
    }
});
Render.run(render);
Runner.run(Runner.create(), engine);

// Walls/Borders
const walls = [
    // top
    Bodies.rectangle(width / 2, 0, width, 20, { isStatic: true,  }),
    // right
    Bodies.rectangle(width, height / 2, 20, height, { isStatic: true }),
    // bottom
    Bodies.rectangle(width / 2, height, width, 20, { isStatic: true }),
    // left
    Bodies.rectangle(0, height / 2, 20, height, { isStatic: true })
];
World.add(world, walls);

// Maze!

// Maze grid 3x3
const grid = Array(cells).fill(null).map(() => Array(cells).fill(false)); 
const verticals = Array(cells).fill(null).map(() => Array(cells -1).fill(false));
const horizontals = Array(cells -1).fill(null).map(() => Array(cells).fill(false));

const startRow = Math.floor(Math.random() * cells);
const startColumn = Math.floor(Math.random() * cells);
console.log(startRow, startColumn);