const path = require('path');
const assert = require('assert');
const request = require('supertest');

const Sinba = require('..');

describe('controller.test.js', () => {
    let sinbaApp = new Sinba.Application({
        port: 7002,
        baseDir: path.join(__dirname, './basic'),
    });

    // 测试结束销毁服务
    after(() => {
        sinbaApp && sinbaApp.close();
    });

    const server = sinbaApp.start();

    describe('测试嵌套controller', () => {
        it('一级嵌套controller: path/kid', async () => {
            const res = await request(server)
                .get('/kid')
                .expect('Content-Type', /text\/plain/)
                .expect(200);
            assert.equal(res.text, 'path/kid');
        });
        it('一级嵌套controller: path/kidbro', async () => {
            const res = await request(server)
                .get('/kid/bro')
                .expect('Content-Type', /text\/plain/)
                .expect(200);
            assert.equal(res.text, 'path/kidbro');
        });
        it('两级嵌套controller: path/to/brother', async () => {
            const res = await request(server)
                .get('/brother')
                .expect('Content-Type', /text\/plain/)
                .expect(200);
            assert.equal(res.text, 'path/to/brother');
        });
        it('两级嵌套controller: path/to/brotherbro', async () => {
            const res = await request(server)
                .get('/brother/bro')
                .expect('Content-Type', /text\/plain/)
                .expect(200);
            assert.equal(res.text, 'path/to/brotherbro');
        });
        it('三级嵌套controller: path/to/child/sister', async () => {
            const res = await request(server)
                .get('/sister')
                .expect('Content-Type', /text\/plain/)
                .expect(200);
            assert.equal(res.text, 'path/to/child/sister');
        });
        it('三级嵌套controller: path/to/child/sisterbro', async () => {
            const res = await request(server)
                .get('/sister/bro')
                .expect('Content-Type', /text\/plain/)
                .expect(200);
            assert.equal(res.text, 'path/to/child/sisterbro');
        });
    });

    describe('测试controller在每次请求的时候均实例化', () => {
        it('从req.header获取TEXT_NAME: zhangsan', async () => {
            const res = await request(server)
                .get('/user/name')
                .set('TEXT_NAME', 'zhangsan')
                .expect('Content-Type', /text\/plain/)
                .expect(200);
            assert.equal(res.text, 'zhangsan');
        });
        it('从req.header获取TEXT_NAME: lisi', async () => {
            const res = await request(server)
                .get('/user/name')
                .set('TEXT_NAME', 'lisi')
                .expect('Content-Type', /text\/plain/)
                .expect(200);
            assert.equal(res.text, 'lisi');
        });
        it('从req.header获取TEXT_NAME: wangwu', async () => {
            const res = await request(server)
                .get('/user/name')
                .set('TEXT_NAME', 'wangwu')
                .expect('Content-Type', /text\/plain/)
                .expect(200);
            assert.equal(res.text, 'wangwu');
        });
    });
});
