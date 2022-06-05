document.querySelector('div').style.display = 'none';

const { Engine, Render, Runner, World, Bodies, Body, Events } = Matter;

const cellsHorizontal = 10;
const cellsVertical = 8;
const width = window.innerWidth;
const height = window.innerHeight;
const unitLengthX = width / cellsHorizontal;
const unitLengthY = height / cellsVertical;

const engine = Engine.create();
engine.world.gravity.y = 0;
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
const borders = [
    // top
    Bodies.rectangle(width / 2, 0, width, 2, { label: 'border', isStatic: true, }),
    // right
    Bodies.rectangle(width, height / 2, 2, height, { label: 'border', isStatic: true }),
    // bottom
    Bodies.rectangle(width / 2, height, width, 2, { label: 'border', isStatic: true }),
    // left
    Bodies.rectangle(0, height / 2, 2, height, { label: 'border', isStatic: true })
];
World.add(world, borders);

// Maze!

// Maze grid 3x3
const grid = Array(cellsVertical).fill(null).map(() => Array(cellsHorizontal).fill(false));
const verticals = Array(cellsVertical).fill(null).map(() => Array(cellsHorizontal - 1).fill(false));
const horizontals = Array(cellsVertical - 1).fill(null).map(() => Array(cellsHorizontal).fill(false));

const startRow = Math.floor(Math.random() * cellsVertical);
const startColumn = Math.floor(Math.random() * cellsHorizontal);

const stepRecursive = (row, column) => {
    // if the cell at [row, column] is visited, then return 
    if (grid[row][column]) {
        return;
    }

    // mark this sell as 'visited' 
    grid[row][column] = true;

    // assemble randomly-ordered list of neighbours 
    const neighbours = shuffleArray([
        [row - 1, column, 'up'],
        [row, column + 1, 'right'],
        [row + 1, column, 'down'],
        [row, column - 1, 'left']
    ]);

    // iterate through the neighbours 
    for (let neighbour of neighbours) {
        const [nextRow, nextColumn, direction ] = neighbour;

        // check if a neighbour is out of bounds 
        if (nextRow < 0 || nextRow >= cellsVertical || nextColumn < 0 || nextColumn >= cellsHorizontal) {
            continue;
        }

        // if that neighbour is visited, just continue to the next neigbour 
        if (grid[nextRow][nextColumn]) {
            continue;
        }

        // if not, remove a horizontal or vertical wall accordingly 
        if (direction === 'left') {
            verticals[row][column - 1] = true;
        } else if (direction === 'right') {
            verticals[row][column] = true;
        }

        if (direction === 'up') {
            horizontals[row - 1][column] = true;
        } else if (direction === 'down') {
            horizontals[row][column] = true;
        }

        // then visit that neighbour 
        stepRecursive(nextRow, nextColumn);
    }
}

const shuffleArray = (arr) => {
    let currentIndex = arr.length;
    let randomIndex;

    while (currentIndex != 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

        [arr[currentIndex], arr[randomIndex]] = [arr[randomIndex], arr[currentIndex]];
    }
    return arr;
}

stepRecursive(1, 1);


// Horizontal walls
horizontals.forEach((row, rowIndex) => {
    row.forEach((open, columnIndex) => {
        if (open) {
            return;
        }

        const wall = Bodies.rectangle(
            columnIndex * unitLengthX + unitLengthX / 2,
            rowIndex * unitLengthY + unitLengthY,
            unitLengthX, 
            5, 
            {
                label: 'horizontalWall',
                isStatic: true
            }
        )
        World.add(world, wall);
    });
});

// Vertical walls
verticals.forEach((row, rowIndex) => {
    row.forEach((open, columnIndex) => {
        if (open) {
            return; 
        }

        const wall = Bodies.rectangle(
            columnIndex * unitLengthX + unitLengthX, 
            rowIndex * unitLengthY + unitLengthY / 2, 
            5, 
            unitLengthY, 
            {
                label: 'verticalWall',
                isStatic: true
            }
        );
        World.add(world, wall);
    })
})

// Goal
const goal = Bodies.rectangle(
    (width - unitLengthX / 2.5), 
    (height - unitLengthY / 2.5), 
    unitLengthX * .5, 
    unitLengthY * .5, 
    { 
        isStatic: true, 
        label: 'goal'
    });
World.add(world, goal);

// Ball
const ball = Bodies.circle(
    unitLengthX / 2, 
    unitLengthY / 2, 
    Math.min(unitLengthX, unitLengthY) / 4, 
    { 
        label: 'ball' 
    });
World.add(world, ball);

// make the ball movable
document.addEventListener('keydown', event => {
    const { x, y} = ball.velocity;
    if (event.key === 'w') {
        Body.setVelocity(ball, { x, y: y - 3 });
    } else if (event.key === 'd') {
        Body.setVelocity(ball, { x: x + 3, y });
    } else if (event.key === 's') {
        Body.setVelocity(ball, { x, y: y + 3 });
    } else if (event.key === 'a') {
        Body.setVelocity(ball, { x: x - 3, y });
    } else {
        const alert = new Audio();
        alert.play();
        alert.loop = false;
    }
})

// Win condition 
Events.on(engine, 'collisionStart', event => {
    event.pairs.forEach((collision) => {
        const labels = ['ball', 'goal'];
        if (labels.includes(collision.bodyA.label) && labels.includes(collision.bodyB.label)) {
            engine.world.gravity.y = 1;
            engine.world.bodies.forEach((body) => {
                if (body.label !== 'border') {
                    Body.setStatic(body, false);
                }
            })
        }
    })
})