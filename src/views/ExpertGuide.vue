<template>
    <div class="agri-platform">
        <UserManageSideBar />
      <div class="consult-container">
        
        <!-- 标题区域 -->
        <div class="header">
          <h1>专家咨询平台</h1>
          <p>与行业专家面对面，解决您的专业问题</p>
        </div>
  
        <!-- 搜索区域 -->
        <div class="search-bar">
          <div class="search-input">
            
            <input
              type="text"
              v-model="searchQuery"
              placeholder="搜索专家名称或擅长领域..."
              @input="filterExperts"
            />
          </div>
          <div class="filter-section">
            <span>咨询类型:</span>
            <div class="filter-buttons">
              <button
                v-for="type in consultTypes"
                :key="type.value"
                :class="{ active: selectedType === type.value }"
                @click="selectType(type.value)"
              >
                {{ type.label }}
              </button>
            </div>
          </div>
        </div>
  
        <!-- 专家卡片展示 -->
        <div class="experts-grid">
          <div
            v-for="expert in filteredExperts"
            :key="expert.expertUuid"
            class="expert-card"
          >
            <div class="card-content">
              <div class="top-section">
                <!-- 左侧：头像 -->
                <div class="expert-avatar">
                  <img
                    :src="expert.expertHeadshotUrl"
                    alt="专家头像"
                    class="avatar"
                  />
                  <!-- 资质认证 -->
                  <div
                    class="certificate-badge"
                    v-if="expert.expertCertificateUrl"
                    @click="showCertificate(expert.expertCertificateUrl)"
                  >
                    <!-- <span class="material-icons"></span> -->
                    <img src="../assets/images/verified.png" alt="Verified">
                    资质认证
                  </div>
                </div>
  
                <!-- 右侧：专家信息 -->
                <div class="expert-info">
                  <div class="expert-header">
                    <h2>{{ expert.expertName }}</h2>
                    <!-- 职称 -->
                    <div class="expert-title">{{ expert.expertTitle }}</div>
                  </div>
  
                  <!-- 电话 -->
                  <div class="expert-contact">
                    <!-- <span class="material-icons">phone</span> -->
                    <img src="../assets/images/dianhua.png" alt="Verified">
                    <span>{{ expert.expertphone }}</span>
                  </div>
  
                  <!-- 擅长领域 -->
                  <div class="expert-specialty">
                    <!-- <span class="material-icons">star</span> -->
                    <img src="../assets/images/star.png" alt="Verified">
                    <span>擅长领域: {{ expert.expertSpecialty }}</span>
                  </div>
                </div>
              </div>
  
              <!-- 简介 -->
              <div class="expert-intro">
                <p>{{ expert.expertIntroduction || '暂无个人简介' }}</p>
              </div>
            </div>
  
            <!-- 立即预约按钮 -->
            <button class="consult-button" @click="openBookingModal(expert)">
              立即预约
              <!-- <span class="material-icons">arrow_forward</span> -->
              <img src="../assets/images/toright.png" alt="Verified">
            </button>
          </div>
        </div>
      </div>
  
      <!-- 预约模态框 -->
      <div class="modal-overlay" v-if="showBookingModal">
        <div class="booking-modal">
          <div class="modal-header">
            <h2>预约专家咨询</h2>
            <button class="close-button" @click="closeBookingModal">
              &times;
            </button>
          </div>
  
          <div class="expert-summary">
            <img :src="selectedExpert.expertHeadshotUrl" alt="专家头像" />
            <div>
              <h3>{{ selectedExpert.expertName }}</h3>
              <!-- 职称（与卡片一致） -->
              <div class="modal-title">{{ selectedExpert.expertTitle }}</div>
            </div>
          </div>
  
          <form @submit.prevent="submitBooking">
            <div class="form-group">
              <label for="consultTitle">
                咨询标题<span class="required">*</span>
              </label>
              <input
                type="text"
                id="consultTitle"
                v-model="bookingData.consultTitle"
                placeholder="请简要描述咨询主题"
                required
              />
            </div>
  
            <div class="form-group">
              <label for="consultType">
                咨询类型<span class="required">*</span>
              </label>
              <select
                id="consultType"
                v-model="bookingData.consultType"
                required
              >
                <option value="" disabled>请选择咨询类型</option>
                <option value="online">线上咨询</option>
                <option value="offline">线下咨询</option>
              </select>
            </div>
  
            <div class="form-group">
              <label for="consultDescription">
                咨询内容<span class="required">*</span>
              </label>
              <textarea
                id="consultDescription"
                v-model="bookingData.consultDescription"
                placeholder="请详细描述您的问题（至少50字）"
                rows="4"
                required
              ></textarea>
            </div>
  
            <div class="form-group">
              <label for="appointTime">
                预约时间<span class="required">*</span>
              </label>
              <input
                type="datetime-local"
                id="appointTime"
                v-model="bookingData.consultAppointTime"
                required
              />
            </div>
  
            <!-- 表单底部提示 -->
            <div class="form-note">
              <p>
                <span class="required">*</span> 为必填项。预约成功后，专家将在24小时内确认
              </p>
            </div>
  
            <div class="form-actions">
              <button type="button" class="cancel-btn" @click="closeBookingModal">
                取消
              </button>
              <button type="submit" class="submit-btn">提交预约</button>
            </div>
          </form>
        </div>
      </div>
  
      <!-- 证书大图弹窗 -->
      <div class="certificate-modal" v-if="showCertificateDialog">
        <div class="modal-overlay-cert" @click="showCertificateDialog = false"></div>
        <div class="modal-content-cert">
          <div class="modal-header-cert">
            <h3>资质证书</h3>
            <button class="close-button" @click="showCertificateDialog = false">
              &times;
            </button>
          </div>
          <img :src="currentCertificate" alt="专家资质证书" />
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, computed , onMounted} from 'vue'
import UserManageSideBar from "@/components/UserManageSideBar.vue";
import { 
    getExpertListAPI, 
    addConsultAPI 
} from "@/api/consult";
import { jwtDecode } from "jwt-decode";
import { ElMessage } from "element-plus";

const token = localStorage.getItem("token");
const payload = jwtDecode(token);
const userUuid = payload.uuid;
  const experts = ref([]); 
  const searchQuery = ref('')
  const selectedType = ref('')
  const showBookingModal = ref(false)
  const selectedExpert = ref(null)
  const showCertificateDialog = ref(false)
  const currentCertificate = ref('')
  
  // 咨询类型选项
  const consultTypes = ref([
    { value: '水稻栽培', label: '水稻栽培' },
    { value: '病虫害防治', label: '病虫害防治' },
    { value: '品种改良', label: '品种改良' },
    { value: '农业', label: '农业' },
    { value: '土壤', label: '土壤' },
  ])
  
  // 预约表单数据
  const bookingData = ref({
    consultTitle: '',
    consultType: '',
    consultDescription: '',
    consultAppointTime: '',
  })
  // 加载专家数据
const loadExperts = async () => {
    try {
       
        const response = await getExpertListAPI(userUuid);
        
        if (response.code === 200) {
            experts.value = response.results;
        } else {
            console.error('获取专家列表失败:', response.results);
            
        }
    } catch (error) {
        console.error('请求专家列表出错:', error);
       
    }
}
onMounted(() => {
    loadExperts();
  });
  // 过滤专家逻辑
  const filterExperts = () => {
    filteredExperts.value = experts.value.filter((expert) => {
      const matchesSearch =
        expert.expertName.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
        expert.expertTitle.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
        expert.expertSpecialty.toLowerCase().includes(searchQuery.value.toLowerCase())
      const matchesType =
        !selectedType.value || expert.expertSpecialty.includes(selectedType.value)
      return matchesSearch && matchesType
    })
  }
  
  // 计算属性：过滤后的专家列表
  const filteredExperts = computed(() => {
    if (!searchQuery.value && !selectedType.value) {
      return experts.value
    }
    return experts.value.filter((expert) => {
      const matchesSearch =
        expert.expertName.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
        expert.expertTitle.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
        expert.expertSpecialty.toLowerCase().includes(searchQuery.value.toLowerCase())
      const matchesType =
        !selectedType.value || expert.expertSpecialty.includes(selectedType.value)
      return matchesSearch && matchesType
    })
  })
  
  // 选择咨询类型
  const selectType = (type) => {
    selectedType.value = selectedType.value === type ? '' : type
    filterExperts()
  }
  
  // 打开预约模态框
  const openBookingModal = (expert) => {
    selectedExpert.value = expert
    showBookingModal.value = true
    // 重置表单数据
    bookingData.value = {
      consultTitle: '',
      consultType: '',
      consultDescription: '',
      consultAppointTime: '',
    }
  }
  
  // 关闭预约模态框
  const closeBookingModal = () => {
    showBookingModal.value = false
  }
  
  // 显示证书
  const showCertificate = (certUrl) => {
    currentCertificate.value = certUrl
    showCertificateDialog.value = true
  }
  
// 提交预约
const submitBooking = async () => {
    try {
        
        
        // 构造咨询对象
        const consultData = {
            consultUserUuid: userUuid,
            consultExpertUuid: selectedExpert.value.expertUuid,
            consultType: bookingData.value.consultType,
            consultTitle: bookingData.value.consultTitle,
            consultDescription: bookingData.value.consultDescription,
            consultAppointTime: new Date(bookingData.value.consultAppointTime).toISOString()
        };
        
        const response = await addConsultAPI(userUuid, consultData);
        console.log("res:",response)
        if (response.code === 200) {
            // alert(`预约提交成功！\n\n专家: ${selectedExpert.value.expertName}`);
            ElMessage.success(`预约提交成功！\n\n专家: ${selectedExpert.value.expertName}`)
            closeBookingModal();
        } else {
          // console.log("res.results:",response.results)
            ElMessage.error(`预约提交失败:${response.results}`)
            // console.error('预约提交失败:', response.results);
            // alert('预约提交失败，请稍后再试');
        }
    } catch (error) {
      ElMessage.error('预约提交失败:',error)
        // console.error('提交预约出错:', error);
        // alert('请求出错，请检查网络连接');
    }
}
  </script>
  
  <style scoped>
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  }
  
  body {
    background-color: #f8f9fa;
    color: #333;
    line-height: 1.6;
  }
  
  .agri-platform {
    display: flex;
    min-height: 100vh;
  }
  
  .consult-container {
    flex: 1;
    padding: 2rem;
    max-width: 1400px;
    margin: 0 auto;
  }
  
  /* 标题样式 */
  .header {
    text-align: center;
    margin-bottom: 2.5rem;
    animation: fadeInDown 0.8s ease;
  }
  
  .header h1 {
    font-size: 2.5rem;
    margin-bottom: 0.5rem;
    font-weight: 700;
    background: linear-gradient(45deg, #3498db, #2c3e50);
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
  }
  
  .header p {
    font-size: 1.2rem;
    color: #7f8c8d;
    max-width: 600px;
    margin: 0 auto;
  }
  
  /* 搜索区域 */
  .search-bar {
    display: flex;
    flex-wrap: wrap;
    gap: 1.5rem;
    margin-bottom: 2rem;
    background: white;
    border-radius: 12px;
    padding: 1.5rem;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  }
  
  .search-input {
    flex: 1;
    min-width: 300px;
    position: relative;
  }
  
  .search-input input {
    width: 100%;
    padding: 12px 20px 12px 40px;
    border: 1px solid #e0e6ed;
    border-radius: 8px;
    font-size: 1rem;
    transition: all 0.3s ease;
  }
  
  .search-input input:focus {
    border-color: #42b983;
    box-shadow: 0 0 0 3px rgba(66, 185, 131, 0.1);
    outline: none;
  }
  
  .filter-section {
    display: flex;
    align-items: center;
    gap: 1rem;
  }
  
  .filter-section span {
    font-weight: 500;
    color: #2c3e50;
  }
  
  .filter-buttons {
    display: flex;
    flex-wrap: wrap;
    gap: 0.8rem;
  }
  
  .filter-buttons button {
    padding: 8px 16px;
    background: #f8f9fa;
    border: 1px solid #e0e6ed;
    border-radius: 20px;
    font-size: 0.9rem;
    color: #5a6c7d;
    cursor: pointer;
    transition: all 0.2s ease;
  }
  
  .filter-buttons button:hover {
    background: #eef5f2;
    color: #42b983;
  }
  
  .filter-buttons button.active {
    background: #42b983;
    color: white;
    border-color: #42b983;
  }
  
  /* 专家网格布局 */
  .experts-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
    gap: 2rem;
  }
  
  .expert-card {
    background: white;
    border-radius: 16px;
    overflow: hidden;
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.08);
    transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
    display: flex;
    flex-direction: column;
    animation: fadeInUp 0.6s ease;
  }
  
  .expert-card:hover {
    transform: translateY(-8px);
    box-shadow: 0 12px 20px rgba(0, 0, 0, 0.12);
  }
  
  .card-content {
    padding: 1.5rem;
    flex: 1;
  }
  
  .top-section {
    display: flex;
    gap: 1.5rem;
    margin-bottom: 1.2rem;
  }
  
  .expert-avatar {
    position: relative;
  }
  
  .avatar {
    width: 100px;
    height: 100px;
    object-fit: cover;
    border-radius: 50%;
    border: 3px solid #42b983;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }
  
  .certificate-badge {
    position: absolute;
    bottom: -20px;
    width: 100px;
    right: 2px;
    background: #3498db;
    color: white;
    font-size: 0.8rem;
    padding: 4px 8px;
    border-radius: 20px;
    display: flex;
    align-items: center;
    gap: 4px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    cursor: pointer;
    transition: all 0.2s ease;
  }
  
  .certificate-badge:hover {
    background: #2980b9;
    transform: scale(1.05);
  }
  
  .expert-info {
    flex: 1;
  }
  
  .expert-header {
    display: flex;
    align-items: baseline;
    gap: 1rem;
    margin-bottom: 0.7rem;
  }
  
  .expert-header h2 {
    font-size: 1.5rem;
    color: #2c3e50;
  }
  .expert-title {
  display: inline-block;
  background: #e1f0fa;
  color: #3498db;
  font-size: 0.8rem;
  padding: 4px 12px;
  border-radius: 15px;
  font-weight: 600;
}


  
  .expert-contact,
  .expert-specialty {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-bottom: 0.5rem;
    color: #5a6c7d;
  }
  
  .expert-contact span.material-icons,
  .expert-specialty span.material-icons {
    color: #42b983;
    font-size: 1.1rem;
  }
  
  .expert-intro {
    color: #7f8c8d;
    font-size: 0.95rem;
    line-height: 1.6;
    max-height: 100px;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 4;
    -webkit-box-orient: vertical;
  }
  
  .consult-button {
    background: #42b983;
    color: white;
    border: none;
    padding: 12px 20px;
    font-size: 1rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
  }
  
  .consult-button:hover {
    background: #36a26f;
    transform: translateY(-2px);
  }
  
  /* 模态框样式 */
  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 100;
    animation: fadeIn 0.3s ease;
  }
  
  .booking-modal {
    background: white;
    border-radius: 16px;
    width: 100%;
    max-width: 600px;
    box-shadow: 0 12px 24px rgba(0, 0, 0, 0.15);
    overflow: hidden;
    animation: scaleIn 0.3s ease;
  }
  
  .modal-header {
    padding: 1.5rem;
    background: #f8f9fa;
    border-bottom: 1px solid #e0e6ed;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  
  .modal-header h2 {
    font-size: 1.5rem;
    color: #2c3e50;
  }
  
  .close-button {
    background: none;
    border: none;
    font-size: 1.5rem;
    color: #7f8c8d;
    cursor: pointer;
    transition: all 0.2s ease;
  }
  
  .close-button:hover {
    color: #2c3e50;
  }
  
  .expert-summary {
    padding: 1.5rem;
    display: flex;
    align-items: center;
    gap: 1.5rem;
    border-bottom: 1px solid #e0e6ed;
  }
  
  .expert-summary img {
    width: 80px;
    height: 80px;
    object-fit: cover;
    border-radius: 50%;
    border: 3px solid #42b983;
  }
  
  .expert-summary h3 {
    font-size: 1.3rem;
    color: #2c3e50;
    margin-bottom: 0.3rem;
  }
  
  .modal-title {
  display: inline-block;
  background: #e1f0fa;
  color: #3498db;
  font-size: 0.8rem;
  padding: 4px 12px;
  border-radius: 15px;
  font-weight: 600;
}
  
  form {
    padding: 1.5rem;
  }
  
  .form-group {
    margin-bottom: 1.5rem;
  }
  
  .form-group label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: 500;
    color: #2c3e50;
  }
  
  .form-group label .required {
    color: #e74c3c;
  }
  
  .form-group input,
  .form-group select,
  .form-group textarea {
    width: 100%;
    padding: 10px 15px;
    border: 1px solid #e0e6ed;
    border-radius: 8px;
    font-size: 1rem;
    transition: all 0.3s ease;
  }
  
  .form-group input:focus,
  .form-group select:focus,
  .form-group textarea:focus {
    border-color: #42b983;
    box-shadow: 0 0 0 3px rgba(66, 185, 131, 0.1);
    outline: none;
  }
  
  .form-group textarea {
    resize: vertical;
    min-height: 100px;
  }
  
  .form-note {
    margin-top: -1rem;
    margin-bottom: 1.5rem;
    color: #7f8c8d;
    font-size: 0.9rem;
  }
  
  .form-note .required {
    color: #e74c3c;
  }
  
  .form-actions {
    display: flex;
    gap: 1rem;
    justify-content: flex-end;
  }
  
  .cancel-btn,
  .submit-btn {
    padding: 10px 20px;
    border-radius: 8px;
    font-size: 1rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.3s ease;
  }
  
  .cancel-btn {
    background: #f8f9fa;
    color: #5a6c7d;
    border: 1px solid #e0e6ed;
  }
  
  .cancel-btn:hover {
    background: #eef5f2;
  }
  
  .submit-btn {
    background: #42b983;
    color: white;
    border: none;
  }
  
  .submit-btn:hover {
    background: #36a26f;
  }
  .certificate-badge img {
  width: 20px; /* 调整图片大小 */
  height: 20px;
  cursor: pointer; /* 鼠标悬停时显示手型指针 */
}
.expert-contact img{
    width: 20px; /* 调整图片大小 */
  height: 20px;
  
}
.expert-specialty img{
    width: 20px; /* 调整图片大小 */
  height: 20px;
  
}
.consult-button img{
    width: 30px; /* 调整图片大小 */
  height: 30px;
  
}
  /* 证书弹窗样式 */
  .certificate-modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 100;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  
  .modal-overlay-cert {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.7);
  }
  
  .modal-content-cert {
    position: relative;
    background: white;
    border-radius: 12px;
    max-width: 80%;
    max-height: 80%;
    overflow: auto;
    box-shadow: 0 12px 24px rgba(0, 0, 0, 0.2);
  }
  
  .modal-header-cert {
    padding: 1rem 1.5rem;
    background: #f8f9fa;
    border-bottom: 1px solid #e0e6ed;
    display: flex;
    justify-content: space-between;
    align-items: center;
    position: sticky;
    top: 0;
    z-index: 1;
  }
  
  .modal-header-cert h3 {
    font-size: 1.2rem;
    color: #2c3e50;
  }
  
  .modal-content-cert img {
    display: block;
    max-width: 100%;
    height: auto;
    padding: 1.5rem;
  }
  
  /* 动画效果 */
  @keyframes fadeInDown {
    from {
      opacity: 0;
      transform: translateY(-20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
  
  @keyframes scaleIn {
    from {
      opacity: 0;
      transform: scale(0.95);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }
  </style>