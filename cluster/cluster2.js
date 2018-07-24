/**
 * Created by jianchen on 2018/5/11.
 */
let cluster = require('cluster');
let http = require('http');
let numCPUs = require("os").cpus().length;

if (cluster.isMaster) {
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }
} else {
  http.createServer(function(req, res) {
    res.writeHead(200);
    res.end('process ' + process.pid + ' port: 8001 says hello!');
  }).listen(8001);
}