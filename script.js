let canvas = document.getElementById("can");

let ctx = canvas.getContext("2d");

// global constants
let SQUARE_SIZE = 10;
let MAZE_SIZE = 21;

function updateSizes() {
  let size = document.getElementById("slider").value;
  MAZE_SIZE = size * 2 + 1;
  SQUARE_SIZE = Math.floor(400 / MAZE_SIZE);
}

  
class Graphic {
  constructor() {
    this.queue = [];
    setInterval( () => {
      if (this.queue.length > 0) {
        let color = this.queue.shift();
        let i = this.queue.shift();
        let j = this.queue.shift();
        this.draw(color, i, j);
      }
    },  20);
  }
  draw(color, i, j) {
    ctx.fillStyle = color;
    ctx.fillRect(j * SQUARE_SIZE, i * SQUARE_SIZE, SQUARE_SIZE, SQUARE_SIZE);
  }
  push(color, i, j) {
    this.queue.push(color, i, j)
  }
  clear() {
    this.queue = [];
  }
}
let gfx = new Graphic();

class Maze {
  constructor(arr) {
    this.arr = arr;
  }
  draw() {
    for (let i = 0; i < this.arr.length; i++) {
      for (let j = 0; j < this.arr[i].length; j++) {
        if (this.arr[i][j] == 1) {
          gfx.draw("black", i, j);
        }
        else if (this.arr[i][j] == 2) {
          gfx.draw("green", i, j);
        }
      }
    }
  }
  isValid(i, j) {
    if (i < 0 || i >= this.arr.length || j < 0 || j >= this.arr.length) {
      return false;
    }
    return this.arr[i][j] == 0 || this.arr[i][j] == 2;
  }
  isGoal(i, j) {
    return this.isValid(i, j) && this.arr[i][j] == 2;
  }
  isWall(i, j) {
    if (i < 0 || i >= this.arr.length || j < 0 || j >= this.arr.length) {
      return false;
    }
    return this.arr[i][j] == 1;
  }
  generate(width, height) {

    
    let mazeArray = [];
    let row = [];
    for (let i = 0; i < width; i++) {
      row.push(1);
    }
    for (let i = 0; i < height; i++) {
      row = row.slice();
      mazeArray.push(row);
    }
    this.arr = mazeArray;
    this.draw();

    let i = 1;
    let j = 1;
    let path = [];
    let direction = "right";
    let steps = 0;
    
    while (!this.isGoal(i, j) && steps < 5000) {
      steps++;
      // this is randomized dfs
      // change the current square to 0
      mazeArray[i][j] = 0;
      gfx.push("white", i, j);
      path.push([i, j]);
      // move forward
      if (direction == "up" && maze.isWall(i-2, j)) {
        mazeArray[i-1][j] = 0;
        gfx.push("white", i-1, j);
        i -= 2;
      }
      else if (direction == "down" && maze.isWall(i+2, j)) {
        mazeArray[i+1][j] = 0;
        gfx.push("white", i+1, j);
        i += 2;
      }
      else if (direction == "left" && maze.isWall(i, j-2)) {
        mazeArray[i][j-1] = 0;
        gfx.push("white", i, j-1);
        j -= 2;
      }
      else if (direction == "right" && maze.isWall(i, j+2)) {
        mazeArray[i][j+1] = 0;
        gfx.push("white", i, j+1);
        j += 2;
      }
      else {
        while(path.length > 0) {
          if (maze.isWall(i-2, j)) {
            direction = "up";
            break;
          }
          else if (maze.isWall(i+2, j)) {
            direction = "down";
            break;
          }
          else if (maze.isWall(i, j-2)) {
            direction = "left";
            break;
          }
          else if (maze.isWall(i, j+2)) {
            direction = "right";
            break;
          }
          path.pop();
          if (path.length > 0) {
            i = path[path.length-1][0];
            j = path[path.length-1][1];
          }
        }
        if (path.length == 0) {
          break;
        }
        continue;
        // dead end scenario
      }
      let randomInteger = Math.floor(Math.random() * 4);
      if (randomInteger == 0) {
        direction = "up";
      }
      if (randomInteger == 1) {
        direction = "down";
      }
      if (randomInteger == 2) {
        direction = "left";
      }
      if (randomInteger == 3) {
        direction = "right";
      }
      // change direction every 2 squares
      // change direction on odd squares
      // we have to backtrack at a dead end
      
    }

    mazeArray[height - 2][width - 2] = 2;
    gfx.push("green", height - 2, width - 2);
  }
}

class Player {
  constructor(i, j) {
    this.i = i;
    this.j = j;
  }
  move(di, dj, maze) {
    if (maze.isValid(this.i + di, this.j + dj)) {
      this.i += di;
      this.j += dj;
    }
  }
  draw() {
    gfx.draw("red", this.i, this.j);
  }
}
// let maze = new Maze([
//   [1, 1, 1, 1, 1, 1, 1, 1],
//   [1, 0, 1, 0, 0, 0, 1, 1],
//   [1, 0, 1, 0, 1, 0, 0, 1],
//   [1, 0, 0, 0, 1, 1, 0, 1],
//   [1, 0, 1, 0, 0, 1, 0, 1],
//   [1, 0, 1, 0, 1, 1, 0, 1],
//   [1, 0, 1, 0, 0, 1, 2, 1],
//   [1, 1, 1, 1, 1, 1, 1, 1]
// ]);

// let maze = new Maze([
//   [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
//   [1,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
//   [1,0,1,1,1,1,1,1,1,1,1,1,1,0,1],
//   [1,0,1,0,1,0,0,0,0,0,1,0,1,0,1],
//   [1,0,1,0,1,0,1,1,1,0,1,1,1,0,1],
//   [1,0,0,0,1,0,0,0,0,0,1,0,1,0,1],
//   [1,0,1,1,1,0,1,0,1,0,1,0,1,0,1],
//   [1,0,1,0,1,1,1,0,1,0,1,0,1,0,1],
//   [1,0,1,0,0,0,1,0,1,0,0,0,0,0,1],
//   [1,0,1,1,1,0,1,0,1,1,1,0,1,0,1],
//   [1,0,0,0,1,0,1,0,1,0,1,0,1,0,1],
//   [1,0,1,0,1,0,1,0,1,0,1,0,1,0,1],
//   [1,0,1,0,0,0,0,0,1,0,0,0,0,2,1],
//   [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
// ]);
// let maze = new Maze([
//   [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
//   [1,0,0,0,1,1,1,1,1,1,1,1,0,0,1],
//   [1,0,1,0,0,0,1,1,1,1,1,0,1,0,1],
//   [1,0,1,0,1,0,0,0,0,0,1,0,0,0,1],
//   [1,0,1,0,1,0,1,1,1,0,1,1,1,0,1],
//   [1,0,0,0,1,0,0,0,0,0,1,0,0,0,1],
//   [1,0,1,1,1,0,1,0,1,0,1,0,1,1,1],
//   [1,0,0,0,1,1,1,0,1,0,1,0,1,0,1],
//   [1,1,1,0,0,0,1,1,1,0,0,0,0,0,1],
//   [1,1,1,1,1,0,1,0,1,1,1,1,1,0,1],
//   [1,0,0,0,1,0,1,0,1,0,0,0,0,0,1],
//   [1,0,1,0,1,0,1,0,0,0,1,1,1,0,1],
//   [1,0,1,0,0,0,0,0,1,0,1,0,0,2,1],
//   [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
// ]);
let maze = new Maze([
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
  [1,0,1,0,1,1,1,1,1,1,1,0,0,0,1],
  [1,0,0,0,0,0,1,1,1,1,1,0,1,0,1],
  [1,1,1,0,1,0,0,0,0,0,0,0,1,0,1],
  [1,0,1,0,1,0,1,1,1,0,1,1,1,0,1],
  [1,0,0,0,1,0,0,0,0,1,1,1,0,0,1],
  [1,0,1,1,1,0,1,0,1,0,1,0,1,0,1],
  [1,0,0,0,1,1,1,0,1,0,1,0,1,0,1],
  [1,1,1,0,0,0,1,1,1,0,0,0,0,0,1],
  [1,1,1,0,1,0,0,0,1,1,1,1,1,0,1],
  [1,0,0,0,1,0,1,0,1,0,0,0,0,0,1],
  [1,0,1,0,1,0,1,0,0,0,1,0,1,0,1],
  [1,0,1,0,0,0,1,0,1,0,1,0,1,2,1],
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
]);


let player = new Player(1, 1);


function drawAll() {
  gfx.clear();
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  maze.draw();
  player.draw();

  if (maze.isGoal(player.i, player.j)) {
    ctx.fillStyle = "orange";
    ctx.font = "30px arial";
    ctx.fillText("You have reached the goal!", 10, 200);
  }
  
}

function solve() {
  let i = player.i;
  let j = player.j;
  let path = [[i, j]];
  let explored = [];
  explored.push([i, j].toString());
  while (!maze.isGoal(i, j)) {
    if (maze.isValid(i-1, j) && !explored.includes([i-1, j].toString())) {
      i--;
      explored.push([i, j].toString());
      path.push([i, j]);
      gfx.push("blue", i, j);
    }
    else if (maze.isValid(i+1, j) && !explored.includes([i+1, j].toString())) {
      i++;
      explored.push([i, j].toString());
      path.push([i, j]);
      gfx.push("blue", i, j);
    }
    else if (maze.isValid(i, j-1) && !explored.includes([i, j-1].toString())) {
      j--;
      explored.push([i, j].toString());
      path.push([i, j]);
      gfx.push("blue", i, j);
    }
    else if (maze.isValid(i, j+1) && !explored.includes([i, j+1].toString())) {
      j++;
      explored.push([i, j].toString());
      path.push([i, j]);
      gfx.push("blue", i, j);
    }
    else {
      gfx.push("gray", i, j);
      path.pop();
      i = path[path.length-1][0];
      j = path[path.length-1][1];
    }
  }
  function drawPath(path) {
      for (let i = 0; i < path.length; i++) {
        gfx.draw("blue", i, j);
      }
  }
}
function bfs() {
  let explored = new Set();
  let paths = [[[player.i, player.j]]]; // unlike dfs, bfs checks multiple paths at the same time
  let goalFound = false;
  while (paths.length > 0 && !goalFound) {
    let newPaths = [];
    for (const path of paths) {
      let i = path[path.length-1][0];
      let j = path[path.length-1][1];
      if (maze.isGoal(i, j)) {
        goalFound = true;
        // draw this path
        for (const position of path) {
          gfx.push("blue", position[0], position[1] );
          console.log(path);
        }
        break;
      }
      if (maze.isValid(i - 1, j) && !explored.has([i - 1, j].toString())) {
        explored.add([i - 1, j].toString());
        // add a new path with this new position
        let newPath = path.slice();
        newPath.push([i - 1, j]);
        newPaths.push(newPath);
        gfx.push("gray", i - 1, j);
      }
      if (maze.isValid(i + 1, j) && !explored.has([i + 1, j].toString())) {
        explored.add([i + 1, j].toString());
        // add a new path with this new position
        let newPath = path.slice();
        newPath.push([i + 1, j]);
        newPaths.push(newPath);
        gfx.push("gray", i + 1, j);
      }
      if (maze.isValid(i, j - 1) && !explored.has([i, j - 1].toString())) {
        explored.add([i, j - 1].toString());
        // add a new path with this new position
        let newPath = path.slice();
        newPath.push([i, j - 1]);
        newPaths.push(newPath);
        gfx.push("gray", i, j - 1);
      }
      if (maze.isValid(i, j + 1) && !explored.has([i, j + 1].toString())) {
        explored.add([i, j + 1].toString());
        // add a new path with this new position
        let newPath = path.slice();
        newPath.push([i, j + 1]);
        newPaths.push(newPath);
        gfx.push("gray", i, j + 1);
      }
    }
    paths = newPaths;
  }
}

function smartSolve(algorithm) {
  // this method focuses on the next square to explore instead of building a path
  let toExplore = []; // toExplore contains the squares we want to explore next
  let exploredFrom = {}; // exploredFrom associates each square with the square we came from
  toExplore.push([player.i, player.j]);
  exploredFrom[[player.i, player.j]] = null;
  while (toExplore.length > 0) {
    let curr;
    if (algorithm == "dfs") {
      curr = toExplore.pop();
    }
    else {
      curr = toExplore.shift();
    }
    let i = curr[0];
    let j = curr[1];
    gfx.push("gray", i, j);
    if (maze.isGoal(i, j)) {
      break;
    }
    let neighbors = [[i-1, j], [i+1, j], [i, j-1], [i, j+1]];
    if (algorithm == "dfs") {
      neighbors.reverse();
    }
    
    for (const next of neighbors) {
      if (maze.isValid(next[0], next[1]) && !(next in exploredFrom)) {
        exploredFrom[next] = curr;
        toExplore.push(next);
      }
    }
  }
  // draw the final path
  let curr = [maze.arr.length-2, maze.arr[0].length-2];
  while (curr != null) {
    gfx.push("blue", curr[0], curr[1]);
    curr = exploredFrom[curr];
  }
}
function recursiveDFS() {
  let explored = new Set();
  function explore(i, j) {
    if (maze.isGoal(i, j)) {
      return [[i, j]];
    }
    if (!maze.isValid(i, j) || explored.has([i, j].toString())) {
      return [];
    }
    explored.add([i, j].toString());
    gfx.push("gray", i, j);
    let up = explore(i-1, j);
    if (up.length != 0) {
      up.unshift([i, j]);
      return up;
    }
    let down  = explore(i+1, j);
    if (down.length != 0) {
      down.unshift([i, j]);
      return down;
    }
    let left = explore(i, j-1);
    if (left.length != 0) {
      left.unshift([i, j]);
      return left;
    }
    let right = explore(i, j+1);
    if (right.length != 0) {
      right.unshift([i, j]);
      return right;
    }
    return [];
  }
  let path = explore(player.i, player.j);
  for (const position of path) {
    gfx.push("blue", position[0], position[1]);
  }
}

document.addEventListener("keypress", function(event) {
  if (event.key == "a") {
    player.move(0, -1, maze);
  }
  else if (event.key == "d") {
    player.move(0, 1, maze);
  }
  else if (event.key == "w") {
    player.move(-1, 0, maze);
  }
  else if (event.key == "s") {
    player.move(1, 0, maze);
  }
  drawAll();
});

drawAll();
// maze.generate(21, 21);
// solve();
// bfs();
// -------------------------------------------------------------------->
// Depth first search: (how a human would do it)

// to solve the maze, we have to explore different paths until we reach the goal
// if the current path is a dead end, we have to backtrack
// we represent a path as an array of positions
// we can continue a path by pushing new positions to that array
// if we are at a fork, we should choose one of the paths to go down
// if we are at a fork, we also have to keep track of unexplored paths to go down later
// we are at a dead end if there are no new positions to go to (every position we go to has already been explored)
// to backtrack, we go and explore an unexplored path that we kept track of
// repeat all of these steps until we reach the goal

// ------------------------------------------------------------->
// Breadth first search: (how a computer would do it)
// Also called flood fill search

// to find the shortest path, we have to search all the paths at the same time
// the first path to reach the goal is the shortest
// if the current path is a dead end, we eliminate it because we are already exploring other paths
// if we are at a fork, instead of choosing one path to go down, we have to add all paths to consideration
// repeat all of these steps until we reach the goal



// ------------------------------------------------------------->
// Maze generator
// we want to guarantee a path from the start to the goal
// in order to do that, we start in the top left and work our way to the goal, one square at a time, placing zeros on the path we walk
// A simple way would be straight to the right and straight down
// to randomize this path, we choose a random direction every two squares so that there are walls in between (instead of straight to the right and straight down)
// we have to keep track of where we explored so we don't cross our paths with something before it
// if we come across a dead end, we can keep the squares we explored since its random, but we have to backtrack
// backtrack until we are no longer at a dead end and go in a new direction randomly
// repeat until reach the goal


