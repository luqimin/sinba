const path = require('path');

module.exports = {
    logbook: {
        path: path.join(__dirname, '../../log'),
        dateSplit: false,
        logrotate: true,
    },
    middleware: ['changeBody', 'getApp', 'session'],
};
