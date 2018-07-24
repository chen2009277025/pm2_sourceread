/**
 * Created by jianchen on 2018/5/11.
 */
let cluster = require('cluster');
let http = require('http');
let numCPUs = require("os").cpus().length;
let path = require('path')

cluster.setupMaster({
    windowsHide: true, // windows系统创建的进程关闭其console出来的内容
    exec : path.resolve(__dirname,'ProcessContainer.js')
});

for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
}