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
    router.get('/user/middleware2', middlewares.getRequestTime(), controller.user.middlerware2);

    router.get('/user/name', controller.user.username)
    router.get('/user/nameFromService', controller.user.usernameFromService)
    router.get('/user/serviceSingleton', controller.user.manyServices)

    router.get('/logger', controller.logger.render);
    router.get('/logger/logbook', controller.logger.logbook);

    router.get('/kid', controller.path.kid.first);
    router.get('/kid/bro', controller.path.kidbro.first);
    router.get('/brother', controller.path.to.brother.second);
    router.get('/brother/bro', controller.path.to.brotherbro.second);
    router.get('/sister', controller.path.to.child.sister.third);
    router.get('/sister/bro', controller.path.to.child.sisterbro.third);

    router.get('/service/multi', controller.path.multi.multiService);
};
