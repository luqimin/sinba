const { Application } = require('../../index.js');

const sinbaApp = new Application();

sinbaApp.start();

// for koa-session
sinbaApp.keys = ['a', 'b'];
