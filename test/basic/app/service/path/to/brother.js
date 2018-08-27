const { Service } = require('../../../../../..');

class BrotherService extends Service {
    async find(username) {
        return {
            path: 'path/to/brother'
        };
    }
}
module.exports = BrotherService;
