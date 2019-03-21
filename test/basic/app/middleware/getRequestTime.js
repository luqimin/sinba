module.exports = (option) => {
    return async (ctx, next) => {
        const startTime = new Date().getTime();
        await next();
        const endTime = new Date().getTime();
        ctx.app.middlewareTest1 = `${endTime - startTime}ms`;
    };
};
