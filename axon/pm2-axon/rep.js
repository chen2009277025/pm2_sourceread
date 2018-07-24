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
 * Created by jianchen on 2018/5/15.
 */
var axon = require('pm2-axon');
var sock = axon.socket('rep');
var path = require('path')
var fs = require('fs')
let pub_socket_file = path.resolve('./','sock.file')

sock.connect(pub_socket_file);

sock.on('message', function(task, username, reply){
  // resize the image
  switch (task){
    case 'hello world':
      reply('hello '+ username);
      break;
    case 'bye bye':
      reply('滚:'+username);
      break;
  }
});