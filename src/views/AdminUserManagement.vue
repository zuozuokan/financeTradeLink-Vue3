<template>
  <div>
    <el-tabs v-model="activeTab" @tab-change="fetchUsers">
      <el-tab-pane label="银行用户" name="bank"></el-tab-pane>
      <el-tab-pane label="专家用户" name="expert"></el-tab-pane>
      <el-tab-pane label="普通用户" name="normal"></el-tab-pane>
    </el-tabs>

    <el-table :data="userList" style="margin: 20px 0;">
      <el-table-column prop="userUserName" label="用户名" />
      <el-table-column prop="userRole" label="角色" />
      <el-table-column prop="userStatus" label="状态" />
      <el-table-column prop="userName" label="姓名" />
      <el-table-column prop="userPhone" label="电话" />
      <el-table-column label="操作">
        <template #default="scope">
          <el-button size="small" @click="changeStatus(scope.row, 'ENABLED')" v-if="scope.row.userStatus !== 'ENABLED'">启用</el-button>
          <el-button size="small" @click="changeStatus(scope.row, 'DISABLED')" v-if="scope.row.userStatus !== 'DISABLED'">禁用</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-divider>注册新账号</el-divider>
    <el-form :model="registerForm" inline>
      <el-form-item label="用户名">
        <el-input v-model="registerForm.username" />
      </el-form-item>
      <el-form-item label="密码">
        <el-input v-model="registerForm.password" type="password" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="register">注册{{ registerTypeLabel }}</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, computed } from 'vue';
import { ElMessage } from 'element-plus';
import {
  getAllBanksAPI,
  getAllExpertsAPI,
  getAllUsersAPI,
  operationUserAPI,
  registerBankAPI,
  registerExpertAPI
} from '@/api/adminUser'; // 你需要实现这些API

const activeTab = ref('bank');
const userList = ref([]);
const registerForm = ref({ username: '', password: '' });

const fetchUsers = async () => {
  if (activeTab.value === 'bank') {
    const res = await getAllBanksAPI();
    userList.value = res.results || [];
  } else if (activeTab.value === 'expert') {
    const res = await getAllExpertsAPI();
    userList.value = res.results || [];
  } else {
    const res = await getAllUsersAPI();
    userList.value = res.results || [];
  }
};

const changeStatus = async (row, status) => {
  await operationUserAPI(row.userUuid, status);
  ElMessage.success('操作成功');
  fetchUsers();
};

const register = async () => {
  if (!registerForm.value.username || !registerForm.value.password) {
    ElMessage.warning('请填写用户名和密码');
    return;
  }
  if (activeTab.value === 'bank') {
    await registerBankAPI(registerForm.value.username, registerForm.value.password);
  } else if (activeTab.value === 'expert') {
    await registerExpertAPI(registerForm.value.username, registerForm.value.password);
  } else {
    ElMessage.warning('普通用户请在前台注册');
    return;
  }
  ElMessage.success('注册成功');
  registerForm.value = { username: '', password: '' };
  fetchUsers();
};

const registerTypeLabel = computed(() => {
  if (activeTab.value === 'bank') return '银行账号';
  if (activeTab.value === 'expert') return '专家账号';
  return '';
});

onMounted(fetchUsers);
watch(activeTab, fetchUsers);
</script>
