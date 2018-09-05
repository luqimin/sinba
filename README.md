# Sinba

## 使用说明

sinba 所暴露 api 与 eggjs 大体一致，使用可参考[eggjs 文档](http://eggjs.org/zh-cn/intro/quickstart.html)

## Sinba 内置中间件说明

-   siteFile **默认启用**:  文件请求

-   notfound **默认启用**: 默认 404 页面

-   bodyParser **默认启用**: req.body parse 工具，默认不开启 multipart

-   cors **默认不启用**: cors 中间件，需手动启用

-   session **默认不启用**: session 中间件，需手动启用

## 日记级别说明

-   app.logger 方法

```
logger.log() process.stdout 打印日志，namespace默认为sinba
logger.debug() process.stdout 打印日志，namespace默认为项目名
logger.error() process.stderr 打印日志，namespace默认为项目名
logger.logbook() process.stdout 打印日志，并且记入logbook日志，namespace默认为logbook
```

-   LOG 可以自定义 debug 命名空间

```
logger.name('namespace').debug('这是一条日志');
// namespace 这是一条日志 +0ms

logger.name('filename').logbook(这是一条日志，这条日志会记录到文件filename.log内);
// logbook 这是一条日志，这条日志会记录到文件filename.log内 +0ms
```

-   Sinba 默认命名空间为小写 'sinba'，不同功能模块可能加以区分：'sinba:core'、'sinba:service'...

-   如果需要输出日志，需要设置环境变量 DEBUG=命名空间

```
DEBUG=sinba* npm test
```
