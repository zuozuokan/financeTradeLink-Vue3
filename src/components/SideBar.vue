算了，你直接帮我改吧：<template>
  <el-row class="tac">
    <el-col :span="25">
      <el-menu
        router
        active-text-color="#ffd04b"
        background-color="#545c64"
        class="el-menu-vertical-demo"
        default-active="/home"
        text-color="#fff"
        @open="handleOpen"
        @close="handleClose"
      >
        <!-- 标题项，不可点击 -->
        <el-menu-item @click.stop.prevent id="side-title">
        <el-icon><Location /></el-icon>
        <span class="menu-title">融销通平台导航栏</span>
        </el-menu-item>

        <!-- 可跳转菜单项 -->
        <el-menu-item index="/home">
          <el-icon><IconMenu /></el-icon>
          <span>首页</span>
        </el-menu-item>

        <el-menu-item index="/agricultural-knowledge-base">
          <el-icon><Document /></el-icon>
          <span>农业知识库</span>
        </el-menu-item>

        <el-sub-menu index="4">
          <template #title>
            <el-icon><ShoppingCart /></el-icon>
            <span>购物指南</span>
          </template>
          <el-menu-item index="/prodect">农业商品</el-menu-item>
          <el-menu-item index="/shopping-cart">我的购物车</el-menu-item>
          <el-menu-item index="/order-checkout">我的订单</el-menu-item>
        </el-sub-menu>
        <el-menu-item index="5" @click="goToAdminByRole">
          <el-icon><Setting /></el-icon>
          <span>后台管理</span>
        </el-menu-item>
      </el-menu>
    </el-col>
  </el-row>
</template>

<script lang="ts" setup>
import { useRouter } from "vue-router";
import { jwtDecode } from "jwt-decode";
import {
  Document,
  Menu as IconMenu,
  Location,
  Setting,
  ShoppingCart,
} from "@element-plus/icons-vue";

const handleOpen = (key: string, keyPath: string[]) => {
  console.log("打开子菜单:", key, keyPath);
};
const handleClose = (key: string, keyPath: string[]) => {
  console.log("关闭子菜单:", key, keyPath);
};

const router = useRouter();

const goToAdminByRole = () => {
  const token = localStorage.getItem("token");
  if (!token) {
    console.warn("未登录或token无效");
    return;
  }

  try {
    const payload = jwtDecode(token);
    const role = payload.role;

    switch (role) {
      case "ADMIN":
        router.push("/admin-management");
        break;
      case "BANK":
        router.push("/bank-management");
        break;
      case "EXPERT":
        router.push("/expert-management");
        break;
      case "USER":
        router.push("/user-management");
        break;
      default:
        console.warn("未知角色:", role);
    }
  } catch (err) {
    console.error("Token 解码失败:", err);
  }
};
</script>

<style scoped>
.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 230px;
  min-height: 100vh;
}

/* 所有菜单项的字体变大 */
.el-menu-item span,
.el-sub-menu__title span {
  font-size: 16px;
}

/* 标题项字体更大且加粗 */
.menu-title {
  font-size: 20px;
  font-weight: bold;
}

#side-title {
  font-size: 20px;
  font-weight: bold;
  color: #ffffff; /* 建议设置为白色或自定义色 */
}

.el-menu-item:hover#side-title {
  background-color: transparent !important;
  color: #ffffff !important;
  cursor: default; 
}

</style>
