var path = require('path')

process.title = 'node app.js --name cluster3'

let execfile = path.resolve(__dirname,'app.js');
require.main.filename = execfile;

// Resets global paths for require()
require('module')._initPaths();