import { createRouter, createWebHashHistory } from "vue-router";
import userLogin from "../views/UserLogin.vue";

const routes = [
    {
        path: "/",
        name: "userLogin",
        component: userLogin,
        meta: {
            title: "登录",
        }
        
    }
];

const router = createRouter({
    history: createWebHashHistory(),
    routes,
});

export default router;
