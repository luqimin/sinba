const { Service } = require('../../../..');

class TestService extends Service {
    constructor(props) {
        super(props);

        this.count = 0;
    }
    async find1() {
        this.count = this.count + 1;
        return this.count;
    }

    async find2() {
        this.count = this.count + 1;
        return this.count;
    }

    async find3() {
        this.count = this.count + 1;
        return this.count;
    }
}
module.exports = TestService;
