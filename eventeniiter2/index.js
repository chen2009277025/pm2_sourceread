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
var EventEmitter2 = require('eventemitter2').EventEmitter2;
var server = new EventEmitter2({

  //
  // set this to `true` to use wildcards. It defaults to `false`.
  //
  wildcard: true,

  //
  // the delimiter used to segment namespaces, defaults to `.`.
  //
  delimiter: '::',

  //
  // set this to `true` if you want to emit the newListener event. The default value is `true`.
  //
  newListener: false,

  //
  // the maximum amount of listeners that can be assigned to an event, default 10.
  //
  maxListeners: 20,

  //
  // show event name in memory leak message when more than maximum amount of listeners is assigned, default false
  //
  verboseMemoryLeak: false
});

server.on('foo', function(value1, value2) {
  console.log(this.event, value1, value2);
});

server.emit('foo',12,12)