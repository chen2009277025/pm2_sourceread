/**
 * Copyright 2013 the PM2 project authors. All rights reserved.
 * Use of this source code is governed by a license that
 * can be found in the LICENSE file.
 */

var pm2      = require('../../..');
var domain   = require('domain');
var Utility  = require('../../Utility.js');

var d = domain.create();

d.once('error', function(err) {
  process.send(JSON.stringify({err: err.stack, isFinished : true}));
});

d.run(function() {
  var params = JSON.parse(process.env.fork_params);

  console.log('Executing: pm2 %s %s',
              params.action,
              params.opts.args ? params.opts.args.join(' ') : '');

  pm2.connect(function() {
    pm2.remoteV2(params.action, params.opts, function(err, dt) {
      process.send(JSON.stringify(Utility.clone({
        err: err,
        dt: dt,
        isFinished : true
      })));
      pm2.disconnect(process.exit);
    });
  });
});
