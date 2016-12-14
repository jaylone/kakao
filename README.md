# Kakao

An API-driven framework for building nodejs apps, using MVC conventions. It only will provide a structure, inspired on Ruby on Rails, that will allow you to organise better your projects, initialise your own or third party libraries, call in a easy way your models, helpers, etc.

## Features

* MVC architecture project
* ES6 support
* Helpers support
* ORM, ODM or DB driver independent
* Well organized configuration files and routes

## TODO
- [ ] HTTPS support
- [x] Log
  - [x] accessLog
  - [x] requestLog
- [x] Router
- [x] REST
  - [x] GET
  - [x] POST
  - [x] PUT
  - [x] DELETE
- [x] ORM
  - [ ] withRelated返回指定的columns
  - [x] 自定义sql
  - [ ] joi.description()不起作用
  - [x] schema/joi
  - [x] 分页
  - [x] 使用bookshelf-cascade-delete删除关联表数据，避免使用数据库外键
  - [x] 根据models自动创建CRUD路由
- [x] Debug
- [ ] Cache
- [ ] Task
- [ ] Test
- [ ] Deploy
- [ ] Daemon
- [ ] Others
  - [ ] xx

## Installation

First install [node.js](http://nodejs.org/) and [mysql](http://dev.mysql.com/downloads/mysql/). Then:

Download the project to a local folder
```
$ git clone https://github.com/zhongzhi107/kakao
```
Install dependencies
```
$ npm install
```

Start the application with one of the following:
```
$ npm start
$ npm run serve
```
By default the app tries to connect to port 3000. After starting the application you can check it at [localhost:3000](http://localhost:3000)

The url [localhost:3000](http://localhost:3000) returns the json document yielded by mongoose. This assumes that you have a connection stablished with a mongodb instance and a mongo document has already been inserted in the db.

```sh
# Start mongodb Service
$ /usr/local/mongodb/bin/mongod --dbpath=./data

# mongodb Client
$ /usr/local/mongodb/bin/mongo
```

## Convention
> 以下是默认约定，如果不想按着默认约定编码，可以在代码中使用指定参数的方式更改

- 数据库 表 应该像 变量名一样，全部采用小写，但单词之间以下划线分隔，而且，表名始终是复数形式的
- 文件名应该全部小写，单词之间用下划线
- 关联表名称默认为用下划线连接的被关联的两个表名，且按2个表名称的字母排序先后顺序连接
  - `users`和`posts`的关联表名称应该为`posts_users`
  - `tags`和`posts`的关联表名称应该为`posts_tags`
  - `users`和`tags`的关联表名称应该为`tags_users`
- 关联表名中关联的字段默认为 `被关联表名称的单数_id`，如 `user_id` `tag_id` `post_id`
- ...

## 路由
kakao能根据model自动创建RESTful路由地址

### 创建一个最简单的CRUD路由
```js
import Role from '../models/roles';
import ResourceRouter from '../utils/router';

export default ResourceRouter.define(Role.collection())
```

上面的代码会自动创建以下路由：

提交方式 | 路由 | 说明
--- | --- | ---
POST | /roles | 新建一个角色
GET | /roles | 列出所有角色
GET | /roles/:id | 获取某个指定角色的信息
PATCH | /roles/:id | 更新某个指定角色的信息
DELETE | /roles/:id | 删除某个角色

### 创建一个嵌套路由
```js
import Role from '../models/role';
import ResourceRouter from '../utils/router';

const users = ResourceRouter.define({
  // 假设在role model中已经设定了role和user的关联关系
  collection: (ctx) => ctx.state.role.users(),
  name: 'users',
  setup(router) {
    router
      .use(async (ctx, next) => {
        ctx.state.role = await Role.findById(
          ctx.params.role_id,
          {require: true}
        );
        await next();
      })
      .crud();
  },
});

export default ResourceRouter.define({
  collection: Role.collection(),
  setup(router) {
    router.crud();
    // router.create().read().update().destroy();

    // 使用嵌套路由
    router.use('/roles/:role_id(\\d+)', users.routes());
  },
});

```
上面的代码会自动创建以下路由：

 提交方式 | 路由 | 说明
---|---|---
POST|/roles|新建一个角色
GET|/roles|列出所有角色
GET|/roles/:id|获取某个指定角色的信息
PATCH|/roles/:id|更新某个指定角色的信息
DELETE|/roles/:id|删除某个指定角色的信息
POST|/roles/:role_id/users|新增一个某个指定角色的用户
GET|/roles/:role_id/users|列出某个指定角色的所有用户
GET|/roles/:role_id/users/:user_id|列出某个指定角色的指定用户
PATCH|/roles/:role_id/users/:user_id|修改某个指定角色的指定用户
DELETE|/roles/:role_id/users/:user_id|删除某个指定角色的指定用户


## Overview
...

## Notes
- curl传递多个querystring参数时，`&` 前需要加 `\`，如 `curl http://localhost/roles?sort=id\&direction=desc`
- curl传递带[]参赛时，需要加上 `--globoff` 参数，如 `curl --globoff http://localhost/roles?where[name]=sales`

## References

- [bookshelfjs docs](http://bookshelfjs.org)
- [knexjs docs](http://knexjs.org)
- [Joi docs](https://github.com/hapijs/joi)
- [koa-router docs](https://github.com/alexmingoia/koa-router)
