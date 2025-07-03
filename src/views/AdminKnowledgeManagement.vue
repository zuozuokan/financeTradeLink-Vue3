<template>
  <div>
    <el-button type="primary" @click="openAddDialog">新增知识内容</el-button>
    <el-table :data="knowledgeList" style="margin: 20px 0;">
      <el-table-column prop="knowledgeTitle" label="标题" />
      <el-table-column prop="knowledgeCategory" label="分类" />
      <el-table-column prop="knowledgeAuthorUuid" label="作者ID" />
      <el-table-column prop="knowledgeStatus" label="状态" />
      <el-table-column prop="knowledgeViews" label="浏览量" />
      <el-table-column prop="knowledgeLikes" label="点赞数" />
      <el-table-column prop="knowledgeIsTop" label="置顶" />
      <el-table-column prop="knowledgeCreatedTime" label="创建时间">
        <template #default="scope">
          {{ formatDateTime(scope.row.knowledgeCreatedTime) }}
        </template>
      </el-table-column>
      <el-table-column label="操作" width="220">
        <template #default="scope">
          <el-button size="small" @click="goDetail(scope.row)">查看</el-button>
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
        <el-form-item label="来源">
          <el-input v-model="form.knowledgeSource" />
        </el-form-item>
        <el-form-item label="封面URL">
          <el-input v-model="form.knowledgeCoverImg" />
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="form.knowledgeStatus">
            <el-option label="待发布" value="pending" />
            <el-option label="已发布" value="published" />
          </el-select>
        </el-form-item>
        <el-form-item label="置顶">
          <el-switch v-model="form.knowledgeIsTop" active-value="true" inactive-value="false" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitForm">保存</el-button>
      </template>
    </el-dialog>

    <!-- 查看弹窗 -->
    <el-dialog title="知识详情" v-model="viewDialogVisible">
      <div style="font-weight:bold; font-size:18px; margin-bottom:10px;">{{ viewItem.knowledgeTitle }}</div>
      <div style="margin-bottom:10px;">分类：{{ viewItem.knowledgeCategory }}</div>
      <div style="margin-bottom:10px;">作者ID：{{ viewItem.knowledgeAuthorUuid }}</div>
      <div style="margin-bottom:10px;">状态：{{ viewItem.knowledgeStatus }}</div>
      <div style="margin-bottom:10px;">浏览量：{{ viewItem.knowledgeViews }} 点赞数：{{ viewItem.knowledgeLikes }}</div>
      <div style="margin-bottom:10px;">置顶：{{ viewItem.knowledgeIsTop }}</div>
      <div style="margin-bottom:10px;">创建时间：{{ viewItem.knowledgeCreatedTime }}</div>
      <el-divider />
      <div style="white-space: pre-line;">{{ viewItem.knowledgeContent }}</div>
      <template #footer>
        <el-button @click="viewDialogVisible = false">关闭</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { ElMessage } from 'element-plus';
import { useRouter } from 'vue-router';
import {
  getAllKnowledgeAPI,
  addKnowledgeAPI,
  updateKnowledgeAPI,
  deleteKnowledgeAPI
} from '@/api/admin/adminKnowledge'; // 你需要实现这些API
import { getKnowledgeListAPI } from '@/api/KnowledgeBase'

const knowledgeList = ref([]);
const dialogVisible = ref(false);
const dialogTitle = ref('新增知识内容');
const form = ref({});
const router = useRouter();
const viewDialogVisible = ref(false);
const viewItem = ref({});

function formatDateTime(val) {
  if (!val) return ''
  const d = new Date(val)
  const pad = n => n.toString().padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`
}

const fetchList = async () => {
  const res = await getKnowledgeListAPI();
  knowledgeList.value = (res.results && res.results.records) || [];
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

const goDetail = (row) => {
  router.push(`/knowledge/${row.knowledgeId}`)
};

const submitForm = async () => {
  if (!form.value.knowledgeTitle || !form.value.knowledgeContent) {
    ElMessage.warning('请填写完整信息');
    return;
  }
  if (form.value.knowledgeUuid) {
    const { knowledgeUuid, ...data } = form.value
    await updateKnowledgeAPI(knowledgeUuid, data)
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