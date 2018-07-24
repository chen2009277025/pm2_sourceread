/**
 * Created by jianchen on 2018/5/10.
 */
function fibo (n) {
  return n > 1 ? fibo(n - 1) + fibo(n - 2) : 1;
}
console.time('8 thread');
var numThreads= 8; //创建线程池，最大数为8
var threadPool= require('threads_a_gogo').createPool(numThreads).all.eval(fibo); //为线程池注册程序
var i=8;
var cb = function(err,data){ //注册线程执行完毕的回调函数
  console.log(data);
  if(!--i){
    threadPool.destroy();
    console.timeEnd('8 thread');
  }
}
threadPool.any.eval('fibo(40)', cb); //开始向线程池中执行fibo(40)这个任务

threadPool.any.eval('fibo(40)', cb);

threadPool.any.eval('fibo(40)', cb);

threadPool.any.eval('fibo(40)', cb);

threadPool.any.eval('fibo(40)', cb);

threadPool.any.eval('fibo(40)', cb);

threadPool.any.eval('fibo(40)', cb);

threadPool.any.eval('fibo(40)', cb);