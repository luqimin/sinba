# PISTA

## 使用说明

[点这里查看sinba已完成功能列表](https://cf.jd.com/display/~xiangshoulai/Sinba+roadmap)

sinba所暴露api与eggjs一致，使用可参考[eggjs文档](http://eggjs.org/zh-cn/intro/quickstart.html)

## 开发步骤

0. `npm i` 安装项目依赖

1. `npm start` 开启本地编译服务并监听所有源码文件变化

2. `npm run clean` 清除编译文件（这些文件不应该提交到git）

3. `npm run lint` lint检查

4. `npm run build` 编译文件，本步骤会自动运行 `npm run clean`

## 发布说明

sinba发布在[京东私有npm库](http://npm.m.jd.com/)上，sinba的Scope为@jd，发布前请参考[京东私有npm库发布说明](http://npm.m.jd.com/)


## 发布步骤

1. 将本地ts文件编译成js文件: `npm run build`

2. 修改版本号: `npm version patch/minor/major`，请遵循npm版本号规则

3. 发布: `jnpm publish`

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

## 文件目录 (本目录未包含文件都是编译后生成的)

```
.
├── README.md
├── package-lock.json
├── package.json
├── src                                     ------ 【重要】项目源码目录
│   ├── index.ts                            ------ 入口js
│   ├── app
│   │   └── middleware                          ------ 默认中间件目录
│   │       ├── bodyParser.ts
│   │       ├── notfound.ts
│   │       └── siteFile.ts
│   ├── config                              ------ sinba项目默认配置
│   │   └── config.default.ts
│   └── lib                                 ------ 核心逻辑目录
│       ├── config
│       │   └── default.ts
│       └── core
│           ├── base                            ------ sinba 基类
│           │   ├── controller.ts
│           │   └── service.ts
│           ├── bootstrap                       ------ sinba 项目初始化逻辑
│           │   ├── index.ts
│           │   ├── mixin
│           │   │   ├── config.ts
│           │   │   ├── controller.ts
│           │   │   ├── middleware.ts
│           │   │   ├── router.ts
│           │   │   ├── service.ts
│           │   │   └── view.ts
│           │   └── viewStore.ts
│           ├── core.ts                         ------ sinba app 基类
│           ├── logger                          ------ sinba 日志方法
│           │   ├── index.ts
│           │   ├── logbookProfiler.ts
│           ├── schedule                        ------ sinba 定时任务，包含timer方法，sinba项目的timer方法需严格使用schedule实例化
│           │   └── index.ts
│           └── utils
│               ├── index.ts
│               ├── makeDirs.ts
│               ├── readFile.ts
│               └── writeStream.ts
├── test
├── tsconfig.json
├── tslint.json
└── types

```
