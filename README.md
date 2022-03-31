# 使用mock.js实现mock数据
### mock.js是一个模拟后台接口的JS库。它可以在接口没出来时非常方便的模拟数据，用法简单，方便扩展，支持种类丰富的随机数据，并且它易于扩展，可接受请求参数，根据参数定制数据，足以满足日常开发需求。

### 该库对开发无侵入，不需要对系统代码进行修改，即可通过拦截Ajax请求，返回模拟数据以供开发测试使用，当项目上线之后只需取消引用它即可。

### 接下来演示一下如何在Vue项目中组织和使用mock.js进行数据模拟。

1. 安装
* 首先安装 mock.js，由于只用于开发环境使用，所以执行如下命令安装：
```
npm install mockjs --save-dev
```
2. 编写模拟数据接口
* 在 src目录 下创建一个 mock目录 ，然后在里面创建一个 index.js 文件，作为mock各个模块的导出点，供 src/main.js 使用。在 src/mock/modules 目录下，创建 xxx.js 规则，模拟各个模块数据，供 mock 使用。这样按模块划分后的目录结构大致如下所示：
```

├── src
|   ├── mock
|       ├── index.js
|       └── modules  // 各个模块的mock数据
|           ├── user.js
|           ├── article.js
|           └── category.js
|
```
index.js代码如下：
```
/**
 * 定义本地测试接口，最好与正式接口一致，尽可能减少联调阶段修改的工作量
 */
// 引入mockjs
import Mock from "mockjs";
// 引入模板函数类
import user from "./modules/user";
import article from "./modules/article";
import category from "./modules/category";

const { mock } = Mock; // Mock函数

// 使用拦截规则拦截命中的请求
// mock( url, post/get, 返回的数据);
mock(/\/api\/users\/login/, "post", user.login);
mock(/\/api\/users\/profile/, "get", user.profile);
mock(/\/api\/users\/logout/, "post", user.logout);
user.js代码如下：

import { Random } from "mockjs"; // 导出随机函数

function login(req) {
  // req是一个请求对象，包含: url，type和body属性
  return {
    code: 200,
    data: {
      username: Random.cname(),
      token: Random.guid(),
      message: "Login successfully."
    }
  };
}

function profile(req) {
  return {
    code: 200,
    data: {
      username: Random.cname(),
      age: Random.integer(10, 30),
      date: Random.date(),
      message: ""
    }
  };
}

function logout(req) {
  return {
    code: 200,
    data: {
      message: "Logout successfully."
    }
  };
}

export default {
  login,
  profile,
  logout
};
```
article.js和category.js代码省略。

1. 导入模拟数据接口
* 模拟好假数据接口之后，我们还要在 main.js 中将接口导入，这样在项目中任意组件内都可以请求这些接口了。
main.js编辑如下：
```
import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";

// 引入mock文件
import "./mock"; // mock 方式，正式发布时，注释掉该处即可

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
1. 组件引用
最后在组件 Home.vue 中调用这些API，以Home.vue这个组件为例，代码如下：

<template>
  <div class="home">
    <button @click="profile">信息</button>&#8195;
    <button @click="logout">注销</button>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "home",
  components: {},
  data() {
    return {
      username: "admin",
      password: "password"
    };
  },
  created() {
    let params = { username: this.username, password: this.password };
    axios.post("/api/users/login", params).then(res => {
      console.log(res);
    }).catch(err => {
      console.log(err);
    });
  },
  methods: {
    profile() {
      axios.get("/api/users/profile").then(res => {
        console.log(res);
      }).catch(err => {
        console.log(err);
      });
    },
    logout() {
      axios.post("/api/users/logout").then(res => {
        console.log(res);
      }).catch(err => {
        console.log(err);
      });
    }
  }
};
</script>
```
5. 启动项目
执行命令  启动项目，打开调试窗口，观察打印结果。
```
npm run serve
```

6. 注意事项
* mock.js依赖中保存着大量用于伪造假数据的静态数据，引入的时候打包得到的文件体积会明显增大，这是正常的。

* mock.js模拟数据后，会将命中配置规则（正则表达式）的请求拦截，这时候在浏览器的network面板是无法看到数据返回的，可以通过打印数据的方式观察。

* 当后端写好真实接口以后，不要忘记注释掉在 main.js 中引入mock文件的那行代码。你也可以选择删掉创建的 mock目录 和 main.js 中的那行代码。