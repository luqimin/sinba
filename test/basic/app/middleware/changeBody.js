module.exports = (option) => {
    return async (ctx, next) => {
        if (ctx.url.includes('/user/middleware1')) {
            ctx.body = '老子middleware改的body';
        }
        await next();
    };
};
