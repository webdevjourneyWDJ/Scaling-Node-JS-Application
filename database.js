const http = require('http')
const { LocalStorage } = require('node-localstorage');

const db = new LocalStorage('./data')

let requests = 0

const server = http.createServer((req, res) => {
    if (req.url === '/') {
        requests++
        console.log(`${process.pid}: ${requests}`)
        res.end(JSON.stringify(requests))
    }
})

server.listen(3000)
console.log(`counting requests`)
