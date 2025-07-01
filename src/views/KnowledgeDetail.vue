<template>
  <div v-if="detail">
    <el-card>
      <el-image :src="detail.cover" style="width: 100%; height: 220px; object-fit: cover; margin-bottom: 20px;" fit="cover" />
      <h2>{{ detail.title }}</h2>
      <div style="margin-bottom: 10px;">
        <el-tag size="small" type="info" style="margin-right: 5px;">{{ detail.author }}</el-tag>
        <el-tag size="small" type="success" style="margin-right: 5px;">{{ detail.category }}</el-tag>
        <el-tag size="small" type="warning">浏览量: {{ detail.views }}</el-tag>
      </div>
      <div style="color: #888; margin-bottom: 10px;">发布时间：{{ detail.time }}</div>
      <el-divider />
      <div style="font-size: 16px; line-height: 1.8;">{{ detail.content }}</div>
    </el-card>
  </div>
  <div v-else>
    <el-empty description="未找到该知识内容" />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { getKnowledgeListAPI } from '@/api/KnowledgeBase'

const route = useRoute()
const detail = ref(null)

async function fetchDetail() {
  const id = route.params.id
  // 用列表API查找单条（如有详情API可替换）
  const res = await getKnowledgeListAPI({})
  const records = res.results?.records || []
  const item = records.find(k => String(k.knowledgeId) === String(id))
  if (item) {
    detail.value = {
      id: item.knowledgeId,
      cover: item.knowledgeCoverImg,
      title: item.knowledgeTitle,
      author: item.knowledgeAuthorUuid,
      category: item.knowledgeCategory,
      content: item.knowledgeContent,
      time: item.knowledgeCreatedTime,
      views: item.knowledgeViews
    }
  } else {
    detail.value = null
  }
}

onMounted(fetchDetail)
</script> 