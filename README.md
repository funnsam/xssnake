# XSSnake — pure JS snake in >2000 bytes for XSS demonstration
## Controls
`WASD` or on-screen buttons

## Loading
If you prefer a smaller payload / site allows cross origin scripts:
```js
let s=document.createElement('script');s.src='https://funn.is-a.dev/xssnake/snake.js';document.head.appendChild(s)
```

If you don't want to load scripts from script / site doesn't allow cross origin scripts, paste in the entire compressed source from [here](https://funn.is-a.dev/xssnake/snake.js).
