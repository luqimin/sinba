# Sinba

## 使用说明

sinba所暴露api与eggjs大体一致，使用可参考[eggjs文档](http://eggjs.org/zh-cn/intro/quickstart.html)

## 日记级别说明

- app.logger 方法

```
logger.log() process.stdout 打印日志，namespace默认为sinba
logger.debug() process.stdout 打印日志，namespace默认为项目名
logger.error() process.stderr 打印日志，namespace默认为项目名
logger.logbook() process.stdout 打印日志，并且记入logbook日志，namespace默认为logbook
```

- LOG可以自定义debug命名空间

```
logger.name('namespace').debug('这是一条日志');
// namespace 这是一条日志 +0ms

logger.name('filename').logbook(这是一条日志，这条日志会记录到文件filename.log内);
// logbook 这是一条日志，这条日志会记录到文件filename.log内 +0ms
```

- Sinba默认命名空间为小写 'sinba'，不同功能模块可能加以区分：'sinba:core'、'sinba:service'...

- 如果需要输出日志，需要设置环境变量 DEBUG=命名空间

```
DEBUG=sinba* npm test
```
