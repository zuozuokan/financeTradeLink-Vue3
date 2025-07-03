<template>
    <div>
      <h2>融资申请管理</h2>
      <el-tabs v-model="activeTab" @tab-click="filterApplications">
        <el-tab-pane label="未审核" name="pending" />
        <el-tab-pane label="已审核" name="reviewed" />
      </el-tabs>
      <el-table :data="filteredApplications" style="width: 100%; margin-top: 20px;">
        <el-table-column prop="loanApplicationUserUuid" label="申请人ID" width="120" />
        <el-table-column prop="loanApplicationAmount" label="融资金额" width="120" />
        <el-table-column prop="loanApplicationPurpose" label="用途" />
        <el-table-column prop="loanApplicationRepayPlan" label="还款计划" />
        <el-table-column label="状态" width="100">
          <template #default="scope">
            <el-tag :type="statusTagType(scope.row.loanApplicationStatus)">
              {{ statusFormatter(scope.row) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="loanApplicationBankerUuid" label="处理银行人员ID" width="120" />
        <el-table-column prop="loanApplicationCreatedTime" label="创建时间" width="180">
          <template #default="scope">
            {{ formatDateTime(scope.row.loanApplicationCreatedTime) }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180">
          <template #default="scope">
            <el-button v-if="scope.row.loanApplicationStatus === 'pending'" size="small" type="success" @click="review(scope.row, 'approved')">通过</el-button>
            <el-button v-if="scope.row.loanApplicationStatus === 'pending'" size="small" type="danger" @click="review(scope.row, 'rejected')">拒绝</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted, computed } from 'vue'
  import { getLoanApplications, reviewLoanApplication } from '@/api/admin/adminFinancing'
  
  const applications = ref([])
  const activeTab = ref('pending')
  
  const filteredApplications = computed(() => {
    if (activeTab.value === 'pending') {
      return applications.value.filter(a => a.loanApplicationStatus === 'pending')
    } else {
      return applications.value.filter(a => a.loanApplicationStatus !== 'pending')
    }
  })
  
  function statusFormatter(row) {
    switch (row.loanApplicationStatus) {
      case 'pending': return '待审核'
      case 'approved': return '已通过'
      case 'rejected': return '已拒绝'
      default: return row.loanApplicationStatus
    }
  }
  
  function statusTagType(status) {
    switch (status) {
      case 'pending': return 'warning'
      case 'approved': return 'success'
      case 'rejected': return 'danger'
      default: return ''
    }
  }
  
  function formatDateTime(val) {
    if (!val) return ''
    const d = new Date(val)
    const pad = n => n.toString().padStart(2, '0')
    return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`
  }
  
  async function fetchApplications() {
    const res = await getLoanApplications()
    applications.value = res.results || []
  }
  
  async function review(row, status) {
    await reviewLoanApplication(row.loanApplicationUuid, status)
    fetchApplications()
  }
  
  onMounted(fetchApplications)
  </script>
  
  <style scoped>
  .el-table {
    margin-top: 20px;
  }
  </style>
  