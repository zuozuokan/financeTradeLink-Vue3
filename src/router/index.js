import { createRouter, createWebHashHistory } from "vue-router";
import userLogin from "@/views/UserLogin.vue";
import Home from "@/views/Home.vue";
import UserRegister from "@/views/UserRegister.vue";
import Product from "@/views/Product.vue";
import AgriculturalKnowledgeBase from "@/views/AgriculturalKnowledgeBase.vue";
import ExpertGuide from "@/views/ExpertGuide.vue";
import ShoppingCart from "@/views/ShoppingCart.vue";
import OrderCheckout from "@/views/OrderCheckout.vue";
import OrderDetail from "@/views/OrderDetail.vue";
import UserManagement from "@/views/UserManagement.vue";
import ExpertManagement from "@/views/ExpertManagement.vue";
import BankManagement from "@/views/BankManagement.vue";
import AdminManagement from "@/views/AdminManagement.vue";
import VisitorPage from "@/views/VisitorPage.vue"; // 确保导入 VisitorPage 组件
import UserInfoExchange from "@/views/UserInfoExchange.vue";
import AddProduct from "@/views/AddProduct.vue";
import ProductManage from "@/views/ProductManage.vue";
import AddFinancing from "@/views/AddFinancing.vue";
import FinancingList from "@/views/FinancingList.vue";
import AddKnowledge from "@/views/AddKnowledge.vue";
import UserKnowledge from "@/views/UserKnowledge.vue";
import KnowledgeDetail from '@/views/KnowledgeDetail.vue';
import AdminUserManagement from '@/views/AdminUserManagement.vue';
import AdminKnowledgeManagement from '@/views/AdminKnowledgeManagement.vue';
import AdminNoticeManagement from '@/views/AdminNoticeManagement.vue';
import AdminProductManagement from '@/views/AdminProductManagement.vue';
import AdminFinancingManagement from '@/views/AdminFinancingManagement.vue';


import ExpertAppointment from "../views/ExpertAppointment.vue";
import ExpertAddKnowledge from "../views/ExpertAddKnowledge.vue";
import ExpertKnowledgeList from "../views/ExpertKnowledgeList.vue";
import ConsultList from "../views/consultList.vue";


const routes = [
  {
    path: "/",
    name: "visitorPage",
    component: VisitorPage,
    meta: {
      title: "访客页面",
      hideSidebar: true, // 隐藏侧边栏
    },
  },
  {
    path: "/user-login",
    name: "userLogin", // 确保 name 唯一
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
    path: "/product",
    name: "product",
    component: Product,
    meta: {
      title: "产品",
  //    hideSidebar: true, // 隐藏侧边栏
    },
  },
  {
    path: "/product/:productUuid",
    name: "productDetail",  
    component: () => import("@/views/ProductDetail.vue"), // 懒加载产品详情组件
    meta: { 
      title: "产品详情",
     // hideSidebar: true, // 隐藏侧边栏
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
    path: '/knowledge/:id',
    name: 'KnowledgeDetail',
    component: KnowledgeDetail,
    meta: {
      title: "知识详情",
      hideSidebar: true, 
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
    path: "/shopping-cart",
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
    path: '/order-detail/:id',
    name: 'OrderDetail',
    component: OrderDetail,
    meta: {
      title: "订单详情",
    },
  },
  {
    path: "/user-management",
    name: "userManagement",
    component: UserManagement,
    meta: {
      title: "用户后台管理",
      hideSidebar: true, 
    },
  },
  {
    path: "/expert-management",
    name: "expertManagement",
    component: ExpertManagement,
    meta: {
      title: "专家后台管理",
      hideSidebar:true,
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
    children: [
      { path: 'user', component: AdminUserManagement },
      { path: 'knowledge', component: AdminKnowledgeManagement },
      { path: 'notice', component: AdminNoticeManagement },
      { path: 'product', component: AdminProductManagement },
      { path: 'financing', component: AdminFinancingManagement },
    ],
    meta: {
      title: "管理员后台",
      hideSidebar: true,
    },
  },
  {
    path: "/user-info-exchange",
    name: "userInfoExchange",
    component: UserInfoExchange,
    meta: {
      title: "用户信息更改",
      hideSidebar: true, 
    },
  },
  {
    path: "/user-info-exchange",
    name: "userInfoExchange",
    component: UserInfoExchange,
    meta: {
      title: "用户信息更改",
      // hideSidebar: true,
    },
  },
  {
    path: "/add-product",
    name: "addProduct",
    component: AddProduct,
    meta: {
      title: "添加产品",
      hideSidebar: true, 
    },
  },
  {
    path: "/product-manage",
    name: "productManage",
    component: ProductManage,
    meta: {
      title: "产品管理",
      hideSidebar: true, 
    },
  },
  {
    path: "/add-financing",
    name: "addFinancing",
    component: AddFinancing,
    meta: {
      title: "发起融资",
      hideSidebar: true, 
    },
  },
  {
    path: "/financing-list",
    name: "financingList",
    component: FinancingList,
    meta: {
      title: "融资列表",
      hideSidebar: true, 
    },
  },
  {
    path: "/add-knowledge",
    name: "addKnowledge",
    component: AddKnowledge,
    meta: {
      title: "发布知识",
      hideSidebar: true, 
    },
  },
  {
    path: "/user-knowledge",
    name: "userKnowledge",
    component: UserKnowledge,
    meta: {
      title: "我的知识管理",
      hideSidebar: true, 
    },
  },
  //基于用户视角的预约咨询有关的内容
  {
    path: "/expert-guide",
    name: "expertGuide",
    component: ExpertGuide,
    meta: {
      title: "用户的预约咨询",
      hideSidebar: true,
    },
  },
  {
    path: "/consult-list",
    name: "consultList",
    component: ConsultList,
    meta: {
      title: "我的预约管理",
      hideSidebar: true,
    },
  },


  // 专家后台管理的相关路由配置

  {
    path: "/expert-info",
    name: "expertInfo",
    component: ExpertManagement,
    meta: {
      title: "专家信息管理",
      hideSidebar: true,
    },
  },
  {
    path: "/expert-appointment",
    name: "expertAppointment",
    component: ExpertAppointment,
    meta: {
      title: "专家预约管理",
      hideSidebar: true,
    },
  },
  {
    path: "/expert-add-knowledge",
    name: "expertAddKnowledge",
    component: ExpertAddKnowledge,
    meta: {
      title: "专家发布知识",
      hideSidebar: true,
    },
  },
  {
    path: "/expert-knowledge-list",
    name: "expertKnowledgeList",
    component: ExpertKnowledgeList,
    meta: {
      title: "专家知识列表",
      hideSidebar: true,
    },
  },


];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
