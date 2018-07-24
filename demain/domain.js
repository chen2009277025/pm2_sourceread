/**
 *
 *
 *                 *                #                                                   #
 *                #                       _oo0oo_                     #
 *                #                      o8888888o                    #
 *                #                      88" . "88                    #
 *                #                      (| -_- |)                    #
 *                #                      0\  =  /0                    #
 *                #                    ___/`---'\___                  #
 *                #                  .' \\|     |# '.                 #
 *                #                 / \\|||  :  |||# \                #
 *                #                / _||||| -:- |||||- \              #
 *                #               |   | \\\  -  #/ |   |              #
 *                #               | \_|  ''\---/''  |_/ |             #
 *                #               \  .-\__  '-'  ___/-. /             #
 *                #             ___'. .'  /--.--\  `. .'___           #
 *                #          ."" '<  `.___\_<|>_/___.' >' "".         #
 *                #         | | :  `- \`.;`\ _ /`;.`/ - ` : | |       #
 *                #         \  \ `_.   \_ __\ /__ _/   .-` /  /       #
 *                #     =====`-.____`.___ \_____/___.-`___.-'=====    #
 *                #                       `=---='                     #
 *                #     ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~   #
 *                #                                                   #
 *                #               佛祖保佑         永无BUG            #
 *                #                                                   #
 *                 *
 * Created by jianchen on 2018/5/24.
 */
/***
 * 好忧桑的翻译，凑合着看吧
 * Domains provide a way to handle multiple different IO operations as a single group. If any of the event emitters(发出) or callbacks(回收) registered to a domain emit an 'error' event, or throw an error, then the domain object will be notified(通告), rather than losing the context of the error in the process.on('uncaughtException') handler, or causing the program to exit immediately with an error code.
 * domain 将系列io操作划分成组的方式进行处理，如果任何事件或者回调注册在domain的error事件上，当错误触发时将会通知到domain的错误处理上，
 * 不会被上下文忽略（这种方式之前一般用process.on('uncaughtException')解决）或者引起程序崩溃
 */

var domain = require('domain');
var fs = require('fs');
const d = domain.create();

function readSomeFile(filename, cb) {
  fs.readFile(filename, 'utf8', d.bind((er, data) => {
    // if this throws, it will also be passed to the domain
    if(er) throw er;
    return cb(er, data ? JSON.parse(data) : null);
  }));
}

d.on('error', (er) => {
  // an error occurred somewhere.
  // if we throw it now, it will crash the program
  // with the normal line number and stack message.
  console.log(er)
});

readSomeFile('sd', function (err, data) {
  console.log('err', err)
});

fs.readFile('sd', 'utf8', (err, data) => {
  if(err) throw err;
  // if this throws, it will also be passed to the domain
  return data;
});

