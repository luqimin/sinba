const path = require('path');

const cwd = process.cwd();

module.exports = {
    logbook: {
        path: path.join(__dirname, '../../log'),
        dateSplit: false,
        logrotate: true,
    },
    middleware: ['changeBody'],
};
