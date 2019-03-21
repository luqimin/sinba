const path = require('path');
const assert = require('assert');
const request = require('supertest');

const Sinba = require('..');

describe('port.test.js', () => {
    let sinbaApp = new Sinba.Application({
        port: 7001,
        baseDir: path.join(__dirname, './basic'),
    });

    // 测试结束销毁服务
    after(() => {
        sinbaApp && sinbaApp.close();
    });

    describe('在3001端口创建一个Sinba实例', () => {
        it('Sinba实例包含bootstrap、options、service、controller、middlewares', () => {
            assert(sinbaApp.bootstrap);
            assert(sinbaApp.options);
            assert(sinbaApp.service);
            assert(sinbaApp.controller);
            assert(sinbaApp.middlewares);
        });
    });

    const server = sinbaApp.start()

    describe('发一个请求试一哈', () => {
        it('`/` 打开首页', (done) => {
            request(server)
                .get('/')
                .expect('Content-Type', /text\/html/)
                .expect(200, done);
        });
    });

});