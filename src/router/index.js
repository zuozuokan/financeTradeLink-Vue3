import { createRouter, createWebHashHistory } from "vue-router";
import userLogin from '@/views/UserLogin.vue';
import Home from '@/views/Home.vue';

const routes = [
    {
        path: "/",
        name: "userLogin",
        component: userLogin,
        meta: {
            title: "登录",
        }
    },
    {  
        path: "/home",
        name: "home",
        component: Home,
        meta: {
            title: "首页",
        }
    }
];

const router = createRouter({
    history: createWebHashHistory(),
    routes,
});

export default router;
