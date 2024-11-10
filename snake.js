let doc = document, body = doc.body, create_elem = (e) => doc.createElement(e), math = Math;
body.innerHTML = "";
body.style.textAlign = "center";
body.style.font = "14pt monospace";

let size = 10;
let mul = 20;
let pad = 1;

// init
let canvas = create_elem("canvas");
canvas.width = canvas.height = size * mul;
canvas.style.imageRendering = "crisp-edges";
body.append(canvas);
body.append(create_elem("br"));

let ctx = canvas.getContext("2d");

// lower index = newer
// higher index = older
let snake_tiles;
let apple_tile;
let xv, yv;
let move_queue;

const btns = [
    { c: "KeyW", t: "^", v: [0, -1] },
    { c: "KeyA", t: "<", v: [-1, 0] },
    { c: "KeyS", t: "v", v: [0, 1] },
    { c: "KeyD", t: ">", v: [1, 0] },
];

for (let i = 0; i < btns.length; i++) {
    let b = btns[i];

    let btn = create_elem("button");
    // btn.style.width = btn.style.height = `${(size * mul + 2) / 3}px`;
    btn.style.width = btn.style.height = "67.3px";
    btn.append(b.t);
    btn.onclick = () => {
        move_queue.push(b.v);
    };
    body.append(btn);

    if (i == 0) {
        btn.style.marginTop = "1rem";
        body.append(create_elem("br"));
    }
}

body.onkeydown = (e) => {
    for (let i = 0; i < btns.length; i++) {
        let b = btns[i];

        if (e.code == b.c) {
            move_queue.push(b.v);
            return;
        }
    }
};

let score = create_elem("div");
score.style.marginTop = "1rem";
score.append(0);
body.append(score);

function reset() {
    // snake_tiles = [[math.floor((size - 1) / 2), math.floor((size - 1) / 2)]];
    snake_tiles = [[4, 4]];
    xv = 0, yv = 0;
    move_queue = [];
    repos_apple();
    score.innerText = `Score: ${snake_tiles.length - 1}`;
}
reset();

function repos_apple() {
    for (;;) {
        let x = math.floor(math.random() * size);
        let y = math.floor(math.random() * size);

        if (!snake_tiles.some(t => JSON.stringify(t) == JSON.stringify([x, y]))) {
            apple_tile = [x, y];
            break;
        }
    }
}

setInterval(() => {
    if (move_queue.length > 0) {
        let m = move_queue.shift();

        if (!((xv == m[0] && yv == m[1]) || (-xv == m[0] && -yv == m[1]))) {
            xv = m[0]; yv = m[1];
        }
    }

    if (xv != 0 || yv != 0) {
        let t = structuredClone(snake_tiles[0]);
        t[0] = (t[0] + xv) % size;
        t[0] = t[0] >= 0 ? t[0] : size - 1;
        t[1] = (t[1] + yv) % size;
        t[1] = t[1] >= 0 ? t[1] : size - 1;

        snake_tiles.unshift(t);
        let jt = JSON.stringify(t);

        if (jt == JSON.stringify(apple_tile)) {
            repos_apple();
            score.innerText = `Score: ${snake_tiles.length - 1}`;
        } else {
            snake_tiles.pop();
        }

        if (snake_tiles.slice(1).some(a => jt == JSON.stringify(a))) {
            reset();
        }
    }

    ctx.fillStyle = body.style.background = "#24273a";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    canvas.style.border = "1px solid" + (ctx.fillStyle = score.style.color = "#cad3f5");
    for (let i = 0; i < snake_tiles.length; i++) {
        let a = snake_tiles[i];
        let b = snake_tiles[i - 1];

        if (i - 1 < 0) {
            ctx.fillRect(a[0] * mul + pad, a[1] * mul + pad, mul - 2 * pad, mul - 2 * pad);
            continue;
        }

        let xd = b[0] - a[0];
        let yd = b[1] - a[1];

        if (math.abs(xd) > math.abs(yd)) {
            if (xd == -1 || xd > 1) ctx.fillRect(a[0] * mul - pad, a[1] * mul + pad, mul, mul - 2 * pad);
            else ctx.fillRect(a[0] * mul + pad, a[1] * mul + pad, mul, mul - 2 * pad);
        } else {
            if (yd == -1 || yd > 1) ctx.fillRect(a[0] * mul + pad, a[1] * mul - pad, mul - 2 * pad, mul);
            else ctx.fillRect(a[0] * mul + pad, a[1] * mul + pad, mul - 2 * pad, mul);
        }
    }

    ctx.fillStyle = "#ed8796";
    let rx = apple_tile[0] * mul, ry = apple_tile[1] * mul;
    ctx.fillRect(rx, ry, mul, mul);
}, 500);
