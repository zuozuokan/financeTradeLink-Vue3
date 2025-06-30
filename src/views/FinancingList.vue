<template>
    <div id="content">
        <UserManageSideBar />
         <el-card class="loan-management">
    <template #header>
      <div class="card-header">
        <span>融资管理</span>
      </div>
    </template>
    <el-table :data="applications" border style="width: 100%">
      <el-table-column prop="loanApplicationAmount" label="金额（元）" width="120">
        <template #default="{ row }">
          <el-input-number v-model="row.loanApplicationAmount" @change="val => updateAmount(row, val)" :min="1000" :step="1000" />
        </template>
      </el-table-column>

      <el-table-column prop="loanApplicationPurpose" label="用途" width="200">
        <template #default="{ row }">
          <el-input v-model="row.loanApplicationPurpose" @blur="() => updatePurpose(row)" />
        </template>
      </el-table-column>

      <el-table-column prop="loanApplicationRepayPlan" label="还款计划" width="160">
        <template #default="{ row }">
          <el-input v-model="row.loanApplicationRepayPlan" @blur="() => updateRepayPlan(row)" />
        </template>
      </el-table-column>

      <el-table-column prop="loanApplicationStatus" label="状态" width="100" />
      <el-table-column prop="loanApplicationCreatedTime" label="创建时间" width="180" />

      <el-table-column label="操作" width="150">
        <template #default="{ row }">
          <el-button size="small" type="warning" @click="cancelApplication(row)" :disabled="row.loanApplicationStatus === 'cancelled'">取消</el-button>
          <el-button size="small" type="danger" @click="deleteApplication(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </el-card>
    </div>
</template>

<script setup>
import UserManageSideBar from '@/components/UserManageSideBar.vue';
import { ref, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  getUserLoanApplications,
  updateLoanAmount,
  updateLoanPurpose,
  updateLoanRepayPlan,
  updateLoanStatus,
  deleteLoanApplication,
} from '@/api/loan'
import { jwtDecode } from 'jwt-decode'

const token = localStorage.getItem('token')
const payload = jwtDecode(token)
const userUuid = payload.uuid

const applications = ref([])

const fetchApplications = async () => {
  const res = await getUserLoanApplications(userUuid)
  console.log(res)
  if (res.code === 200) {
    applications.value = res.results || []
  } else {
    ElMessage.error('获取融资列表失败')
  }
}

onMounted(() => {
  fetchApplications()
})

const updateAmount = async (row, value) => {
  const res = await updateLoanAmount(row.loanApplicationUuid, value)
  if (res.code !== 200) ElMessage.error('更新金额失败')
}

const updatePurpose = async (row) => {
  const res = await updateLoanPurpose(row.loanApplicationUuid, row.loanApplicationPurpose)
  if (res.code !== 200) ElMessage.error('更新用途失败')
}

const updateRepayPlan = async (row) => {
  const res = await updateLoanRepayPlan(row.loanApplicationUuid, row.loanApplicationRepayPlan)
  if (res.code !== 200) ElMessage.error('更新还款计划失败')
}

const cancelApplication = async (row) => {
  try {
    await ElMessageBox.confirm('确定要取消该融资申请吗？', '提示', {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning',
    })
    const res = await updateLoanStatus(row.loanApplicationUuid, 'cancelled')
    if (res.code === 200) {
      ElMessage.success('已取消')
      fetchApplications()
    } else {
      ElMessage.error('取消失败')
    }
  } catch {}
}

const deleteApplication = async (row) => {
  try {
    await ElMessageBox.confirm('此操作将永久删除该申请，是否继续？', '警告', {
      confirmButtonText: '删除',
      cancelButtonText: '取消',
      type: 'warning',
    })
    console.log("userUuid:", userUuid)
    console.log("loanApplicationUuid:", row.loanApplicationUuid)
    const res = await deleteLoanApplication(userUuid, row.loanApplicationUuid)
    if (res.code === 200) {
      ElMessage.success('删除成功')
      fetchApplications()
    } else {
      ElMessage.error('删除失败')
    }
  } catch {}
}



</script>

<style scoped>
#content {
    display: flex;
}

.loan-management {
  padding: 20px;
}
.card-header {
  font-size: 18px;
  font-weight: bold;
}

</style>
