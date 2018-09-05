module.exports = (option, app) => {
    return async (ctx, next) => {
        app.testInMiddleware = 'we can modify app in a middleware';
        next();
    };
};
