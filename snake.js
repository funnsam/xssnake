{
    let doc = document;
    let body = doc.body;
    let create_elem = (e) => doc.createElement(e);
    let math = Math;
    let json_stringify = (a) => JSON.stringify(a);

    body.innerHTML = "";
    body.style.textAlign = "center";
    body.style.font = "14pt monospace";
    body.style.height = doc.documentElement.style.height = "100%";

    let size = 10;
    let mul = 20;

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

    let btns = [
        { c: "W", t: "^", v: [0, -1] },
        { c: "A", t: "<", v: [-1, 0] },
        { c: "S", t: "v", v: [0, 1] },
        { c: "D", t: ">", v: [1, 0] },
    ];

    for (let i = 0; i < btns.length; i++) {
        let b = btns[i];

        let btn = create_elem("button");
        btn.style.width = btn.style.height = "4rem";
        btn.onclick = () => move_queue.push(b.v);
        btn.append(b.t);
        body.append(btn);

        if (i == 0) {
            btn.style.marginTop = "1rem";
            body.append(create_elem("br"));
        }
    }

    body.onkeydown = (e) => {
        for (let i = 0; i < btns.length; i++) {
            let b = btns[i];

            if (e.code == "Key" + b.c) {
                move_queue.push(b.v);
            }
        }
    };

    let score = create_elem("div");
    score.style.marginTop = "1rem";
    score.style.userSelect = "none";
    score.append(0);
    body.append(score);

    doc.querySelector("*").style.touchAction = "manipulation";

    let repos_apple = () => {
        score.innerText = `Score: ${snake_tiles.length - 1}`;

        for (;;) {
            let x = math.floor(math.random() * size);
            let y = math.floor(math.random() * size);

            if (!snake_tiles.some(t => json_stringify(t) == json_stringify([x, y]))) {
                apple_tile = [x, y];
                break;
            }
        }
    };

    let reset = () => {
        // snake_tiles = [[math.floor((size - 1) / 2), math.floor((size - 1) / 2)]];
        snake_tiles = [[4, 4]];
        xv = 0, yv = 0;
        move_queue = [];
        repos_apple();
    };
    reset();

    setInterval(() => {
        if (move_queue.length > 0) {
            let m = move_queue.shift();

            if (-xv != m[0] || -yv != m[1]) {
                xv = m[0]; yv = m[1];
            }
        }

        let t = structuredClone(snake_tiles[0]);
        t[0] = (t[0] + xv) % size;
        t[0] = t[0] >= 0 ? t[0] : size - 1;
        t[1] = (t[1] + yv) % size;
        t[1] = t[1] >= 0 ? t[1] : size - 1;

        snake_tiles.unshift(t);
        let jt = json_stringify(t);

        if (jt == json_stringify(apple_tile)) {
            repos_apple();
        } else {
            snake_tiles.pop();
        }

        if (snake_tiles.slice(1).some(a => jt == json_stringify(a))) {
            reset();
        }

        ctx.fillStyle = body.style.background = "#24273a";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        canvas.style.border = "1px solid" + (ctx.fillStyle = score.style.color = "#cad3f5");

        let b;
        for (let i = 0; i < snake_tiles.length; i++) {
            let a = snake_tiles[i];

            if (b) {
                let xd = b[0] - a[0];
                let yd = b[1] - a[1];
                let order = math.abs(xd) > math.abs(yd);
                ctx.fillRect(
                    a[0] * mul - (order ? 2 * (xd == -1 || xd > 1) - 1 : -1),
                    a[1] * mul - (order ? -1 : 2 * (yd == -1 || yd > 1) - 1),
                    mul - (order ? 0 : 2),
                    mul - (order ? 2 : 0),
                );
            } else {
                ctx.fillRect(a[0] * mul + 1, a[1] * mul + 1, mul - 2, mul - 2);
            }

            b = a;
        }

        ctx.fillStyle = "#ed8796";
        let rx = apple_tile[0] * mul, ry = apple_tile[1] * mul;
        ctx.fillRect(rx, ry, mul, mul);
    }, 500);
}
