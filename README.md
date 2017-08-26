# mip-cache

> 删除MIP缓存

[![code style fecs](https://img.shields.io/badge/code%20style-fecs-brightgreen.svg)](https://github.com/ecomfe/fecs)
[![Build Status](https://travis-ci.org/xuexb/mip-cache.svg?branch=master)](https://travis-ci.org/xuexb/mip-cache)
[![Test Coverage](https://img.shields.io/coveralls/xuexb/mip-cache/master.svg)](https://coveralls.io/r/xuexb/mip-cache)
[![MIT license](https://img.shields.io/github/license/xuexb/mip-cache.svg)](https://github.com/xuexb/mip-cache)

## 安装

```shell
$ [sudo] npm i mip-cache
```

## 使用

```js
var Mip = require('mip-cache');
var app = new Mip({
    // 站长平台的授权key
    authkey: ''
});

// 推送数据
// app.clear(url) => Promise
app.clear('http://mip.xuexb.com').then(res => {
    console.log(res);
}).catch(err => {
    console.error(err);
});
```

## cli

```shell
# 全局安装
$ [sudo] npm i mip-cache -g

# 使用命令清除
mip-cache --authkey 站长平台的authkey url
```

## 成功响应

> 参考 [百度站长平台](http://zhanzhang.baidu.com/mip/index)

```js
{
    status: 0,
    msg: 'cache clean success'
}
```

## 响应错误码

#### 后端服务出错

```js
{
    status: -1,
    msg: 具体错误信息 || 'server error'
}
```

#### 后端返回值错误

```js
{
    status: -2,
    msg: 'parse json error'
}
```

#### 数据错误

> 参考 [百度站长平台](http://zhanzhang.baidu.com/mip/index)

```js
{
    status: 1,

    // 授权校验失败
    msg: 'authorization check fail'
}
{
    status: 1,

    // 更新次数超限
    'msg': 'update times exceed the limit'
}
```

## todo

- [x] 测试覆盖