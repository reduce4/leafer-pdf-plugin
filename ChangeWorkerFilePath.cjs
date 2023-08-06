const fs = require('fs')
const change = (path) => {
    const fileContent = fs.readFileSync(path, 'utf-8')
    const c = fileContent.replace(/\/assets\/(MuWorker.*?\.js)/g, (_, $1) => {
        return `node_modules/leafer-pdf-plugin/dist/assets/${$1}`;
    })
    fs.writeFileSync(path, c)
}
change('dist/leafer-pdf-plugin-lib.es.js')
change('dist/leafer-pdf-plugin-lib.umd.js')