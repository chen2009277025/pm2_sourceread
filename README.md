##前言
笔者当前看的PM2版本是：2.10.3，可能阅读过早期PM2源码的同学了解到那时候PM2中有Satan和God，但是笔者的这个版本中虽然Satan依然存在目录结构中，但是并没有任何文件“愿意”引入这个“恶魔”。笔者认为Satan已经被废弃使用了，抱着求证的态度想去PM2的git社区找大神求证一下，结果苦于笔者只过了四级的英语水平还是果断放弃了(应该还是求知欲还是不够强，哎，不管了)。如果有得到求证的童鞋可以告知我。

Javascript是单进程单线程的语言。node是对Chrome浏览器引擎V8的服务端实现。为了充分的利用服务端多核CPU的机器性能，node提出Cluster（集群）模式的多进程方式启动程序，因此node是多进程单线程的框架。在服务端，为保证服务稳定性，需要对进程健康状况进行监控，为此市场上有很多类似框架forever、PM2、supervisor。具体三者的比较，笔者没有做过深入的研究。笔者使用pm2是因为pm2监控做得比较好，开源社区比较活跃，开发入手方便简单。以下网络上对三者的比较：

- supervisor 是开发环境用。

- forever 管理多个站点，每个站访问量不大，不需要监控。

- pm2 网站访问量比较大，需要完整的监控界面。

##话题引入
1. 什么是单线程程序、多线程程序？
>首先了解单线程程序，每个正在运行的程序（即进程），至少包括一个线程，这个线程叫主线程，主线程在程序启动时被创建，用于执行main函数，只有一个主线程的程序，称作单线程程序。多线程程序：拥有多个线程的程序，称作多线程程序。

2. 单、多线程的优缺点？
>单线程程序：只有一个线程，代码顺序执行，容易出现代码阻塞（页面假死），多线程程序：有多个线程，线程间独立运行，能有效地避免代码阻塞，并且提高程序的运行性能

3. 真多线程？
>机器性能迅速提升，多核cpu的普及，真多线程才真正发挥效力。
4. Node如何利用多进程?
>Nodejs是单线程运行的，这也是它经常被吐槽的一个点。针对这个点，Node推出了Cluster这个模块，用于创建多进程的Node应用。nodejs的特点：善于I/O，不善于计算。因为Node.js最擅长的就是任务调度，如果你的业务有很多的CPU计算，实际上也相当于这个计算阻塞了这个单线程，就不适合Node开发。利用多核，解决多CPU资源浪费的问题。每一个核CPU就是个独立node进程，每个node进程独立提供单次服务。cluster能实现多进程，添加上监听可以实现错误重启。

##PM2常用命令
和大多数介绍工具的文章一样，先安利一波工具能做的事，以下是PM2常用的命令，算是帮助回忆。

| 命令 | 作用 |
| :-- |---- | --- |
| pm2 start app.js | 启动app.js应用程序 |
| pm2 start app.js -i 4 | cluster mode 模式启动4个app.js的应用实例， 4个应用程序会自动进行负载均衡 |
| pm2 start app.js --name="api" | 启动应用程序并命名为 "api" |
| pm2 start app.js --watch | 当文件变化时自动重启应用 |
| pm2 start script.sh | 启动 bash 脚本 |
| pm2 list | 列表 PM2 启动的所有的应用程序 |
| pm2 monit | 显示每个应用程序的CPU和内存占用情况 |
| pm2 show [app-name] | 显示应用程序的所有信息 |
| pm2 logs | 显示所有应用程序的日志 |
| pm2 logs [app-name] | 显示指定应用程序的日志 |
| pm2 flush | 刷新日志 |
| pm2 stop all | 停止所有的应用程序 |
| pm2 stop 0 | 停止 id为 0的指定应用程序 | 
| pm2 restart all | 重启所有应用 |
| pm2 reload all | 重启 cluster mode下的所有应用 |
| pm2 gracefulReload all | Graceful reload all apps in cluster mode | 
| pm2 delete all | 关闭并删除所有应用 |
| pm2 delete 0 | 删除指定应用 id 0 |
| pm2 scale api 10 | 把名字叫api的应用扩展到10个实例 |
| pm2 reset [app-name] | 重置重启数量 |
| pm2 startup | 创建开机自启动命令 |
| pm2 update |Save processes, kill PM2 and restore processes |

当然PM2不仅仅局限于这些命令还有很多高级的命令比如自带的deploy，Docker模式等。这块公司有专人提供了更可靠的部署方式，笔者没有过多的接触。因此接下来笔者也只对PM2的这些常用命令涉及的源代码进行分析。

##PM2源码分析
###准备工作
以下文章的分析中笔者尽可能的少粘贴代码，多画流程图和大家一起探讨PM2源码。为了让大家能快速理解PM2的工作原理，笔者已经将PM2的源码添加了注释，只需要克隆下笔者代码，然后跟着笔者的流程图便可快速了解PM2的工作原理。

笔者git仓库：http://git.sankuai.com/users/chenjianhui/repos/pm2-source-read/browse。

通过这份代码你可以清晰的看到PM2的执行流程：

![](http://s0.meituan.net/bs/tempfs/file/chenjianhui/image.png)

###PM2 Cli实现方式
读任何源代码都要找到代码源头，PM2也一样。PM2源代码下的bin目录里面的pm2文件便是PM2暴露出来的可执行文件(如下图)。

![](http://s0.meituan.net/bs/tempfs/file/chenjianhui/files.png)

除此之外还能看见有pm2-docker是PM2 的Docker模式。

PM2中最简单的一条启动指令pm2 start app.js便可利用PM2启动程序，PM2中Cli的实现是利用commandjs来实现的，不了解commandjs同学可以去npm仓库搜一下可以了解一下它的基本用法，这里不做深入探索。

###PM2启动之谜
在这个bin文件中注册了所有pm2的可执行命令,其中包括start命令，下面是启动命令的部分截图，这里便是PM2源码的阅读的切入点。

```
commander.command('start <file|json|stdin|app_name|pm_id...>')
  .option('--watch', 'Watch folder for changes')
  .option('--fresh', 'Rebuild Dockerfile')
  .option('--daemon', 'Run container in Daemon mode (debug purposes)')
  .option('--container', 'Start application in container mode')
  .option('--dist', 'with --container; change local Dockerfile to containerize all files in current directory')
  .option('--image-name [name]', 'with --dist; set the exported image name')
  .option('--node-version [major]', 'with --container, set a specific major Node.js version')
  .option('--dockerdaemon', 'for debugging purpose')
  .description('start and daemonize an app')
  ... // 此处省略若干行
   else {
      // Commander.js patch
      cmd = patchCommanderArg(cmd);
      async.forEachLimit(cmd, 1, function(script, next) {
        pm2.start(script, commander, next); // 入口
      }, function(err) {
        pm2.speedList(err ? 1 : 0);
      });
    }
```
    
在这里我们看到了pm2可执行命令调用了API的start方法，这便是阅读PM2源码的切入点。进入到API内部，如果你已经下载了笔者的GIT代码，那么很容易就能知道这过程做了什么。

在阅读API的整个过程中会发现PM2很多的操作都是调用executeRemote将操作交给了Daemon执行，API的Client自身并没有太多实际意义上的启动操作。关于PM2的启动笔者分成了Client端和Daemon端讲解，为了不让大家疑惑Client和Daemon到底是什么。所以先在这里讲解一下Client、Daemon在PM2里分别是什么？

Daemon(后台驻留程序),正如它自己的名字一样，它是后台专门负责进程管理的守护进程。

Client(执行启动进程的进程)，如果我们是用控制台来启动，那么这个Client时候可以理解为当前执行命令的这个进程。一般这个Client执行完就被销毁了。

举个小例子如果一台服务器，同时有四个用户登录上去，并在那台机器上分别执行自己的启动命令这时候就会有四个Client同时去和Daemon产生通信，通信如下图。
![](http://s0.meituan.net/bs/tempfs/file/chenjianhui/drawio.svg)

当然Daemon进程也不是一直都存在的，只有当Client去pingDaemon的时候发现没有Daemon的时候，会Clustor方式产生一个Daemon进程。

Client和Daemon刨除一些配置先关和方法相关和启动进程相关的核心模块我整理如下：
![](http://s0.meituan.net/bs/tempfs/file/chenjianhui/client_deamon.svg)

- RPC连接了Client和Daemon
- Client通过RPC利用executeRemote将命令传递给Daemon进行执行，自身利用 CliUx实现可视化视图。
- Daemon执行executeApp启动进程，执行Worker进行监听，同时维护一个进程池clusters_db。

###Client启动流程
当执行命令时，PM2程序内部在Client端执行如下图：
![](http://s0.meituan.net/bs/tempfs/file/chenjianhui/client.svg)

整体上总结为三个步骤：

1. 配置处理，无论是脚本方式启动或者文件方式启动，都要先对启动参数进行处理。

2. 建立RPC通信，守护线程和客户端之间通信的建立。

3. 启动服务，根据输入的应用列表启动服务。

其中start方法定义如下：

```
API.prototype.start = function(cmd, opts, cb) {
  if (typeof(opts) == "function") {
    cb = opts;
    opts = {};
  }
  if (!opts)
    opts = {};
​
  var that = this;
​
  if (util.isArray(opts.watch) && opts.watch.length === 0)
    opts.watch = (opts.rawArgs ? !!~opts.rawArgs.indexOf('--watch') : !!~process.argv.indexOf('--watch')) || false;
​
  if (Common.isConfigFile(cmd) || (typeof(cmd) === 'object')) {
    // 以文件方式启动
    that._startJson(cmd, opts, 'restartProcessId', cb);
  }
  else {
    // 以脚本方式启动
    that._startScript(cmd, opts, cb);
  }
};
```

正如流程图中所示一样根据控制台的输入判断出是什么方式启动程序。在处理完成参数之后都通过RPC传递相信信号告知Daemon执行启动。

daemon_mod是做什么用的?

>daemon_mod和非daemon_mod的区别在于是否用当前执行脚本的线程作为守护线程。一般这个参数默认是true的，如果先尝试看看效果的话可以在执行命令后面添加“--no-daemon”。这种模式下如果你是控制台执行的话，除非用了nohub方式，否则退出控制台

##Daemon启动流程
以上是执行start命令Client脚本执行所做的一系列操作，我刻意将Daemon在start时的执行部分排除在外，一方面因为Daemon启动依然是一个比较复杂的过程，另一方面Client的流程已经足够复杂。

为了更好的理解Daemon的执行流程，我们先来看一下Daemon的代码框架：
![](http://s0.meituan.net/bs/tempfs/file/chenjianhui/deamon.svg)

上图可以看出Daemon引入了很多库来完成自己的功能，另外引入了核心脚本God。接下来看Daemon启动流程便能清楚这过程中Daemon都做了什么。
![](http://s0.meituan.net/bs/tempfs/file/chenjianhui/deamon-2.svg)

Daemon启动工作中主要进行了以下几项工作：

- 进行了RPC和PUB通信的端口的监听

- Server方法注册

- Worker启动，worker是Daemon中用来监控内容变更和内存变化的轮训方法

看上去Daemon的启动没有那么复杂的逻辑需要判断，似乎让Daemon的身价变得低廉，但实时却并非如此，正如真正有实力的高手都显得低调。Daemon的能力在有Client连接上来开始发挥它真正的实力。

Server方法注册代码段：

```
server.expose({
    killMe                  : that.close.bind(this),
    snapshotPM2             : snapshotPM2,
    profileStart            : startProfilingPM2,
    profileStop             : stopProfilingPM2,
    prepare                 : God.prepare,
    getMonitorData          : God.getMonitorData,
    getSystemData           : God.getSystemData,
​
    startProcessId          : God.startProcessId,
    stopProcessId           : God.stopProcessId,
    restartProcessId        : God.restartProcessId,
    deleteProcessId         : God.deleteProcessId,
​
    ... // 篇幅受限作者不再这里粘贴搜索代码
​
    ping                    : God.ping,
    getVersion              : God.getVersion,
    getReport               : God.getReport,
    reloadLogs              : God.reloadLogs
  });
```  
  
这些方法如此眼熟，因为它们就是之前提到的Client通过executeRemote通知Server做的工作。也就是说Client在启动时是通知Server执行God中restartProcessId启动了对应进程，并将进程信息返回给Client完成了启动操作。

God中prepare方法的实现
如下是God的ActionMethod中prepare方法是如何实现的,因为这个方法是检测到程序未启动时，真正通知God启动进程的方法。

```
God.prepare = function prepare (env, cb) {
  // if the app is standalone, no multiple instance
  if (typeof env.instances === 'undefined') {
    env.vizion_running = false;
    if (env.env && env.env.vizion_running) env.env.vizion_running = false;
​
    return God.executeApp(env, function (err, clu) {
      if (err) return cb(err);
      God.notify('start', clu, true);
      return cb(null, [ Utility.clone(clu) ]);
    });
  }
​
  // find how many replicate the user want
  env.instances = parseInt(env.instances);
  if (env.instances === 0) {
    env.instances = numCPUs;
  } else if (env.instances < 0) {
    env.instances += numCPUs;
  }
  if (env.instances <= 0) {
    env.instances = 1;
  }
​
  async.timesLimit(env.instances, 1, function (n, next) {
    env.vizion_running = false;
    if (env.env && env.env.vizion_running) {
      env.env.vizion_running = false;
    }
​
    God.injectVariables(env, function inject (err, _env) {
      if (err) return next(err);
      return God.executeApp(Utility.clone(_env), function (err, clu) {
        if (err) return next(err);
        // 给bus（eventEmitter）发送启动事件
        God.notify('start', clu, true);
        // here call next wihtout an array because
        // async.times aggregate the result into an array
        return next(null, Utility.clone(clu));
      });
    });
  }, cb);
};
```

上面代码调用executeApp执行程序启动，因为executeApp代码段太长，笔者这里用流程图描述内部具体执行过程：

![](http://s0.meituan.net/bs/tempfs/file/chenjianhui/execApp.svg)

在这里真正的将从Client那边传进来的执行脚本(如app.js)用对应的启动模式启动进程,并在进程的监听事件如error、exit、connect等上挂载了对应的方法用来监听进程的状态。

nodeApp和forkMode都依赖cluster先启动需要执行的脚本，这里比较有意思的是这里PM2并没有真正用配置的script作为启动脚本。

```
cluster.setupMaster({
  windowsHide: true, // windows系统创建的进程关闭其console出来的内容
  exec : path.resolve(path.dirname(module.filename), 'ProcessContainer.js')
});
ProcessContainer里面定义了一个exec方法执行我们传进去的script：

var script      = pm2_env.pm_exec_path;
... // 省略若干行代码
exec(script, stds);
... // 省略若干行代码
require('module')._load(script, null, true);
```

关于Fork和Spawn的启动进程的区别在Nodejs官网给出了如下的解释：

child_process.fork() 方法是 child_process.spawn() 的一个特殊情况，专门用于衍生新的 Node.js 进程。
跟 child_process.spawn() 一样返回一个 ChildProcess 对象。 返回的 ChildProcess 会有一个额外的内置的通信通道，它允许消息在父进程和子进程之间来回传递。 
详见 subprocess.send()。
在subprocess.send()方法中找到了对应的解释：

当父进程和子进程之间建立了一个 IPC 通道时（例如，使用 child_process.fork()），subprocess.send() 方法可用于发送消息到子进程。
当子进程是一个 Node.js 实例时，消息可以通过 process.on('message') 事件接收。
一般使用PM2就是要利用PM2充分的利用CPU，所以一般都使用cluster启动一个集群。

PM2 结束进程的秘密
已经看完上面内容的同学应该很清楚PM2启动都做了些什么，那么接下来我们看一下PM2在执行pm2 kill时都做了什么。以下是PM2kill命令执行图:
![](http://s0.meituan.net/bs/tempfs/file/chenjianhui/pm2kill.svg)

正如上图所示，在关闭操作时Client和连接一样，自身只把RPC相关的端口关闭，然后给Daemon发送一个通知让Daemon将自己对应的进程杀掉。

PM2 reload都做了什么？

```
API.prototype.reload = function(process_name, opts, cb) {
  var that = this;
​
  if (typeof(opts) == "function") {
    cb = opts;
    opts = {};
  }
​
  var delay = Common.lockReload();
​
  if (delay > 0 && opts.force != true) {
    Common.printError(conf.PREFIX_MSG_ERR + 'Reload already in progress, please try again in ' + Math.floor((conf.RELOAD_LOCK_TIMEOUT - delay) / 1000) + ' seconds or use --force');
    return cb ? cb(new Error('Reload in progress')) : that.exitCli(conf.ERROR_EXIT);
  }
​
  if (Common.isConfigFile(process_name))
    that._startJson(process_name, opts, 'reloadProcessId', function(err, apps) {
      Common.unlockReload();
      if (err)
        return cb ? cb(err) : that.exitCli(conf.ERROR_EXIT);
      return cb ? cb(null, apps) : that.exitCli(conf.SUCCESS_EXIT);;
    });
  else {
    if (opts && !opts.updateEnv)
      Common.printOut(IMMUTABLE_MSG);
​
    that._operate('reloadProcessId', process_name, opts, function(err, apps) {
      Common.unlockReload();
​
      if (err)
        return cb ? cb(err) : that.exitCli(conf.ERROR_EXIT);
      return cb ? cb(null, apps) : that.exitCli(conf.SUCCESS_EXIT);;
    });
  }
};
```

在看了代码之后我们发现PM2的reload方法和启动方法所做的操作差不多，虽然很多博客号称0ms启动，但是如果你的程序里面有一些重启影响类的操作还是值得注意一下。

进程的管理者Worker
Daemon启动时启动

文件版本监控-内存监控；文件版本监控一般不使用，会根据执行目录的git、svn等版本信息检查是否remote远端分支有最新代码。内存监控是在内存占用超过一定占比执行进程重启。

setInterval 默认30秒执行一次检查。

God中Woker工作任务启动：

```
require('./Worker.js')(God);
setTimeout(function() {
  readLog('God 工作任务Work启动，worker脚本主要用来实时更新版本，内存的监控');
  God.Worker.start();
}, 500);
Worker工作内容：

var tasks = function() {
    if (God.Worker.is_running === true) {
      debug('[PM2][WORKER] Worker is already running, skipping this round');
      return false;
    }
    God.Worker.is_running = true;
    readLog('God自身调用getMonitorData')
    God.getMonitorData(null, function(err, data) {
      if (err || !data || typeof(data) !== 'object') {
        God.Worker.is_running = false;
        return console.error(err);
      }
​
      async.eachLimit(data, 1, function(proc_key, next) {
        if (!proc_key ||
            !proc_key.pm2_env ||
            proc_key.pm2_env.pm_id === undefined)
          return next();
​
        debug('[PM2][WORKER] Processing proc id:', proc_key.pm2_env.pm_id);
​
        versioningRefresh(proc_key, function() {
          maxMemoryRestart(proc_key, function() {
            return next();
          });
        });
      }, function(err) {
        God.Worker.is_running = false;
        readLog('[PM2][WORKER] My job here is done, next job in %d seconds', parseInt(cst.WORKER_INTERVAL / 1000))
        debug('[PM2][WORKER] My job here is done, next job in %d seconds', parseInt(cst.WORKER_INTERVAL / 1000));
      });
    });
  };
```  

##其他PM2用到的模块
###pm2-axon
pm2-axon是PM2在axon上实现了一层封装后的实现，实现了类似以文件为监听对象，笔者没有详细去阅读这部分代码。根据axon官方网站的例子写了一个关于axon和pm2-axon的例子，可以帮助大家理解这两者的区别。
###Vizion
版本比较的工具，可用来比较git、svn等版本工具的本地分支与远端分支文件是否存在差异。
###os
用来获取设备物理信息的包，可获得内存使用情况，硬件信息、用户信息等。
###Keymetrics
图形化监控系统，貌似是PM2自己维护的官方工具。
###domain
按照字面意思：执行主函数。这个包提供run方法，在run方法内执行所抛出的一场会被domain上监听的error的事件处理，避免程序因为错误崩溃。
###shelljs
想执行shell一样执行js的工具。

###v8profiler
可获得js执行引擎快照的工具。