document.body.innerHTML = "";

const size = 10;
const mul = 20;

// init
let canvas = document.createElement("canvas");
let ctx = canvas.getContext("2d");
canvas.width = size * mul;
canvas.height = size * mul;
document.body.appendChild(canvas);
ctx.fillStyle = "black";
ctx.fillRect(0, 0, canvas.width, canvas.height);

function set_px(x, y, color) {
    ctx.fillStyle = color;
    let rx = x * mul, ry = y * mul;
    ctx.fillRect(rx, ry, mul, mul);
}

// lower index = newer
// higher index = older
let snake_tiles = [[Math.floor(size / 2), Math.floor(size / 2)]];

function tick() {
}
