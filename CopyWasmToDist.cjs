const fs = require('fs')
const distPath = "dist/assets/wasm"
fs.mkdirSync(distPath)
const wasmContent = fs.readFileSync("./src/lib/wasm/libmupdf.wasm")
fs.writeFileSync(distPath + "/libmupdf.wasm", wasmContent)
