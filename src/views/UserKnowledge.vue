<template>
  <div id="content" class="agri-platform">
    <UserManageSideBar />
    <el-card class="knowledge-management">
      <template #header>
        <div class="card-header">
          <div class="card-header">
            <span class="title-text">我的知识管理</span>
            <div class="header-decoration">
              <div class="leaf-decoration"></div>
            </div>
          </div>
        </div>
      </template>
      <el-table
        :data="knowledgeList"
        border
        style="width: 100%"
        class="agri-table"
        header-row-class-name="agri-table-header"
        row-class-name="agri-table-row"
      >
        <el-table-column prop="knowledgeTitle" label="标题" width="300">
          <template #default="{ row }">
            <el-input
              v-if="row.isEditing"
              v-model="row.knowledgeTitle"
              class="agri-input"
            />
            <span v-else class="agri-text">{{ row.knowledgeTitle }}</span>
          </template>
        </el-table-column>

        <el-table-column prop="knowledgeCategory" label="分类" width="200">
          <template #default="{ row }">
            <el-input
              v-if="row.isEditing"
              v-model="row.knowledgeCategory"
              class="agri-input"
            />
            <span v-else class="agri-text">{{ row.knowledgeCategory }}</span>
          </template>
        </el-table-column>

        <el-table-column prop="knowledgeStatus" label="状态" width="120">
          <template #default="{ row }">
            <!-- <el-select v-if="row.isEditing" v-model="row.knowledgeStatus">
              <el-option label="草稿" value="draft" />
              <el-option label="发布" value="published" />
              <el-option label="待审核" value="pending" />
            </el-select>
            <span v-else>{{ row.knowledgeStatus }}</span> -->
          </template>
        </el-table-column>

        <el-table-column prop="knowledgeContent" label="内容">
          <template #default="{ row }">
            <el-input
              v-if="row.isEditing"
              type="textarea"
              v-model="row.knowledgeContent"
              rows="2"
              class="agri-textarea"
            />
            <span v-else class="content-preview agri-text">{{
              row.knowledgeContent
            }}</span>
          </template>
        </el-table-column>

        <el-table-column label="操作">
          <template #default="{ row }">
            <template v-if="row.isEditing">
              <el-button
                size="large"
                type="success"
                @click="saveEdit(row)"
                class="agri-btn agri-btn-save"
              >
                <i class="icon-check"></i>保存</el-button
              >
              <el-button
                size="large"
                @click="cancelEdit(row)"
                class="agri-btn agri-btn-cancel"
              >
                <i class="icon-close"></i>取消</el-button
              >
            </template>
            <template v-else>
              <el-button
                size="large"
                @click="enableEdit(row)"
                class="agri-btn agri-btn-edit"
              >
                <i class="icon-edit"></i>编辑</el-button
              >
              <el-button
                size="large"
                type="danger"
                @click="deleteKnowledge(row)"
                class="agri-btn agri-btn-delete"
              >
                <i class="icon-delete"></i>删除</el-button
              >
            </template>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script setup>
import UserManageSideBar from "@/components/UserManageSideBar.vue";
import { ref, onMounted } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { getKnowledgeList, delKnowledgeByUuid, updateKnowledge } from "@/api/knowledge";
import { jwtDecode } from "jwt-decode";

const token = localStorage.getItem("token");
const payload = jwtDecode(token);
const userUuid = payload.uuid;

const knowledgeList = ref([]);
const originalMap = ref({});

const fetchList = async () => {
  const res = await getKnowledgeList(1, 100, "", "");
  if (res.code === 200) {
    const records = res.results?.records || [];
    knowledgeList.value = records.map((k) => ({ ...k, isEditing: false }));
    originalMap.value = Object.fromEntries(
      records.map((k) => [k.knowledgeUuid, { ...k }])
    );
  } else {
    ElMessage.error("加载知识列表失败");
  }
};

onMounted(() => {
  fetchList();
});

const enableEdit = (row) => {
  row.isEditing = true;
};

const cancelEdit = (row) => {
  const origin = originalMap.value[row.knowledgeUuid];
  Object.assign(row, { ...origin, isEditing: false });
};

const saveEdit = async (row) => {
  const updated = {
    knowledgeTitle: row.knowledgeTitle,
    knowledgeCategory: row.knowledgeCategory,
    knowledgeStatus: row.knowledgeStatus,
    knowledgeContent: row.knowledgeContent,
  };
  const res = await updateKnowledge(row.knowledgeUuid, updated);
  if (res.code === 200) {
    ElMessage.success("更新成功");
    row.isEditing = false;
    originalMap.value[row.knowledgeUuid] = { ...row };
  } else {
    ElMessage.error("更新失败");
  }
};

const deleteKnowledge = async (row) => {
  try {
    await ElMessageBox.confirm("此操作将永久删除该知识，是否继续？", "警告", {
      confirmButtonText: "删除",
      cancelButtonText: "取消",
      type: "warning",
    });
    const res = await delKnowledgeByUuid(row.knowledgeUuid);
    if (res.code === 200) {
      ElMessage.success("删除成功");
      fetchList();
    } else {
      ElMessage.error("删除失败");
    }
  } catch {}
};
</script>

<style scoped lang="scss">
/* 新增农业主题配色 */
$primary-green: #4CAF50;
$light-green: #8BC34A;
$dark-green: #388E3C;
$earth-brown: #795548;
$wheat-yellow: #FFD54F;
$background: #f5f7f0;

/* 基础布局 */
#content.agri-platform {
  display: flex;
  min-height: 100vh;
  background-color: $background;
}

.knowledge-management {
  flex: 1;
  padding: 20px;
  margin: 20px;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  border: none;
  background-color: white;
  
  &:deep(.el-card__header) {
    border-bottom: 1px solid rgba($primary-green, 0.2);
    padding: 16px 20px;
    background: linear-gradient(to right, rgba($light-green, 0.1), white);
  }
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  
  .title-text {
    font-size: 20px;
    font-weight: 600;
    color: $dark-green;
    position: relative;
    padding-left: 12px;
    
    &::before {
      content: '';
      position: absolute;
      left: 0;
      top: 50%;
      transform: translateY(-50%);
      height: 70%;
      width: 4px;
      background-color: $primary-green;
      border-radius: 2px;
    }
  }
  
  .header-decoration {
    position: relative;
    
    .leaf-decoration {
      width: 24px;
      height: 24px;
      background-color: $light-green;
      mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath d='M17 8C8 10 5.9 16.17 3.82 21.34l1.89.66c.51-1.53 1.2-2.98 2.04-4.34C8.14 17.05 9 16.2 10 15.36c3.14-2.3 4.73-3.91 6.54-6.63C17.25 7.22 17 8 17 8M12 6c0-1.78.78-3.37 2-4.45 1.39 1.15 2.24 2.97 2.45 5 .03.34.05.68.05 1 0 1.9-.54 3.64-1.44 5.14-.9 1.5-2.16 2.7-3.63 3.5-1.48.8-3.16 1.19-4.88 1.19-1.15 0-2.3-.18-3.39-.5a9.98 9.98 0 0 0 2.39-3.28C9.04 11.68 12 6 12 6m9 11v2h-8v-2h8z'/%3E%3C/svg%3E");
      mask-repeat: no-repeat;
      mask-position: center;
    }
  }
}

/* 表格样式 */
:deep(.agri-table) {
  border-radius: 8px;
  overflow: hidden;
  
  .agri-table-header th {
    background-color: rgba($primary-green, 0.1);
    color: $dark-green;
    font-weight: 600;
    padding: 12px 0;
    border-bottom: 1px solid rgba($primary-green, 0.2);
  }
  
  .agri-table-row {
    transition: all 0.3s ease;
    
    &:hover {
      background-color: rgba($light-green, 0.05);
    }
    
    td {
      padding: 12px 0;
      border-color: rgba($primary-green, 0.1);
    }
  }
}

/* 输入框样式 */
.agri-input, .agri-textarea {
  &:deep(.el-input__wrapper) {
    border-radius: 6px;
    box-shadow: 0 0 0 1px rgba($primary-green, 0.3);
    
    &:hover {
      box-shadow: 0 0 0 1px $primary-green;
    }
    
    &.is-focus {
      box-shadow: 0 0 0 1px $primary-green;
    }
  }
}

.agri-textarea {
  &:deep(.el-textarea__inner) {
    border-radius: 6px;
    border: 1px solid rgba($primary-green, 0.3);
    resize: vertical;
    
    &:hover {
      border-color: $primary-green;
    }
    
    &:focus {
      border-color: $primary-green;
      box-shadow: 0 0 0 1px $primary-green;
    }
  }
}

/* 按钮样式 */
.agri-btn {
  border-radius: 6px;
  font-weight: 500;
  padding: 8px 12px;
  transition: all 0.2s ease;
  
  i {
    margin-right: 4px;
    font-size: 14px;
  }
}

.agri-btn-edit {
  background-color: rgba($wheat-yellow, 0.1);
  border-color: rgba($wheat-yellow, 0.5);
  color: darken($wheat-yellow, 30%);
  
  &:hover {
    background-color: rgba($wheat-yellow, 0.2);
    border-color: $wheat-yellow;
  }
}

.agri-btn-save {
  background-color: rgba($primary-green, 0.1);
  border-color: rgba($primary-green, 0.5);
  color: $dark-green;
  
  &:hover {
    background-color: rgba($primary-green, 0.2);
    border-color: $primary-green;
  }
}

.agri-btn-cancel {
  background-color: rgba(#9E9E9E, 0.1);
  border-color: rgba(#9E9E9E, 0.5);
  color: #616161;
  
  &:hover {
    background-color: rgba(#9E9E9E, 0.2);
    border-color: #9E9E9E;
  }
}

.agri-btn-delete {
  &:hover {
    opacity: 0.9;
  }
}

/* 文本样式 */
.agri-text {
  color: #424242;
  font-size: 14px;
}

.content-preview {
  display: inline-block;
  max-height: 50px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  width: 100%;
}

/* 图标字体（使用Element Plus自带的图标） */
.icon-check:before { content: "\2713"; }
.icon-close:before { content: "\2715"; }
.icon-edit:before { content: "\270E"; }
.icon-delete:before { content: "\1F5D1"; }
</style>