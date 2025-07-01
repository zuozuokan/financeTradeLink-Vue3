<template>
  <div>
    <h2>公告管理</h2>
    <el-button type="primary" @click="openAddDialog">发布公告</el-button>
    <el-table :data="notices" style="width: 100%; margin-top: 20px;">
      <el-table-column prop="title" label="标题" width="200" />
      <el-table-column prop="content" label="内容" />
      <el-table-column prop="createTime" label="发布时间" width="180" />
      <el-table-column label="操作" width="120">
        <template #default="scope">
          <el-button size="small" @click="openEditDialog(scope.row)">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 公告表单对话框 -->
    <el-dialog :title="isEdit ? '修改公告' : '发布公告'" v-model="dialogVisible">
      <el-form :model="form">
        <el-form-item label="标题">
          <el-input v-model="form.title" />
        </el-form-item>
        <el-form-item label="内容">
          <el-input type="textarea" v-model="form.content" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
// 你需要实现这些API
// import { getNotices, addNotice, updateNotice } from '@/api/adminNotice'

const notices = ref([])
const dialogVisible = ref(false)
const isEdit = ref(false)
const form = reactive({
  id: null,
  title: '',
  content: ''
})

function fetchNotices() {
  // 示例数据，实际应调用API
  notices.value = [
    { id: 1, title: '系统维护', content: '本周五晚系统维护', createTime: '2024-06-01 10:00' },
    { id: 2, title: '新功能上线', content: '积分商城已上线', createTime: '2024-06-02 09:00' }
  ]
  // getNotices().then(res => { notices.value = res.data })
}

function openAddDialog() {
  isEdit.value = false
  form.id = null
  form.title = ''
  form.content = ''
  dialogVisible.value = true
}

function openEditDialog(row) {
  isEdit.value = true
  form.id = row.id
  form.title = row.title
  form.content = row.content
  dialogVisible.value = true
}

function handleSubmit() {
  if (isEdit.value) {
    // updateNotice(form.id, form).then(fetchNotices)
    // 这里只做本地模拟
    const idx = notices.value.findIndex(n => n.id === form.id)
    if (idx !== -1) {
      notices.value[idx] = { ...form, createTime: notices.value[idx].createTime }
    }
  } else {
    // addNotice(form).then(fetchNotices)
    // 本地模拟
    notices.value.push({ ...form, id: Date.now(), createTime: new Date().toLocaleString() })
  }
  dialogVisible.value = false
}

onMounted(fetchNotices)
</script>

<style scoped>
.el-table {
  margin-top: 20px;
}
</style> 