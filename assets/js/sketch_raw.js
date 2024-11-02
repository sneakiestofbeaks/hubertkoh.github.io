let density = "O1";
let densityLength = density.length;

let grid;
let cols, rows;
let cellSize = 20; // Size of each cell in the grid
let cursorTrail = []; // To store the positions of the cursor trail
let font;
let fontSize = 7; // Font size for characters

// Define a list of color palettes as tuples (background, text)
let palettes = [
  ["#1A1A1D", "#C3073F"], // Palette 1
  ["#4C4C4C", "#FFB800"], // Palette 2
  ["#0B132B", "#FFFAF0"], // Palette 3
  ["#A6D3D2", "#2C3A47"], // Palette 4
  ["#4A90E2", "#F8E71C"],  // Palette 5
  ["#000000", "#44d62c"],
  ["#FF4F81", "#F9A500"], // Palette 1
  ["#A6E3E9", "#F72585"], // Palette 2
  ["#FF6F61", "#6A0572"], // Palette 3
  ["#0D3B66", "#F4D35E"], // Palette 4
  ["#D5006D", "#FFEB3B"], // Palette 5
  ["#FF8A3D", "#005B96"], // Palette 6
  ["#D2A6FF", "#6C63FF"], // Palette 7
  ["#3F37C9", "#FBC700"], // Palette 8
  ["#00A8E1", "#FF007A"], // Palette 9
  ["#E63946", "#F1FAEE"], // Palette 10
  ["#F1C40F", "#E74C3C"], // Palette 11
  ["#F39C12", "#2980B9"], // Palette 12
  ["#D35400", "#2ECC71"], // Palette 13
  ["#9B59B6", "#3498DB"], // Palette 14
  ["#E84393", "#00B894"]  // Palette 15
];

let currentPalette; // To store the currently selected palette

function preload() {
  // Load the font from the original code
  font = loadFont('https://cdn.prod.website-files.com/666760929427ffac7da1f179/66676907797939d9167a798a_RoobertTRIAL-Regular.ttf');
}

function setup() {
    let canvasParent = document.getElementById('p5-sketch');
    let canvasWidth = canvasParent.offsetWidth;
    let canvasHeight = canvasParent.offsetHeight;
    let aspectRatio = canvasWidth / canvasHeight;

    if (canvasWidth > canvasParent.offsetWidth) {
      canvasWidth = canvasParent.offsetWidth;
      canvasHeight = canvasWidth / aspectRatio;
    }

    let canvas = createCanvas(canvasWidth, canvasHeight);
    canvas.parent('p5-sketch');

//   createCanvas(500, 2000);
  cols = floor(canvasWidth / cellSize);
  rows = floor(canvasHeight / cellSize);
  
  // Initialize grid with random cells
  grid = createRandomGrid(cols, rows);

  // Select a random color palette
  currentPalette = random(palettes);

  // Set background color and frame rate
  background(currentPalette[0]); // Set background color
  frameRate(5);
  textAlign(CENTER, CENTER);
  textSize(fontSize); // Set font size for characters
  textFont(font);
}

function draw() {
  // Clear the background
  background(currentPalette[0]); // Use the selected background color

  // Update the grid based on Game of Life rules
  grid = updateGrid(grid);
  
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
      if (state === 1) {
        // Cell is currently alive
        if (neighbors < 2 || neighbors > 3) {
          nextGrid[i][j] = 0; // Cell dies
        } else {
          nextGrid[i][j] = 1; // Cell remains alive
        }
      } else {
        // Cell is currently dead
        if (neighbors === 3) {
          nextGrid[i][j] = 1; // Cell becomes alive
        } else {
          nextGrid[i][j] = 0; // Cell remains dead
        }
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
        let c = density.charAt(floor(random(densityLength))); // Live cell gets a random character
        fill(currentPalette[1]); // Set fill color for characters using the selected text color
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
    fill(currentPalette[1]); // Set fill color for cursor trail characters
    let c = density.charAt(floor(random(densityLength))); // Random character from density
    text(c, pos.x * cellSize + cellSize / 2, pos.y * cellSize + cellSize / 2); // Draw character for the trail
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}