/**
 * Created by jianchen on 2018/5/11.
 */
let spawn = require('child_process').spawn
let numCPUs = require("os").cpus().length;
let path = require('path');
var async = require('async')
let cluster = require('cluster')

let exec_file = path.resolve(__dirname,'processContainerFork.js');
cluster.setupMaster({
    windowsHide: true, // windows系统创建的进程关闭其console出来的内容
    exec : path.resolve(__dirname,'ProcessContainer.js')
});


console.log('exec_file',exec_file)

async.timesLimit(numCPUs, 1, function (n, next) {
    var cspr = spawn('node',['--harmony',exec_file],{
        detached:true,
        stdio    : ['pipe', 'pipe', 'pipe', 'ipc'] //Same as fork() in node core}
        });
    cspr.process = {};
    cspr.process.pid = cspr.pid;
    cspr.stderr.on('data',(err) => {
        console.log(err.toString())
    })
    cspr.unref();
    next(null, cspr)
})