let tetraminoes = {
    "o": [
        [
            [".", ".", ".", "."],
            [".", "X", "X", "."],
            [".", "X", "X", "."],
            [".", ".", ".", "."]
        ],
        [
            [".", ".", ".", "."],
            [".", "X", "X", "."],
            [".", "X", "X", "."],
            [".", ".", ".", "."]
        ],
        [
            [".", ".", ".", "."],
            [".", "X", "X", "."],
            [".", "X", "X", "."],
            [".", ".", ".", "."]
        ],
        [
            [".", ".", ".", "."],
            [".", "X", "X", "."],
            [".", "X", "X", "."],
            [".", ".", ".", "."]
        ]
    ],
    "z": [
        [
            ["X", "X", "."],
            [".", "X", "X"],
            [".", ".", "."]
        ],

        [
            [".", ".", "X"],
            [".", "X", "X"],
            [".", "X", "."]
        ],

        [
            [".", ".", "."],
            ["X", "X", "."],
            [".", "X", "X"]
        ],

        [
            [".", "X", "."],
            ["X", "X", "."],
            ["X", ".", "."]
        ]
    ],

    "j": [
        [
            ["X", ".", "."],
            ["X", "X", "X"],
            [".", ".", "."]
        ],
        [
            [".", "X", "X"],
            [".", "X", "."],
            [".", "X", "."]
        ],
        [
            [".", ".", "."],
            ["X", "X", "X"],
            [".", ".", "X"]
        ],
        [
            [".", "X", "."],
            [".", "X", "."],
            ["X", "X", "."]
        ]
    ],

    "l": [
        [
            [".", ".", "."],
            ["X", "X", "X"],
            ["X", ".", "."]
        ],
        [
            ["X", "X", "."],
            [".", "X", "."],
            [".", "X", "."]
        ],
        [
            [".", ".", "X"],
            ["X", "X", "X"],
            [".", ".", "."]
        ],
        [
            [".", "X", "."],
            [".", "X", "."],
            [".", "X", "X"]
        ]
    ],

    "s": [
        [
            [".", "X", "X"],
            ["X", "X", "."],
            [".", ".", "."]
        ],
        [
            [".", "X", "."],
            [".", "X", "X"],
            [".", ".", "X"]
        ],
        [
            [".", ".", "."],
            [".", "X", "X"],
            ["X", "X", "."]
        ],
        [
            ["X", ".", "."],
            ["X", "X", "."],
            [".", "X", "."]
        ]
    ],

    "t": [
        [
            [".", "X", "."],
            ["X", "X", "X"],
            [".", ".", "."]
        ],
        [
            [".", "X", "."],
            [".", "X", "X"],
            [".", "X", "."]
        ],
        [
            [".", ".", "."],
            ["X", "X", "X"],
            [".", "X", "."]
        ],
        [
            [".", "X", "."],
            ["X", "X", "."],
            [".", "X", "."]
        ]
    ],
    "i": [
        [
            [".", ".", ".", "."],
            ["X", "X", "X", "X"],
            [".", ".", ".", "."],
            [".", ".", ".", "."]
        ],
        [
            [".", ".", "X", "."],
            [".", ".", "X", "."],
            [".", ".", "X", "."],
            [".", ".", "X", "."]
        ],
        [
            [".", ".", ".", "."],
            [".", ".", ".", "."],
            ["X", "X", "X", "X"],
            [".", ".", ".", "."]
        ],
        [
            [".", "X", ".", "."],
            [".", "X", ".", "."],
            [".", "X", ".", "."],
            [".", "X", ".", "."]
        ]
    ]
}
let canvas = document.getElementById("canvas");
let btn = document.getElementById("playBtn");
const BOARD_W = 300;
const W = BOARD_W + 160;
const H = 600;
const ROWS = 20;
const COLS = 10;
const CELL_W = BOARD_W / COLS;
const CELL_H = H / ROWS;
const emptyCell = 7;
const fps = 25;
let ctx = canvas.getContext("2d");
let grid = [];
let pieces = [];
let nextGameTick = false;
const colors = ['yellow', 'orange', 'cyan', 'blue', 'red', 'green', 'purple', 'white'];
let score = 0;
let gameOver = false;
let rotation = 0;
let currentPiece = Math.floor(Math.random() * Math.floor(7));
let nextPiece = Math.floor(Math.random() * Math.floor(7));
let xPos = (COLS / 2) - 1;
let yPos = 0;
let tickCount = 20;
let currentTicks = 0;
let pieceCount = 0;
let paused = true;
let gameStarted = false;

document.addEventListener('keydown', handleKeyPress);
btn.addEventListener('click', handlePlay);

for (let [key, value] of Object.entries(tetraminoes)) {
    pieces.push(value);
}

for (let y = 0; y < ROWS; y++) {
    grid[y] = [];
    for (let x = 0; x < COLS; x++) {
        grid[y][x] = emptyCell;
    }
}

const loop = () => {
    if (!paused) {
        handleGameState();
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawBoard();
        drawScore();
        drawNextPiece();
        setTimeout(() => {
            request = requestAnimationFrame(loop);
        }, 1000 / fps);
    }
}

function handleGameState() {
    if (!gameOver) {
        nextGameTick = (tickCount == currentTicks);
        currentTicks++;
        if (nextGameTick) {
            pieceCount++;
            if (pieceCount % 50 == 0) {
                if (tickCount > 10) {
                    tickCount--;
                }
            }
            currentTicks = 0;
            if (isValidMove(currentPiece, xPos, yPos + 1, rotation)) {
                yPos++;
            } else {
                const p = getPiece(currentPiece, rotation);
                for (let row = 0; row < p.length; row++) {
                    for (let col = 0; col < p.length; col++) {
                        if (p[row][col] != '.') {
                            grid[yPos + row][xPos + col] = currentPiece;
                        }
                    }
                }
                // Spawn new piece
                // Check for lines
                let lines = 0;
                for (let y = 0; y < ROWS; y++) {
                    let filled = true;
                    for (let x = 0; x < COLS; x++) {
                        if (grid[y][x] == emptyCell) {
                            filled = false;
                        }
                    }
                    if (filled) {
                        grid.splice(y, 1);
                        grid.unshift(Array.from({length: 10}, () => emptyCell));
                        lines++;
                    }
                }

                score += calculateScore(lines);
                currentPiece = nextPiece;
                nextPiece = Math.floor(Math.random() * Math.floor(7));
                xPos = (COLS / 2) - 1;
                yPos = 0;

                if (!isValidMove(currentPiece, xPos, yPos + 1, rotation)) {
                    gameOver = true;
                }
            }
        }
    }
}

function calculateScore(lines) {
    switch (lines) {
        case 0:
            return 0;
        case 1:
            return 40;
        case 2:
            return 100;
        case 3:
            return 300;
        case 4:
            return 1200;
    }
}

function handleKeyPress(e) {
    const key = e.key;
    switch (key) {
        case 'ArrowDown':
            if (isValidMove(currentPiece, xPos, yPos + 1, rotation)) {
                yPos++;
            }
            break;
        case 'ArrowUp':
            if (isValidMove(currentPiece, xPos, yPos, rotation + 1)) {
                rotation++;
            }
            break;
        case 'ArrowLeft':
            if (isValidMove(currentPiece, xPos - 1, yPos, rotation)) {
                xPos--;
            }
            break;
        case 'ArrowRight':
            if (isValidMove(currentPiece, xPos + 1, yPos, rotation)) {
                xPos++;
            }
            break;
    }
}

function drawBoard() {
    for (let x = 0; x < COLS; x++) {
        for (let y = 0; y < ROWS; y++) {
            drawCell(x, y, grid[y][x]);
        }
    }

    const p = getPiece(currentPiece, rotation);
    for (let y = 0; y < p.length; y++) {
        for (let x = 0; x < p.length; x++) {
            if (p[y][x] != '.')
                drawCell(xPos + x, yPos + y, currentPiece);
        }
    }
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 1;
    ctx.moveTo(300, 0);    // Move the pen to (30, 50)
    ctx.lineTo(300, 600);  // Draw a line to (150, 100)
    ctx.stroke();  
}

function drawCell(xPos, yPos, value) {
    ctx.fillStyle = colors[value];
    ctx.strokeStyle = 'white';
    ctx.lineWidth = 1;
    ctx.fillRect(CELL_W * xPos, CELL_H * yPos, CELL_W - 1, CELL_H - 1);
    ctx.strokeRect(CELL_W * xPos, CELL_H * yPos, CELL_W - 1, CELL_H - 1);
}

function drawScore() {
    ctx.font = '24px san-serif';
    ctx.fillStyle = 'black';
    ctx.fillText(`Score: ${score}`, 340, 40); 
}

function drawNextPiece() {
    const p = getPiece(nextPiece, 0);
    for (let y = 0; y < p.length; y++) {
        for (let x = 0; x < p.length; x++) {
            if (p[y][x] != '.') {
                drawCell(11 + x, 4 + y, nextPiece);
            }
        }
    }
}

function getPiece(pieceId, rot) {
    return pieces[pieceId][rot % 4];
}

function isValidMove(pieceId, curX, curY, curRot) {
    let piece = getPiece(pieceId, curRot);
    for (let y = 0; y < piece.length; y++) {
        for (let x = 0; x < piece.length; x++) {
            if (curX + x >= 0 && curX + x < COLS) {
                if (curY + y >= 0 && curY + y < ROWS) {
                    if (piece[y][x] != '.' && grid[curY + y][curX + x] != emptyCell) {
                        return false;
                    }
                }
            }
            if (piece[y][x] != '.' && ( curX + x >= COLS || curX + x < 0 || curY + y >= ROWS || curY + y < 0)) {
                return false;
            }
        }
    }
    return true;
}

function handlePlay() {
    if (!gameStarted) {
        gameStarted = true;
    }
    paused = !paused;
    loop();
}
