const {
    Service
} = require('../../../..');

class UserService extends Service {

    async find(username) {
        return {
            name: `${username}name`,
            age: 'user.age',
        };
    }
}
module.exports = UserService;