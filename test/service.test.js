const path = require('path');
const assert = require('assert');
const request = require('supertest');

const Sinba = require('..');

describe('service.test.js', () => {
    let sinbaApp = new Sinba.Application({
        port: 7003,
        baseDir: path.join(__dirname, './basic'),
    });

    // 测试结束销毁服务
    after(() => {
        sinbaApp && sinbaApp.close();
    });

    const server = sinbaApp.start();

    describe('测试多级嵌套service', () => {
        it('多级嵌套service: path/kid、path/to/brother、path/to/child/sister', async () => {
            const res = await request(server)
                .get('/service/multi')
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(200);
            assert.equal(res.body.kid, 'path/kid');
            assert.equal(res.body.brother, 'path/to/brother');
            assert.equal(res.body.sister, 'path/to/child/sister');
        });
    });

    describe('测试service在每次请求的时候均实例化', () => {
        it('从req.header获取TEXT_NAME: zhangsan', async () => {
            const res = await request(server)
                .get('/user/nameFromService')
                .set('TEXT_NAME', 'zhangsan')
                .expect('Content-Type', /text\/plain/)
                .expect(200);
            assert.equal(res.text, 'zhangsan');
        });
        it('从req.header获取TEXT_NAME: lisi', async () => {
            const res = await request(server)
                .get('/user/nameFromService')
                .set('TEXT_NAME', 'lisi')
                .expect('Content-Type', /text\/plain/)
                .expect(200);
            assert.equal(res.text, 'lisi');
        });
        it('从req.header获取TEXT_NAME: wangwu', async () => {
            const res = await request(server)
                .get('/user/nameFromService')
                .set('TEXT_NAME', 'wangwu')
                .expect('Content-Type', /text\/plain/)
                .expect(200);
            assert.equal(res.text, 'wangwu');
        });
    });

    describe('测试service在每次请求的时候仅实例化一次', () => {
        it('调用 service.test 中三个不同service', async () => {
            const res = await request(server)
                .get('/user/serviceSingleton')
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(200);
            assert.equal(res.body.find1, 1);
            assert.equal(res.body.find2, 2);
            assert.equal(res.body.find3, 3);
        });
    });
});
