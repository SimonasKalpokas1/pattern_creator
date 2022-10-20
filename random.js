let grid;

let cols = 5;
let rows = 5;

const blockSize = 50;

let blockValueToColor;

let currentBlock = "0";

let width = blockSize*cols;
let height = blockSize*rows;

let blockSelect;

function setup() {
    let canvas = createCanvas(width,height);

    canvas.parent('canvasForHTML');
    background(255);
    stroke(0);

    grid = make2DArray(cols,rows);

    blockSelect = document.getElementById('blockSelect');

    document.getElementById('eraseButton').addEventListener('click', function() {
        grid = make2DArray(cols,rows);
    });
    
    document.getElementById('rows').addEventListener('change', function() {
      const new_rows = int(this.value);
      if (new_rows < rows) {
        grid = grid.slice(0, new_rows);
      }
      else {
        for (let i = rows; i < new_rows; i++) {
          grid.push(new Array(cols).fill("0"));
        }
      }
      rows = new_rows;
      width = blockSize*cols;
      height = blockSize*rows;
      resizeCanvas(width,height);
    });

    document.getElementById('cols').addEventListener('change', function() {
      const new_cols = int(this.value);
      if (new_cols < cols) {
        for (let i = 0; i < rows; i++) {
          grid[i] = grid[i].slice(0, new_cols);
        }
      }
      else {
        for (let i = 0; i < rows; i++) {
          for (let j = cols; j < new_cols; j++) {
            grid[i].push("0");
          }
        }
      }
      cols = new_cols;
      width = blockSize*cols;
      height = blockSize*rows;
      resizeCanvas(width,height);
    });
    
    document.getElementById('saveButton').addEventListener('click', async () => {
      let data = "";
      for (let i = 0; i < grid.length; i++) {
        data += grid[i].join(",") + "\n";
      }

      // show save file picker for .csv file
      const handle = await window.showSaveFilePicker({
        types: [
          {
            description: 'CSV file',
            accept: {
              'text/csv': ['.csv'],
            },
          },
        ],
      });

      const blob = new Blob([data], {type: 'text/plain'});

      const writableStream = await handle.createWritable();
      await writableStream.write(blob);
      await writableStream.close();
    });

    blockValueToColor = {
      "-1": 150,
      "0": 255,
      "1": color(209, 23, 178),
      "2": color(200, 209, 23),
      "3": color(0, 255, 0),
    }
}

function draw() {
  // draw grid
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      fill(blockValueToColor[grid[j][i]]);
      rect(i * blockSize, j * blockSize, blockSize, blockSize);
    }
  }
}

function mousePressed() {
  if (mouseX >= 0 && mouseX < blockSize*rows && mouseY >= 0 && mouseY < blockSize*cols) {
    let x = floor(mouseX / blockSize);
    let y = floor(mouseY / blockSize);

    let value = blockSelect.value;
    if (grid[y][x] == value) {
        currentBlock = "0";
    }
    else {
        currentBlock = value;
    }
    grid[y][x] = currentBlock;
  }
}

function mouseDragged() {
  if (mouseX >= 0 && mouseX < blockSize*cols && mouseY >= 0 &&  mouseY < blockSize*rows) {
      let x = Math.floor(mouseX / blockSize);
      let y = Math.floor(mouseY / blockSize);
      grid[y][x] = currentBlock;
    }
}

function make2DArray(cols, rows) {
    let arr = new Array(rows);
    for (let i = 0; i < rows; i++) {
        arr[i] = new Array(cols).fill("0");
    }
    return arr;
}