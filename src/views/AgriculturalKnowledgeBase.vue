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
        <el-card v-for="item in knowledgeList" :key="item.id" style="margin-bottom: 20px;" class="el-card-body">
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
                <span>发布时间：{{formatDate( item.time )}}</span>
                <el-button type="text" @click="goDetail(item.id,item.authorUuId)">详情</el-button>
              </div>
            </el-col>
          </el-row>
        </el-card>
      </el-col>

      <!-- 右侧：热度榜单 -->
      <el-col :span="8">
        <el-card>
          <div style="font-weight: bold; font-size: 16px; margin-bottom: 10px;">热度榜单</div>
          <div class="hot-list">
            <div
                v-for="(hot, idx) in hotList"
                :key="hot.id"
                class="hot-item"
                :class="{
            'hot-top': idx === 0,
            'hot-highlight': idx < 3,
            'hot-first': idx === 0,
            'hot-second': idx === 1,
            'hot-third': idx === 2
          }"
                @click="goDetail(hot.id, hot.uuid)"
                style="cursor: pointer;"
            >
              <!-- 排名图标和数字 -->
              <div class="rank-wrapper">
                <span v-if="idx === 0" class="rank-icon first-icon">🥇</span>
                <span v-else-if="idx === 1" class="rank-icon second-icon">🥈</span>
                <span v-else-if="idx === 2" class="rank-icon third-icon">🥉</span>
                <span v-else class="hot-rank">{{ idx + 1 }}</span>
              </div>
              <span class="hot-title" :title="hot.title">{{ hot.title }}</span>
              <el-tag size="small" type="warning" class="hot-views">
                热度 {{ hot.views }}
                <span v-if="idx < 3" class="trend-tag">
              <i v-if="idx === 0" class="el-icon-s-top"></i>
              <i v-else-if="idx === 1" class="el-icon-s-claim"></i>
              <i v-else-if="idx === 2" class="el-icon-s-goods"></i>
            </span>
              </el-tag>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>


<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getKnowledgeListAPI } from '@/api/KnowledgeBase'
import { userGetCurrentInfoAPI }from '@/api/user.js'
import {likeKnowledgeByUuid,viewKnowledgeByUuid} from "@/api/knowledge.js";
import {ElMessage} from "element-plus";

const router = useRouter()
// 搜索与分组
const search = ref('')
const selectedCategory = ref('')
const categories = ref([])

// 知识点列表
const knowledgeList = ref([])
// 热度榜单（前3名特殊处理）
const hotList = ref([])
const authorNameMap = ref(new Map())

// 格式化时间
const formatDate = (date) => {
  if (!date) return "未知";
  return new Date(date).toLocaleString("zh-CN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
};

// 跳转详情页
async function goDetail(id, userUuid) {
  const res = await viewKnowledgeByUuid(userUuid);
  if (res.code === 200) {
    router.push(`/knowledge/${id}`)
  } else {
    ElMessage.error(res.results);
  }
}

// 根据标题匹配 authorUuId
const findAuthorUuId = (title) => {
  const match = knowledgeList.value.find(item => item.title === title)
  return match ? match.authorUuId : ''
}

// 获取知识点列表
async function fetchKnowledge() {
  try {
    const params = {}
    if (search.value) params.keyword = search.value
    if (selectedCategory.value) params.category = selectedCategory.value

    const res = await getKnowledgeListAPI(params)
    let records = res.results?.records || []

    // 前端本地模糊过滤
    if (search.value) {
      const kw = search.value.toLowerCase()
      records = records.filter(item =>
          (item.knowledgeTitle && item.knowledgeTitle.toLowerCase().includes(kw)) ||
          (item.knowledgeCategory && item.knowledgeCategory.toLowerCase().includes(kw)) ||
          (item.knowledgeContent && item.knowledgeContent.toLowerCase().includes(kw))
      )
    }

    // 映射知识点列表
    knowledgeList.value = records.map(item => ({
      id: item.knowledgeId,
      cover: item.knowledgeCoverImg,
      title: item.knowledgeTitle,
      author: item.knowledgeAuthorUuid,
      authorUuId: item.knowledgeUuid,
      category: item.knowledgeCategory,
      description: item.knowledgeContent,
      time: item.knowledgeCreatedTime,
      views: item.knowledgeViews, // 确保浏览量字段正确
    }))

    // 生成分类选项
    const set = new Set()
    knowledgeList.value.forEach(item => {
      if (item.category) set.add(item.category)
    })
    categories.value = Array.from(set)

    // 生成热度榜单（修复排名逻辑）
    hotList.value = [...knowledgeList.value]
        .sort((a, b) => b.views - a.views) // 降序排序
        .slice(0, 5) // 取前5
        .map((item, idx) => ({
          id: item.id,
          uuid:item.authorUuId,
          title: item.title,
          views: item.views,
          rank: idx + 1,
        }))
  } catch (e) {
    knowledgeList.value = []
    hotList.value = []
    categories.value = []
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
.hot-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.hot-item {
  display: flex;
  align-items: center;
  padding: 6px 8px;
  font-size: 15px;
  border-radius: 4px;
  transition: all 0.3s;
}
.hot-item:hover {
  background-color: #f5f7fa;
}
.hot-top {
  background: #fffbe6;
}
.hot-highlight {
  border-left: 3px solid; /* 左侧彩色边框 */
}
.hot-first {
  border-color: #e6a23c; /* 金色 */
  background-color: #fff9eb;
}
.hot-second {
  border-color: #979797; /* 银色 */
  background-color: #f8f8f8;
}
.hot-third {
  border-color: #c084fc; /* 铜色 */
  background-color: #fef0f6;
}
.rank-wrapper {
  display: flex;
  align-items: center;
  margin-right: 8px;
}
.rank-icon {
  font-size: 18px;
  margin-right: 4px;
  font-weight: bold;
}
.first-icon {
  color: #e6a23c; /* 金色 */
}
.second-icon {
  color: #979797; /* 银色 */
}
.third-icon {
  color: #c084fc; /* 铜色 */
}
.hot-rank {
  display: inline-block;
  width: 22px;
  text-align: center;
  font-weight: bold;
  color: #999;
  margin-right: 8px;
}
.hot-top-rank {
  color: #e67e22;
  font-size: 18px;
}
.hot-title {
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  margin-right: 8px;
}
.hot-views {
  margin-left: 4px;
}
.trend-tag {
  margin-left: 4px;
  font-size: 12px;
}

</style>