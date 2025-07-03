<template>
  <div>
    <el-tabs v-model="activeTab" @tab-change="fetchUsers">
      <el-tab-pane label="普通用户" name="normal"></el-tab-pane>
      <el-tab-pane label="银行用户" name="bank"></el-tab-pane>
      <el-tab-pane label="专家用户" name="expert"></el-tab-pane>
    </el-tabs>

    <el-table :data="userList" style="margin: 20px 0;">
      <el-table-column prop="userUserName" label="用户名" />
      <el-table-column prop="userRole" label="角色" />
      <el-table-column prop="userStatus" label="状态" :formatter="getUserStatusText" />
      <el-table-column prop="userName" label="姓名" />
      <el-table-column prop="userPhone" label="电话" />
      <el-table-column label="操作" width="120">
        <template #default="scope">
          <el-button size="small" @click="openEditDialog(scope.row)">编辑</el-button>
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

    <el-dialog v-model="editDialogVisible" title="编辑用户">
      <el-form :model="editUser" label-width="80px">
        <el-form-item label="用户名">
          <el-input v-model="editUser.userUserName" />
        </el-form-item>
        <el-form-item label="角色">
          <el-select v-model="editUser.userRole">
            <el-option label="普通用户" value="USER" />
            <el-option label="银行用户" value="BANK" />
            <el-option label="专家用户" value="EXPERT" />
          </el-select>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="editUser.userStatus">
            <el-option label="启用" value="1" />
            <el-option label="封禁" value="0" />
            <el-option label="注销" value="2" />
          </el-select>
        </el-form-item>
        <el-form-item label="姓名">
          <el-input v-model="editUser.userName" />
        </el-form-item>
        <el-form-item label="电话">
          <el-input v-model="editUser.userPhone" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="editDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitEdit">保存</el-button>
      </template>
    </el-dialog>
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
} from '@/api/admin/adminUser'; // 你需要实现这些API
import { updateUserAPI } from '@/api/user';

const activeTab = ref('normal');
const userList = ref([]);
const registerForm = ref({ username: '', password: '' });
const editDialogVisible = ref(false);
const editUser = ref({});

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
    fetchUsers();
  } else if (activeTab.value === 'expert') {
    await registerExpertAPI(registerForm.value.username, registerForm.value.password);
    fetchUsers();
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

function getUserStatusText(cell) {
  switch (String(cell.userStatus)) {
    case "1":
      return '启用'
    case "0":
      return '封禁'
    case "2":
      return '注销'
    default:
      return '未知'
  }
}

function openEditDialog(row) {
  editUser.value = { ...row };
  editDialogVisible.value = true;
}

async function submitEdit() {
  try {
    await updateUserAPI(editUser.value);
    ElMessage.success('保存成功');
    editDialogVisible.value = false;
    fetchUsers();
  } catch (e) {
    ElMessage.error('保存失败');
  }
}

onMounted(fetchUsers);
watch(activeTab, fetchUsers);
</script>
