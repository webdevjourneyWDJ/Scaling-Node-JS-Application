const http = require('http');
const cluster = require('cluster');
const numCPUs = require('os').cpus().length

if(cluster.isMaster){
  console.log("this is the master process:", process.pid);
  for(let i=0; i<numCPUs; i++){
    cluster.fork()
  }
}else{
  http.createServer((req, res) => {
    const message = `Worker: ${process.pid}`;
    console.log(message);
    res.end(message)
  }).listen(3000)
}
