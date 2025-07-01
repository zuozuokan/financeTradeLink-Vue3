<template>
  <div>
    <!-- 搜索与分组 -->
    <el-row :gutter="20" style="margin: 20px;">
      <el-col :span="8">
        <el-input v-model="search" placeholder="搜索知识点..." clearable @keyup.enter="fetchKnowledge" />
      </el-col>
      <el-col :span="6">
        <el-select v-model="selectedCategory" placeholder="选择分类" clearable @change="fetchKnowledge">
          <el-option v-for="cat in categories" :key="cat" :label="cat" :value="cat" />
        </el-select>
      </el-col>
      <el-col :span="2">
        <el-button type="primary" @click="fetchKnowledge">搜索</el-button>
      </el-col>
    </el-row>

    <!-- 主体左右布局 -->
    <el-row :gutter="20">
      <!-- 左侧：知识点列表 -->
      <el-col :span="16">
        <el-card v-for="item in knowledgeList" :key="item.id" style="margin-bottom: 20px;">
          <el-row>
            <el-col :span="4">
              <el-image :src="item.cover" style="width: 100px; height: 70px; object-fit: cover;" fit="cover" />
            </el-col>
            <el-col :span="20">
              <div style="display: flex; align-items: center;">
                <span style="font-size: 18px; font-weight: bold; margin-right: 10px;">{{ item.title }}</span>
                <el-tag size="small" type="info" style="margin-right: 5px;">{{ item.author }}</el-tag>
                <el-tag size="small" type="success" style="margin-right: 5px;">{{ item.category }}</el-tag>
                <el-tag size="small" type="warning">浏览量: {{ item.views }}</el-tag>
              </div>
              <div style="color: #888; margin: 8px 0;">{{ item.description.slice(0, 50) }}...</div>
              <div style="font-size: 12px; color: #aaa; display: flex; justify-content: space-between;">
                <span>发布时间：{{ item.time }}</span>
                <el-button type="text" @click="goDetail(item.id)">详情</el-button>
              </div>
            </el-col>
          </el-row>
        </el-card>
      </el-col>
      <!-- 右侧：热度榜单 -->
      <el-col :span="8">
        <el-card>
          <div style="font-weight: bold; font-size: 16px; margin-bottom: 10px;">热度榜单</div>
          <el-list>
            <el-list-item v-for="hot in hotList" :key="hot.id">
              <span style="font-weight: 500;">{{ hot.title }}</span>
              <el-tag size="small" type="warning" style="float: right;">热读 {{ hot.views }}</el-tag>
            </el-list-item>
          </el-list>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getKnowledgeListAPI } from '@/api/KnowledgeBase'

const router = useRouter()
// 搜索与分组
const search = ref('')
const selectedCategory = ref('')
const categories = ref(['种植技术', '病虫害防治', '农机使用', '政策解读'])

// 知识点列表
const knowledgeList = ref([])
// 热度榜单
const hotList = ref([])

function goDetail(id) {
  router.push(`/knowledge/${id}`)
}

async function fetchKnowledge() {
  try {
    // 默认全部查询
    const params = {}
    if (search.value) params.keyword = search.value
    if (selectedCategory.value) params.category = selectedCategory.value
    // 可加分页参数，如 params.page = 1, params.size = 20
    const res = await getKnowledgeListAPI(params)
    // 适配后端返回结构
    const records = res.results?.records || []
    // 字段适配
    knowledgeList.value = records.map(item => ({
      id: item.knowledgeId,
      cover: item.knowledgeCoverImg,
      title: item.knowledgeTitle,
      author: item.knowledgeAuthorUuid,
      category: item.knowledgeCategory,
      description: item.knowledgeContent,
      time: item.knowledgeCreatedTime,
      views: item.knowledgeViews
    }))
    // 热度榜单：按浏览量排序取前5
    hotList.value = [...knowledgeList.value].sort((a, b) => b.views - a.views).slice(0, 5).map(item => ({ id: item.id, title: item.title, views: item.views }))
  } catch (e) {
    knowledgeList.value = []
    hotList.value = []
  }
}

onMounted(fetchKnowledge)
</script>

<style scoped>
.el-list-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 6px 0;
}
</style>
