let density = "O,.";
let densityLength;
let grid;
let cols, rows;
let cellSize = 20; // Size of each cell in the grid
let cursorTrail = []; // To store the positions of the cursor trail
let font;
let fontSize = 7; // Font size for characters

function preload() {
    // Load the font from the original code
    font = loadFont('https://cdn.prod.website-files.com/666760929427ffac7da1f179/66676907797939d9167a798a_RoobertTRIAL-Regular.ttf');
}

function setup() {
    let canvas = createCanvas(500, 500);
    canvas.parent('canvas-container'); // Attach canvas to the canvas-container div
    cols = floor(width / cellSize);
    rows = floor(height / cellSize);
    
    // Initialize grid with random cells
    grid = createRandomGrid(cols, rows);

    // Set background color and frame rate
    background("black");
    frameRate(5);
    textAlign(CENTER, CENTER);
    textSize(fontSize); // Set font size for characters
    textFont(font);
}

function draw() {
    // Update the grid based on Game of Life rules
    grid = updateGrid(grid);
    
    // Clear the background
    background("black");

    // Draw the characters in the grid
    drawGrid(grid);

    // Update cursor trail
    if (mouseIsInCanvas()) {
        addCursorTrail(mouseX, mouseY);
    }
    
    // Draw cursor trail
    drawCursorTrail();
}

// Function to create a grid with random live and dead cells
function createRandomGrid(cols, rows) {
    let newGrid = [];
    for (let i = 0; i < cols; i++) {
        newGrid[i] = [];
        for (let j = 0; j < rows; j++) {
            newGrid[i][j] = random() < 0.6 ? 1 : 0; // Randomly assign live (1) or dead (0)
        }
    }
    return newGrid;
}

// Function to update the grid based on Game of Life rules
function updateGrid(grid) {
    let nextGrid = [];
    for (let i = 0; i < grid.length; i++) {
        nextGrid[i] = [];
        for (let j = 0; j < grid[i].length; j++) {
            let state = grid[i][j];
            let neighbors = countNeighbors(grid, i, j);
            
            // Game of Life rules
            if (state === 1 && (neighbors < 2 || neighbors > 3)) {
                nextGrid[i][j] = 0; // Cell dies
            } else if (state === 0 && neighbors === 3) {
                nextGrid[i][j] = 1; // Cell becomes alive
            } else {
                nextGrid[i][j] = state; // Stays the same
            }
        }
    }
    return nextGrid;
}

// Function to count live neighbors
function countNeighbors(grid, x, y) {
    let total = 0;
    for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
            if (i === 0 && j === 0) continue; // Skip the cell itself
            let ni = (x + i + grid.length) % grid.length; // Wrap around
            let nj = (y + j + grid[0].length) % grid[0].length; // Wrap around
            total += grid[ni][nj]; // Add the state of the neighbor
        }
    }
    return total;
}

// Function to draw the grid using characters
function drawGrid(grid) {
    for (let i = 0; i < grid.length; i++) {
        for (let j = 0; j < grid[i].length; j++) {
            if (grid[i][j] === 1) {
                let c = density.charAt(floor(random(density.length))); // Live cell gets a random character
                fill("#44d62c"); // Set fill color for characters
                text(c, i * cellSize + cellSize / 2, j * cellSize + cellSize / 2); // Draw character at cell position
            }
        }
    }
}

// Function to check if the mouse is inside the canvas
function mouseIsInCanvas() {
    return mouseX >= 0 && mouseX <= width && mouseY >= 0 && mouseY <= height;
}

// Function to add a cursor trail of live cells
function addCursorTrail(x, y) {
    let gridX = floor(x / cellSize);
    let gridY = floor(y / cellSize);
    if (gridX >= 0 && gridX < cols && gridY >= 0 && gridY < rows) {
        grid[gridX][gridY] = 1; // Set the cell under the cursor to live
        cursorTrail.push(createVector(gridX, gridY)); // Store the position
    }

    // Limit the size of the cursor trail
    if (cursorTrail.length > 500) {
        cursorTrail.shift(); // Remove the oldest position
    }
}

// Function to draw the cursor trail
function drawCursorTrail() {
    for (let pos of cursorTrail) {
        fill(0); // Set fill color for cursor trail characters
        let c = density.charAt(floor(random(density.length))); // Random character from density
        text(c, pos.x * cellSize + cellSize / 2, pos.y * cellSize + cellSize / 2); // Draw character for the trail
    }
}

function windowResized() {
    resizeCanvas(windowWidth - 250, windowHeight); // Adjust canvas size for sidebar
}
