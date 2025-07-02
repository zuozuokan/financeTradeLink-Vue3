<template>
  <div class="navigation-container">
    <el-menu
      class="agriculture-menu"
      :default-active="activeIndex"
      background-color="#f8f9fa"
      text-color="#495057"
      active-text-color="#28a745"
      @open="handleOpen"
      @close="handleClose"
    >
      <!-- 标题项 -->
      <div class="menu-header">
        <el-icon class="logo-icon"><Location /></el-icon>
        <span class="menu-title">融销通农产品平台</span>
      </div>

      <!-- 首页 -->
      <el-menu-item index="1" @click="router.push('/home')">
        <el-icon class="menu-icon"><IconMenu /></el-icon>
        <span>首页</span>
      </el-menu-item>

      <!-- 个人信息管理 -->
      <el-sub-menu index="2">
        <template #title>
          <el-icon class="menu-icon"><User /></el-icon>
          <span>个人信息管理</span>
        </template>
        <el-menu-item index="2-1" @click="router.push('/user-info-exchange')">
          修改个人信息
        </el-menu-item>
      </el-sub-menu>

      <!-- 农业知识库 -->
      <el-menu-item index="3" @click="router.push('/agricultural-knowledge-base')">
        <el-icon class="menu-icon"><Reading /></el-icon>
        <span>农业知识库</span>
      </el-menu-item>

      <!-- 购物指南 -->
      <el-sub-menu index="4">
        <template #title>
          <el-icon class="menu-icon"><ShoppingCart /></el-icon>
          <span>购物指南</span>
        </template>
        <el-menu-item index="4-1" @click="router.push('/product')">农业商品</el-menu-item>
        <el-menu-item index="4-2" @click="router.push('/shopping-cart')">我的购物车</el-menu-item>
        <el-menu-item index="4-3" @click="router.push('/order-checkout')">我的订单</el-menu-item>
      </el-sub-menu>

      <!-- 后台管理 -->
      <el-menu-item index="5" @click="goToAdminByRole">
        <el-icon class="menu-icon"><Setting /></el-icon>
        <span>后台管理</span>
      </el-menu-item>
    </el-menu>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { useRouter } from "vue-router";
import { jwtDecode } from "jwt-decode";
import {
  Document as Reading,
  Menu as IconMenu,
  Location,
  Setting,
  ShoppingCart,
  User
} from "@element-plus/icons-vue";

const router = useRouter()
const activeIndex = ref('1')

const handleOpen = (key: string, keyPath: string[]) => {
  console.log("打开子菜单:", key, keyPath);
};
const handleClose = (key: string, keyPath: string[]) => {
  console.log("关闭子菜单:", key, keyPath);
};


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

<style scoped lang="scss">
@import "@/styles/variables.scss";

.navigation-container {
  height: 100vh;
  background: linear-gradient(to bottom, #f8f9fa, #e9ecef);
  box-shadow: 2px 0 10px rgba(0, 0, 0, 0.05);
  
  .agriculture-menu {
    border-right: none;
    width: 240px;
    height: 100%;
    transition: all 0.3s ease;
    
    .menu-header {
      display: flex;
      align-items: center;
      padding: 20px 16px;
      margin-bottom: 10px;
      border-bottom: 1px solid #dee2e6;
      
      .logo-icon {
        font-size: 24px;
        color: $agriculture-primary;
        margin-right: 10px;
      }
      
      .menu-title {
        font-size: 18px;
        font-weight: 600;
        color: $agriculture-dark;
        white-space: nowrap;
      }
    }
    
    .el-menu-item, 
    :deep(.el-sub-menu__title) {
      height: 50px;
      line-height: 50px;
      margin: 4px 0;
      border-radius: 8px;
      transition: all 0.2s ease;
      
      &:hover {
        background-color: rgba($agriculture-primary, 0.1) !important;
        color: $agriculture-primary !important;
        
        .menu-icon {
          color: $agriculture-primary;
        }
      }
      
      .menu-icon {
        font-size: 18px;
        margin-right: 10px;
        color: $agriculture-secondary;
      }
      
      span {
        font-size: 15px;
        font-weight: 500;
      }
    }
    
    .el-menu-item.is-active {
      background-color: rgba($agriculture-primary, 0.1) !important;
      color: $agriculture-primary !important;
      font-weight: 600;
      
      .menu-icon {
        color: $agriculture-primary;
      }
    }
    
    :deep(.el-sub-menu) {
      .el-menu {
        background-color: rgba($agriculture-light, 0.3);
        padding-left: 10px;
        
        .el-menu-item {
          height: 44px;
          line-height: 44px;
          margin: 2px 0;
          
          &.is-active {
            background-color: rgba($agriculture-primary, 0.05) !important;
          }
        }
      }
    }
  }
  
  &:hover {
    .agriculture-menu {
      width: 240px;
    }
  }
}
</style>