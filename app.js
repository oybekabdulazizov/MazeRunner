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
    Bodies.rectangle(width / 2, 0, width, 20, { isStatic: true, }),
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
const verticals = Array(cells).fill(null).map(() => Array(cells - 1).fill(false));
const horizontals = Array(cells - 1).fill(null).map(() => Array(cells).fill(false));

const startRow = Math.floor(Math.random() * cells);
const startColumn = Math.floor(Math.random() * cells);

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
        if (nextRow < 0 || nextRow >= cells || nextColumn < 0 || nextColumn >= cells) {
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