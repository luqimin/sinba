const { Service } = require('../../../../..');

class KidService extends Service {
    async find(username) {
        return {
            path: 'path/kid'
        };
    }
}
module.exports = KidService;
