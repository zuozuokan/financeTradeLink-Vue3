<template>
  <div>
    <el-button type="primary" @click="openAddDialog">新增知识内容</el-button>
    <el-table :data="knowledgeList" style="margin: 20px 0;">
      <el-table-column prop="knowledgeTitle" label="标题" />
      <el-table-column prop="knowledgeCategory" label="分类" />
      <el-table-column prop="knowledgeAuthorUuid" label="作者ID" />
      <el-table-column prop="knowledgeStatus" label="状态" />
      <el-table-column label="操作" width="180">
        <template #default="scope">
          <el-button size="small" @click="openEditDialog(scope.row)">编辑</el-button>
          <el-button size="small" type="danger" @click="delKnowledge(scope.row.knowledgeUuid)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 新增/编辑弹窗 -->
    <el-dialog :title="dialogTitle" v-model="dialogVisible">
      <el-form :model="form" label-width="80px">
        <el-form-item label="标题">
          <el-input v-model="form.knowledgeTitle" />
        </el-form-item>
        <el-form-item label="分类">
          <el-input v-model="form.knowledgeCategory" />
        </el-form-item>
        <el-form-item label="内容">
          <el-input v-model="form.knowledgeContent" type="textarea" />
        </el-form-item>
        <!-- 你可以根据需要添加更多字段 -->
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitForm">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { ElMessage } from 'element-plus';
import {
  getAllKnowledgeAPI,
  addKnowledgeAPI,
  updateKnowledgeAPI,
  deleteKnowledgeAPI
} from '@/api/admin/adminKnowledge'; // 你需要实现这些API

const knowledgeList = ref([]);
const dialogVisible = ref(false);
const dialogTitle = ref('新增知识内容');
const form = ref({});

const fetchList = async () => {
  const res = await getAllKnowledgeAPI();
  knowledgeList.value = res.results || [];
};

const openAddDialog = () => {
  dialogTitle.value = '新增知识内容';
  form.value = {};
  dialogVisible.value = true;
};

const openEditDialog = (row) => {
  dialogTitle.value = '编辑知识内容';
  form.value = { ...row };
  dialogVisible.value = true;
};

const submitForm = async () => {
  if (!form.value.knowledgeTitle || !form.value.knowledgeContent) {
    ElMessage.warning('请填写完整信息');
    return;
  }
  if (form.value.knowledgeUuid) {
    await updateKnowledgeAPI(form.value);
    ElMessage.success('更新成功');
  } else {
    await addKnowledgeAPI(form.value);
    ElMessage.success('新增成功');
  }
  dialogVisible.value = false;
  fetchList();
};

const delKnowledge = async (uuid) => {
  await deleteKnowledgeAPI(uuid);
  ElMessage.success('删除成功');
  fetchList();
};

onMounted(fetchList);
</script>

<style scoped>
</style> 