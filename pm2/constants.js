/**
 * Copyright 2013 the PM2 project authors. All rights reserved.
 * Use of this source code is governed by a license that
 * can be found in the LICENSE file.
 */

var debug  = require('debug')('pm2:conf');
var p      = require('path');
var util   = require('util');
var chalk  = require('chalk');
var semver = require('semver');

/**
 * Get PM2 path structure
 */
var path_structure = require('./paths.js')(process.env.OVER_HOME);

/**
 * Constants variables used by PM2
 */
var csts = {
  PREFIX_MSG              : chalk.green('[PM2] '),
  PREFIX_MSG_ERR          : chalk.red('[PM2][ERROR] '),
  PREFIX_MSG_MOD          : chalk.bold.green('[PM2][Module] '),
  PREFIX_MSG_MOD_ERR      : chalk.red('[PM2][Module][ERROR] '),
  PREFIX_MSG_WARNING      : chalk.yellow('[PM2][WARN] '),
  PREFIX_MSG_SUCCESS      : chalk.cyan('[PM2] '),

  TEMPLATE_FOLDER         : p.join(__dirname, 'lib/templates'),

  APP_CONF_DEFAULT_FILE   : 'ecosystem.json',
  APP_CONF_TPL            : 'ecosystem.tpl',
  APP_CONF_TPL_SIMPLE     : 'ecosystem-simple.tpl',
  SAMPLE_CONF_FILE        : 'sample-conf.js',
  LOGROTATE_SCRIPT        : 'logrotate.d/pm2',

  DOCKERFILE_NODEJS       : 'Dockerfiles/Dockerfile-nodejs.tpl',
  DOCKERFILE_JAVA         : 'Dockerfiles/Dockerfile-java.tpl',
  DOCKERFILE_RUBY         : 'Dockerfiles/Dockerfile-ruby.tpl',

  SUCCESS_EXIT            : 0,
  ERROR_EXIT              : 1,
  CODE_UNCAUGHTEXCEPTION  : 1,

  IS_WINDOWS              : (process.platform === 'win32' || process.platform === 'win64'),
  ONLINE_STATUS           : 'online',
  STOPPED_STATUS          : 'stopped',
  STOPPING_STATUS         : 'stopping',
  LAUNCHING_STATUS        : 'launching',
  ERRORED_STATUS          : 'errored',
  ONE_LAUNCH_STATUS       : 'one-launch-status',

  CLUSTER_MODE_ID         : 'cluster_mode',
  FORK_MODE_ID            : 'fork_mode',

  LOW_MEMORY_ENVIRONMENT  : process.env.PM2_OPTIMIZE_MEMORY || false,

  KEYMETRICS_ROOT_URL     : process.env.KEYMETRICS_NODE || 'root.keymetrics.io',
  KEYMETRICS_BANNER       : '../lib/motd',
  KEYMETRICS_UPDATE       : '../lib/motd.update',
  DEFAULT_MODULE_JSON     : 'package.json',

  REMOTE_PORT_TCP         : isNaN(parseInt(process.env.KEYMETRICS_PUSH_PORT)) ? 80 : parseInt(process.env.KEYMETRICS_PUSH_PORT),
  REMOTE_PORT             : 41624,
  REMOTE_HOST             : 's1.keymetrics.io',
  SEND_INTERVAL           : 1000,
  RELOAD_LOCK_TIMEOUT     : parseInt(process.env.PM2_RELOAD_LOCK_TIMEOUT) || 30000,
  GRACEFUL_TIMEOUT        : parseInt(process.env.PM2_GRACEFUL_TIMEOUT) || 8000,
  GRACEFUL_LISTEN_TIMEOUT : parseInt(process.env.PM2_GRACEFUL_LISTEN_TIMEOUT) || 3000,
  LOGS_BUFFER_SIZE        : 8,
  CONTEXT_ON_ERROR        : 2,
  AGGREGATION_DURATION    : process.env.PM2_DEBUG || process.env.NODE_ENV === 'local_test' || process.env.NODE_ENV === 'development' ? 3000 : 5 * 60000,
  TRACE_FLUSH_INTERVAL    : process.env.PM2_DEBUG || process.env.NODE_ENV === 'local_test' ? 1000 : 60000,

  // Concurrent actions when doing start/restart/reload
  CONCURRENT_ACTIONS      : (function() {
    var default_concurrent_actions = 1;
    if (semver.satisfies(process.versions.node, '>= 4.0.0'))
      default_concurrent_actions = 2;
    var concurrent_actions = parseInt(process.env.PM2_CONCURRENT_ACTIONS) || default_concurrent_actions;
    debug('Using %d parallelism (CONCURRENT_ACTIONS)', concurrent_actions);
    return concurrent_actions;
  })(),

  DEBUG                   : process.env.PM2_DEBUG || false,
  WEB_IPADDR              : process.env.PM2_API_IPADDR || '0.0.0.0',
  WEB_PORT                : parseInt(process.env.PM2_API_PORT)  || 9615,
  WEB_STRIP_ENV_VARS      : process.env.PM2_WEB_STRIP_ENV_VARS || false,
  MODIFY_REQUIRE          : process.env.PM2_MODIFY_REQUIRE || false,

  WORKER_INTERVAL         : process.env.PM2_WORKER_INTERVAL || 30000,
  KILL_TIMEOUT            : process.env.PM2_KILL_TIMEOUT || 1600,
  PM2_PROGRAMMATIC        : typeof(process.env.pm_id) !== 'undefined' || process.env.PM2_PROGRAMMATIC,
  PM2_LOG_DATE_FORMAT     : process.env.PM2_LOG_DATE_FORMAT !== undefined ? process.env.PM2_LOG_DATE_FORMAT : 'YYYY-MM-DD HH:mm:ss'

};

module.exports = util._extend(csts, path_structure);
