document.body.innerHTML = "";
document.body.style.background = "grey";

{
    const size = 10;
    const mul = 20;
    const pad = 1;

    // init
    let canvas = document.createElement("canvas");
    let ctx = canvas.getContext("2d");
    canvas.width = size * mul;
    canvas.height = size * mul;
    canvas.style.imageRendering = "crisp-edges";
    document.body.appendChild(canvas);

    // lower index = newer
    // higher index = older
    let snake_tiles;
    let apple_tile;
    let xv, yv;
    let bxv, byv;

    const btns = [
        { code: "KeyW", text: "^", xv: 0, yv: -1 },
        { code: "KeyA", text: "<", xv: -1, yv: 0 },
        { code: "KeyS", text: "v", xv: 0, yv: 1 },
        { code: "KeyD", text: ">", xv: 1, yv: 0 },
    ];

    for (let i = 0; i < btns.length; i++) {
        let b = btns[i];

        let btn = document.createElement("button");
        btn.appendChild(document.createTextNode(b.text));
        btn.onclick = () => {
            if ((xv == b.xv && yv == b.yv) || (-xv == b.xv && -yv == b.yv)) return;

            bxv = b.xv;
            byv = b.yv;
        };
        document.body.appendChild(btn);
    }

    document.body.onkeydown = (e) => {
        for (let i = 0; i < btns.length; i++) {
            let b = btns[i];

            if (e.code == b.code) {
                if ((xv == b.xv && yv == b.yv) || (-xv == b.xv && -yv == b.yv)) return;

                bxv = b.xv;
                byv = b.yv;
                return;
            }
        }
    };

    function reset() {
        snake_tiles = [[Math.floor((size - 1) / 2), Math.floor((size - 1) / 2)]];
        xv = 0, yv = 0;
        bxv = 0, byv = 0;
        repos_apple();
    }
    reset();

    function repos_apple() {
        for (;;) {
            let x = Math.floor(Math.random() * size);
            let y = Math.floor(Math.random() * size);

            if (!snake_tiles.some(t => JSON.stringify(t) == JSON.stringify([x, y]))) {
                apple_tile = [x, y];
                break;
            }
        }
    }

    function tick() {
        xv = bxv; yv = byv;
        if (xv != 0 || yv != 0) {
            let t = structuredClone(snake_tiles[0]);
            t[0] = (t[0] + xv) % size;
            t[0] = t[0] >= 0 ? t[0] : size - 1;
            t[1] = (t[1] + yv) % size;
            t[1] = t[1] >= 0 ? t[1] : size - 1;

            snake_tiles.unshift(t);
            let jt = JSON.stringify(t);

            if (snake_tiles.slice(1).some(a => jt == JSON.stringify(a))) {
                reset();
            } else if (jt == JSON.stringify(apple_tile)) {
                repos_apple();
            } else {
                snake_tiles.pop();
            }
        }

        ctx.fillStyle = "black";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = "white";
        for (let i = 0; i < snake_tiles.length; i++) {
            let a = snake_tiles[i];
            let b = snake_tiles[i - 1];

            if (i - 1 < 0) {
                ctx.fillRect(a[0] * mul + pad, a[1] * mul + pad, mul - 2 * pad, mul - 2 * pad);
            } else if (b[0] < a[0]) {
                // next tile left
                ctx.fillRect(a[0] * mul - pad, a[1] * mul + pad, mul, mul - 2 * pad);
            } else if (b[0] > a[0]) {
                // next tile right
                ctx.fillRect(a[0] * mul + pad, a[1] * mul + pad, mul, mul - 2 * pad);
            } else if (b[1] < a[1]) {
                // next tile on top
                ctx.fillRect(a[0] * mul + pad, a[1] * mul - pad, mul - 2 * pad, mul);
            } else {
                // next tile on bottom
                ctx.fillRect(a[0] * mul + pad, a[1] * mul + pad, mul - 2 * pad, mul);
            }
        }

        ctx.fillStyle = "red";
        let rx = apple_tile[0] * mul, ry = apple_tile[1] * mul;
        ctx.fillRect(rx, ry, mul, mul);
    }

    setInterval(tick, 500);
}
