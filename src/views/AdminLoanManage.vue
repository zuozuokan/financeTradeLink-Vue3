<template>
  <div>
    <h2>融资申请管理</h2>
    <el-table :data="applications" style="width: 100%; margin-top: 20px;">
      <el-table-column prop="applicantName" label="申请人" width="120" />
      <el-table-column prop="projectName" label="项目名称" width="180" />
      <el-table-column prop="amount" label="申请金额" width="120" />
      <el-table-column prop="status" label="状态" width="100">
        <template #default="scope">
          <el-tag :type="scope.row.status === '待审核' ? 'warning' : (scope.row.status === '已通过' ? 'success' : 'danger')">
            {{ scope.row.status }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="description" label="项目描述" />
      <el-table-column prop="createTime" label="申请时间" width="180" />
      <el-table-column label="操作" width="180">
        <template #default="scope">
          <el-button v-if="scope.row.status === '待审核'" size="small" type="success" @click="review(scope.row, '已通过')">通过</el-button>
          <el-button v-if="scope.row.status === '待审核'" size="small" type="danger" @click="review(scope.row, '已拒绝')">拒绝</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
// 你需要实现这些API
// import { getFinacingApplications, reviewFinacingApplication } from '@/api/adminLoan'

const applications = ref([])

function fetchApplications() {
  // 示例数据，实际应调用API
  applications.value = [
    { id: 1, applicantName: '张三', projectName: '草莓种植扩建', amount: 50000, status: '待审核', description: '扩大草莓种植面积', createTime: '2024-06-01 10:00' },
    { id: 2, applicantName: '李四', projectName: '蓝莓冷链物流', amount: 80000, status: '已通过', description: '建设冷链物流系统', createTime: '2024-06-02 09:00' }
  ]
  // getFinacingApplications().then(res => { applications.value = res.data })
}

function review(row, status) {
  // reviewFinacingApplication(row.id, status).then(fetchApplications)
  // 本地模拟：
  const idx = applications.value.findIndex(a => a.id === row.id)
  if (idx !== -1) {
    applications.value[idx].status = status
  }
}

onMounted(fetchApplications)
</script>

<style scoped>
.el-table {
  margin-top: 20px;
}
</style> 