import { createRouter, createWebHashHistory } from "vue-router";
import userLogin from "@/views/UserLogin.vue";
import Home from "@/views/Home.vue";
import UserRegister from "@/views/UserRegister.vue";

const routes = [
  {
    path: "/",
    name: "userLogin",
    component: userLogin,
    meta: {
      title: "用户登录",
    },
  },
  {
    path: "/user-login",
    name: "userLoginAlt", // 确保 name 唯一
    component: userLogin,
    meta: {
      title: "用户登录",
    },
  },
  {
    path: "/home",
    name: "home",
    component: Home,
    meta: {
      title: "首页",
    },
  },
  {
    path: "/user-register",
    name: "userRegister",
    component: UserRegister,
    meta: {
      title: "用户注册",
    },
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
