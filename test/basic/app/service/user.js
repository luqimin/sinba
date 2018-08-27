const { Service } = require('../../../..');

class UserService extends Service {
    async find(username) {
        return {
            name: `${username}name`,
            age: 'user.age',
        };
    }

    async headerUsername() {
        const { ctx } = this;
        return ctx.headers['text_name'];
    }
}
module.exports = UserService;
