const fs = require('fs');
const path = require('path');
const assert = require('assert');
const request = require('supertest');
const moment = require('moment');
const rimraf = require('rimraf');

const Sinba = require('..');

describe('index.test.js', () => {
    let sinbaApp = new Sinba.Application({
        baseDir: path.join(__dirname, './basic'),
    });

    // 测试结束销毁服务
    after(() => {
        sinbaApp && sinbaApp.close();
    });

    it('Sinba暴露几个属性或方法', () => {
        assert(Sinba.Application);
        assert(Sinba.Service);
        assert(Sinba.Controller);
    });

    describe('创建一个Sinba实例', () => {
        it('Sinba实例包含bootstrap、options、service、controller、middlewares', () => {
            assert(sinbaApp.bootstrap);
            assert(sinbaApp.options);
            assert(sinbaApp.service);
            assert(sinbaApp.controller);
            assert(sinbaApp.middlewares);
        });

        it('Sinba实例options包含baseDir、sinbaRoot', () => {
            assert(sinbaApp.options);
            assert(sinbaApp.options.baseDir);
            assert(sinbaApp.options.sinbaRoot);
        });
    });

    // const agent = request.agent(sinbaApp.start());
    const server = sinbaApp.start();

    describe('发几个请求试一哈', () => {
        it('`/` 打开首页', (done) => {
            request(server)
                .get('/')
                .expect('Content-Type', /text\/plain/)
                .expect(200, done);
        });
        it('`/user` 打开/user', (done) => {
            request(server)
                .get('/user')
                .expect('Content-Type', /text\/plain/)
                .expect(200, done);
        });
        it('`/ejs` 打开/ejs', async () => {
            const res = await request(server)
                .get('/ejs')
                .expect('Content-Type', /text\/html/)
                .expect(200);
            assert.ok(res.text.includes('测试ejs'));
            assert.ok(res.text.includes('</html>'));
        });
        it('`/ejs/yeah` 打开/ejs 并携带参数', async () => {
            const res = await request(server)
                .get('/ejs/yeah')
                .expect('Content-Type', /text\/html/)
                .expect(200);
            assert.ok(res.text.includes('测试ejsyeah'));
            assert.ok(res.text.includes('</html>'));
        });
        it('`/user/json/:用户名` 获取json数据', async () => {
            const res1 = await request(server)
                .get('/user/json/test')
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(200);
            const res2 = await request(server)
                .get('/user/json/test2')
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(200);
            assert.equal(res1.body.name + res2.body.name, 'testnametest2name');
        });
        it('`/user/middleware1` 全局middleware修改ctx.body', async () => {
            const res = await request(server)
                .get('/user/middleware1')
                .expect('Content-Type', /text\/plain/)
                .expect(200);
            assert.equal(res.text, '老子middleware改的body');
        });
        it('`/user/middleware2` router中使用middleware', async () => {
            sinbaApp.middlewareTest1;
            const res = await request(server)
                .get('/user/middleware2')
                .type('text/plain');
            const reg = /\d+ms/;
            if (reg.test(sinbaApp.middlewareTest1)) {
                assert.ok(true);
            } else {
                assert.fail(
                    sinbaApp.middlewareTest1,
                    /\d+ms/,
                    undefined,
                    'mismatch'
                );
            }
        });
    });

    describe('测试sinba.logger sinba日志功能', () => {
        const logPath = path.join(__dirname, 'basic/log');

        // 清空logbook文件夹
        rimraf.sync(logPath);

        const date = moment().format('YYYY-MM-DD');
        const logbookFilenameHasDate = sinbaApp.config.logbook.dateSplit;
        const dateName = logbookFilenameHasDate ? `.${date}` : '';

        it('`/logger` 打开logger测试页', async () => {
            const res = await request(server)
                .get('/logger')
                .expect(200);
            const logFiles = fs.readdirSync(logPath);
            const date = moment().format('YYYY-MM-DD');
            assert(logFiles.includes(`sinba${dateName}.log`));
        });

        it('`/logger/logbook` 写本地logbook日志文件', async () => {
            await request(server)
                .get('/logger/logbook')
                .expect(200);
            const logFiles = fs.readdirSync(logPath);

            // 成功创建logbook文件
            assert(logFiles.includes(`sinba${dateName}.log`));
            assert(logFiles.includes(`sinlogbook${dateName}.log`));
            assert(logFiles.includes(`logbook${dateName}.log`));

            const sinbaContent = fs.readFileSync(
                path.join(logPath, `sinba${dateName}.log`),
                'utf8'
            );
            const sinlogbookContent = fs.readFileSync(
                path.join(logPath, `sinlogbook${dateName}.log`),
                'utf8'
            );
            const logbookContent = fs.readFileSync(
                path.join(logPath, `logbook${dateName}.log`),
                'utf8'
            );

            assert(sinbaContent.includes('[sinba]'));
            assert(
                sinlogbookContent.includes('[sinlogbook] sinbaDemo:logbook')
            );
            assert(logbookContent.includes('[logbook] 测试logbook'));
        });
    });
});
