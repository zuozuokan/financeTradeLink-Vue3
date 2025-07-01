<template>
  <el-row class="tac">
    <el-col :span="25">
      <el-menu
        active-text-color="#ffd04b"
        background-color="#545c64"
        class="el-menu-vertical-demo"
        text-color="#fff"
        default-active=""
        @open="handleOpen"
        @close="handleClose"
        @select="handleMenuSelect"
      >
        <!-- 标题项，不可点击 -->
        <el-menu-item @click.stop.prevent id="side-title">
          <el-icon><Location /></el-icon>
          <span class="menu-title">融销通平台导航栏</span>
        </el-menu-item>

        <!-- 手动跳转菜单项 -->
        <el-menu-item @click="router.push('/home')">
          <el-icon><IconMenu /></el-icon>
          <span>首页</span>
        </el-menu-item>

        <el-menu-item @click="router.push('/agricultural-knowledge-base')">
          <el-icon><Document /></el-icon>
          <span>农业知识库</span>
        </el-menu-item>

        <el-sub-menu index="4">
          <template #title>
            <el-icon><ShoppingCart /></el-icon>
            <span>购物指南</span>
          </template>
          <el-menu-item @click="router.push('/product')">农业商品</el-menu-item><!--Product大写啊-->
           <!-- 新增：仅USER角色(只有农民可发布商品)可见的子目录 -->
              <!-- <el-menu-item 
                v-if="role1 === 'USER'" 
                @click="router.push('/product/organic')"
              >
                商品发布
              </el-menu-item> -->
          <el-menu-item @click="router.push('/shopping-cart')">我的购物车</el-menu-item>
          <el-menu-item @click="router.push('/order-checkout')">我的订单</el-menu-item>

          
        </el-sub-menu>

        <el-menu-item @click="goToAdminByRole">
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
const token1 = localStorage.getItem('token');
  const payload1 = jwtDecode(token1);
  const userUuid1 = payload1.uuid;
  const role1 = payload1.role;
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
  font-size: 17px;
}

/* 标题项字体更大且加粗 */
.menu-title {
  font-size: 20px;
  font-weight: bold;
}

#side-title {
  font-size: 20px;
  font-weight: bold;
  color: #ffffff; 
}

.el-menu-item:hover#side-title {
  background-color: transparent !important;
  color: #ffffff !important;
  cursor: default; 
}

</style>
