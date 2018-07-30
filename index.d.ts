declare module "@koa/cors" {
    import * as Koa from 'koa';
    namespace cors {
        interface Options {
            origin?: string | ((ctx: Koa.Context) => boolean | string);
            allowMethods?: string[];
            allowHeaders?: string[];
            exposeHeaders?: string[];
            maxAge?: number;
            credentials?: boolean;
            keepHeadersOnError?: boolean;
        }
    }

    function cors(options?: cors.Options): Koa.Middleware;

    export = cors;
}