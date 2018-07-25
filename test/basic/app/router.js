// app/router.js
module.exports = (app) => {
    const { router, controller, middlewares } = app;

    router.get('/', async (ctx, next) => {
        ctx.body = '<h1>Sinba</h1>';
    });
    router.get('/user', controller.user.render);
    router.get('/ejs/:name?', controller.user.ejs);
    router.get('/user/json/:name', controller.user.getUserInfo);
    router.get('/user/middleware1', controller.user.middlerware1);
    router.get(
        '/user/middleware2',
        middlewares.getRequestTime(),
        controller.user.middlerware2
    );

    router.get('/logger', controller.logger.render);
    router.get('/logger/logbook', controller.logger.logbook);
};
