<template>
    <div class="loan-application-container">
      <el-alert
        v-if="!isBankRole"
        title="身份信息错误，无权操作"
        type="error"
        closable
        show-icon
      ></el-alert>
  
      <div v-else>
        <!-- 🔥 改为两个独立的查询表单
        <el-form :inline="true" :model="queryForm" class="mb-4">
          <el-form-item label="用户 UUID">
            <el-input v-model="queryForm.userUuid" placeholder="请输入用户 UUID" />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleSearchByUserUuid">
              查询用户申请
            </el-button>
          </el-form-item>
        </el-form> -->
  
        <el-form :inline="true" :model="queryForm" class="mb-4">
          <el-form-item label="融资项目号">
            <el-input v-model="queryForm.loanProjectNo" placeholder="请输入融资项目号" />
          </el-form-item>
          <el-form-item>
            <el-button type="success" @click="handleSearchByProjectNo">
              查询项目详情
            </el-button>
          </el-form-item>
        </el-form>
  
        <!-- 表格展示 -->
        <el-table
          :data="tableData"
          border
          stripe
          style="width: 100%; margin-top: 20px"
        >
          <el-table-column prop="loanApplicationUuid" label="贷款 UUID" />
          <el-table-column prop="loanApplicationAmount" label="融资金额" />
          <el-table-column prop="loanApplicationStatus" label="申请状态" />
          <el-table-column prop="bankAdvice" label="银行建议">
            <template #default="scope">
              <el-input
                v-model="scope.row.bankAdvice"
                placeholder="请输入建议"
              />
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template #default="scope">
              <el-button
                type="primary"
                @click="handleSubmitAdvice(scope.row)"
              >
                提交建议
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, reactive, onMounted } from 'vue';
  import { ElAlert, ElForm, ElFormItem, ElInput, ElButton, ElTable, ElTableColumn, ElMessage } from 'element-plus';
  import { jwtDecode } from 'jwt-decode';
  // 🔥 保持原有 API 引用不变（根据实际路径调整）
  import { 
    getLoanListByUserUuidAPI,
    getLoanDetailAPIByLoadUuis, // 使用你提供的新 API
    loadAdviceAPI
  } from '../api/load';
import { SoldOut } from '@element-plus/icons-vue';
  
  // 状态管理
  const queryForm = reactive({
    // userUuid: '',
    loanProjectNo: ''
  });
  const tableData = ref([]);
  const isBankRole = ref(false);
  
  // 从 token 获取用户信息
  const token = localStorage.getItem('token');
  const payload = jwtDecode(token);
  const userUuid = payload.uuid;
  const role = payload.role;
  
const refreshRes = ref(null); // 用于存储刷新后的结果
  /**
   * 🔥 根据用户 UUID 查询融资申请列表
   */
 // 初始化加载
 onMounted(() => {
    isBankRole.value = role === 'BANK';
    
    // 如果有用户UUID，则加载该用户的贷款申请列表
    if (userUuid) {
        handleSearchByUserUuid();
    }
  });
  
   /**
   * 根据用户 UUID 查询融资申请列表
   */
   const handleSearchByUserUuid = async () => {
    // 使用从token中获取的userUuid
    const searchUuid = userUuid ;
    
    if (!searchUuid) {
      return ElMessage.warning('请输入用户 UUID');
    }
  
    try {
      const res = await getLoanListByUserUuidAPI(searchUuid);
     // console.log('查询结果:',getLoanListByUserUuidAPI(searchUuid )); // 调试输出
      console.log('查询结果:', res); // 调试输出
      if (res.data.code === 200) {
        tableData.value = res.data.results ;
        ElMessage.success(`查询成功，共 ${tableData.value.length} 条记录`);
      } else {
        ElMessage.error(res.data.msg || '查询失败');
      }
    } catch (error) {
      ElMessage.error('网络错误，请重试');
    }
  };
  
  /**
   * 🔥 根据融资项目号查询单个申请
   */
  const handleSearchByProjectNo = async () => {
    if (!queryForm.loanProjectNo) {
      return ElMessage.warning('请输入融资项目号');
    }
  
    try {
      const res = await getLoanDetailAPIByLoadUuis(queryForm.loanProjectNo);
    //  console.log('查询结果:', res); // 调试输出
      if (res.data.code === 200) {
     //   console.log('查询结果22:', res.data.results); // 调试输出
        tableData.value = [res.data.results]; // 单个数据转数组
        ElMessage.success('查询成功');
      } else {
        ElMessage.error(res.msg || '查询失败');
      }
    } catch (error) {
      ElMessage.error('网络错误，请重试');
    }
  };
  
  /**
   * 提交银行建议
   */
  const handleSubmitAdvice = async (row) => {
    if (!row.bankAdvice) {
      return ElMessage.warning('请输入建议内容');
    }
    const submitRes = await  loadAdviceAPI(row.loanApplicationUuid, row.bankAdvice);
     console.log('提交结果:', submitRes); // 调试输出
     if(submitRes.data.code === 200) {
      ElMessage.success('提交建议成功');
    }else{
        ElMessage.error('提交失败：' + (submitRes.msg || '未知错误'));
        
    }
        await refreshTableData();//修改后刷新数据
   
        
    
    };

  
const refreshTableData = async () => {
  try {
    if (!queryForm.loanProjectNo) {
      const res = await getLoanListByUserUuidAPI(userUuid);
      if (res.data.code === 200) {
        tableData.value = res.data.results;
      }
    } else {
      const res = await getLoanDetailAPIByLoadUuis(queryForm.loanProjectNo);
      if (res.data.code === 200) {
        tableData.value = [res.data.results];
      }
    }
  } catch (e) {
    ElMessage.error('刷新失败');
  }
};

  </script>
  
  <style scoped>
  .loan-application-container {
    padding: 20px;
  }
  .mb-4 {
    margin-bottom: 16px;
  }
  </style>