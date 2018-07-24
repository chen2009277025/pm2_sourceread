var path = require('path')

let execfile = path.resolve(__dirname,'app.js');
require.main.filename = execfile;
process.title = 'node app.js --name spawn'

// Resets global paths for require()
require('module')._initPaths();