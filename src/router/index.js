import { createRouter, createWebHashHistory } from "vue-router";
import userLogin from "@/views/UserLogin.vue";
import Home from "@/views/Home.vue";
import UserRegister from "@/views/UserRegister.vue";
import Product from "@/views/Product.vue";
import AgriculturalKnowledgeBase from "@/views/AgriculturalKnowledgeBase.vue";
import ExpertGuide from "@/views/ExpertGuide.vue";
import ShoppingCart from "@/views/ShoppingCart.vue";
import OrderCheckout from "@/views/OrderCheckout.vue";
import UserManagement from "@/views/UserManagement.vue";
import ExpertManagement from "@/views/ExpertManagement.vue";
import BankManagement from "@/views/BankManagement.vue";
import AdminManagement from "@/views/AdminManagement.vue";


const routes = [
  {
    path: "/",
    name: "userLogin",
    component: userLogin,
    meta: {
      title: "用户登录",
      hideSidebar: true, // 隐藏侧边栏
    },
  },
  {
    path: "/user-login",
    name: "userLoginAlt", // 确保 name 唯一
    component: userLogin,
    meta: {
      title: "用户登录",
      hideSidebar: true, 
    },
  },
  {
    path: "/user-register",
    name: "userRegister",
    component: UserRegister,
    meta: {
      title: "用户注册",
      hideSidebar: true, 
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
    path: "/prodect",
    name: "prodect",
    component: Product,
    meta: {
      title: "产品",
    },
  },
  {
    path: "/agricultural-knowledge-base",
    name: "agriculturalKnowledgeBase",
    component: AgriculturalKnowledgeBase,
    meta: {
      title: "农业知识库",
    },
  },
  {
    path: "/expert-guide",
    name: "expertGuide",
    component: ExpertGuide,
    meta: {
      title: "专家指导",
    },
  },
  {
    path: "/shopping-cart ",
    name: "shoppingCart",
    component: ShoppingCart,
    meta: {
      title: "购物车",
    },
  },
  {
    path: "/order-checkout",
    name: "orderCheckout",
    component: OrderCheckout,
    meta: {
      title: "订单查看",
    },
  },
  {
    path: "/user-management",
    name: "userManagement",
    component: UserManagement,
    meta: {
      title: "用户后台管理",
    },
  },
  {
    path: "/expert-management",
    name: "expertManagement",
    component: ExpertManagement,
    meta: {
      title: "专家后台管理",
    },
  },
  {
    path: "/bank-management",
    name: "bankManagement",
    component: BankManagement,
    meta: {
      title: "银行后台管理",
    },
  },
  {
    path: "/admin-management",
    name: "adminManagement",
    component: AdminManagement,
    meta: {
      title: "管理员后台管理",
    },
  },
  
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
