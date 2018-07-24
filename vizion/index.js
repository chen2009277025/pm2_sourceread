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
 * Created by jianchen on 2018/5/25.
 */
var vizion = require('vizion');

/**
 * Grab metadata for svn/git/hg repositories
 */
console.log('process.cwd()',`${process.cwd()}/../`)
/***
 * 因为我的当前执行目录没有git仓库的索引，所以指到外层去做
 */
vizion.analyze({
  folder :`${process.cwd()}/../`
}, function(err, meta) {
  if (err) throw new Error(err);
  console.log(meta)
});
//
// /**
//  * Check if a local repository is up to date with its remote
//  */
// vizion.isUpToDate({
//   folder : '/tmp/folder'
// }, function(err, meta) {
//   if (err) throw new Error(err);
//
//   /**
//    *
//    * meta = {
//    *   is_up_to_date    : false,
//    *   new_revision     : '6d6932dac9c82f8a29ff40c1d5300569c24aa2c8'
//    *   current_revision : 'f0a1d45936cf7a3c969e4caba96546fd23255796'
//    * }
//    *
//    */
// });
//
// /**
//  * Update the local repository to latest commit found on the remote for its current branch
//  * - on fail it rollbacks to the latest commit
//  */
// vizion.update({
//   folder : '/tmp/folder'
// }, function(err, meta) {
//   if (err) throw new Error(err);
//
//   /**
//    *
//    * meta = {
//    *   success           : true,
//    *   current_revision  : '6d6932dac9c82f8a29ff40c1d5300569c24aa2c8'
//    * }
//    *
//    */
// });
//
// /**
//  * Revert to a specified commit
//  * - Eg: this does a git reset --hard <commit_revision>
//  */
// vizion.revertTo({
//   revision : 'f0a1d45936cf7a3c969e4caba96546fd23255796',
//   folder   : '/tmp/folder'
// }, function(err, data) {
//   if (err) throw new Error(err);
//
//   /**
//    *
//    * data = {
//    *   success          : true,
//    * }
//    *
//    */
// });
//
// /**
//  * If a previous commit exists it checkouts on it
//  */
// vizion.prev({
//   folder : '/tmp/folder'
// }, function(err, meta) {
//   if (err) throw new Error(err);
//
//   /**
//    *
//    * meta = {
//    *   success           : true,
//    *   current_revision  : '6d6932dac9c82f8a29ff40c1d5300569c24aa2c8'
//    * }
//    *
//    */
// });
//
// /**
//  * If a more recent commit exists it chekouts on it
//  */
// vizion.next({
//   folder : '/tmp/folder'
// }, function(err, meta) {
//   if (err) throw new Error(err);
//
//   /**
//    *
//    * meta = {
//    *   success           : false,
//    *   current_revision  : '6d6932dac9c82f8a29ff40c1d5300569c24aa2c8'
//    * }
//    *
//    */
// });
