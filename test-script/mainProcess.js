/**
 * Created by jianchen on 2018/5/9.
 */

let {execFile} = require('child_process');
//
// const startServer = async () => {
//   const {stderr, stdout} = execFile('nvm',['use v8.6.0'], {cwd: '/Users/jianchen/workspace/react-webstorm/helloka2'});
//   // const {stderr1, stdout1} = execFile('npm',['start'], {cwd: '/Users/jianchen/workspace/react-webstorm/helloka2'});
//   if(stderr) {
//     console.log('stderr',stderr);
//     return;
//   }
//   console.log('stdout', stdout)
// }
//
// startServer();

var ls = execFile('bash',['startServer.sh'], (err, stdout, stderr) => {
  if(err){
    throw err;
  }
  console.log(stdout);
  console.log(stderr)
  execFile('npm',['start'], (err, stdout, stderr) => {
    if(err){
      throw err;
    }
    console.log(stdout);
    console.log(stderr)
  });
});


