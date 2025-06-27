<template>
  <div class="user-profile-container">
    <UserManageSideBar />

    <div class="profile-content">
      <div class="profile-header">
        <h2 class="profile-title">个人信息设置</h2>
        <div class="profile-subtitle">更新您的个人资料和偏好设置</div>
      </div>

      <el-card class="profile-card" shadow="hover">
        <el-tabs v-model="activeTab" class="profile-tabs">
          <el-tab-pane label="基本信息" name="basic">
            <div class="form-section">
              <h3 class="form-section-title">个人资料</h3>
              <el-form :model="form" label-position="top" class="profile-form">
                <el-form-item label="昵称" class="form-item">
                  <el-input
                    v-model="form.nickname"
                    placeholder="请输入昵称"
                    class="custom-input"
                  />
                </el-form-item>

                <el-form-item label="手机号" class="form-item">
                  <el-input
                    v-model="form.phone"
                    placeholder="请输入手机号"
                    class="custom-input"
                  />
                </el-form-item>

                <el-form-item label="新密码" class="form-item">
                  <el-input
                    v-model="form.newPassword"
                    type="password"
                    placeholder="输入新密码"
                    show-password
                    class="custom-input"
                  />
                </el-form-item>
              </el-form>
            </div>
          </el-tab-pane>

          <el-tab-pane label="收货地址" name="address">
            <div class="form-section">
              <h3 class="form-section-title">收货信息</h3>
              <el-form :model="form" label-position="top" class="profile-form">
                <div class="address-form-grid">
                  <el-form-item label="收货人姓名" class="form-item">
                    <el-input
                      v-model="form.addressName"
                      placeholder="请输入收货人姓名"
                      class="custom-input"
                    />
                  </el-form-item>

                  <el-form-item label="联系电话" class="form-item">
                    <el-input
                      v-model="form.addressPhone"
                      placeholder="请输入联系电话"
                      class="custom-input"
                    />
                  </el-form-item>

                  <el-form-item label="省份" class="form-item">
                    <el-input
                      v-model="form.addressProvince"
                      placeholder="请输入省份"
                      class="custom-input"
                    />
                  </el-form-item>

                  <el-form-item label="城市" class="form-item">
                    <el-input
                      v-model="form.addressCity"
                      placeholder="请输入城市"
                      class="custom-input"
                    />
                  </el-form-item>

                  <el-form-item label="区县" class="form-item">
                    <el-input
                      v-model="form.addressDistrict"
                      placeholder="请输入区县"
                      class="custom-input"
                    />
                  </el-form-item>

                  <el-form-item label="详细地址" class="form-item">
                    <el-input
                      v-model="form.addressAddress"
                      placeholder="请输入详细地址"
                      class="custom-input"
                    />
                  </el-form-item>
                </div>

                <el-form-item label="设为默认地址" class="form-item">
                  <el-switch
                    v-model="form.addressIsDefault"
                    active-value="1"
                    inactive-value="0"
                    active-text="是"
                    inactive-text="否"
                    class="custom-switch"
                  />
                </el-form-item>
              </el-form>
            </div>
          </el-tab-pane>
        </el-tabs>

        <div class="form-actions">
          <el-button type="primary" @click="updateBaseInfo" class="save-button">
            <span class="button-icon">💾</span>
            保存个人修改
          </el-button>
          <el-button
            type="primary"
            @click="updateAddressInfo"
            class="save-button"
          >
            <span class="button-icon">💾</span>
            保存地址修改
          </el-button>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script setup>
import UserManageSideBar from "@/components/UserManageSideBar.vue";
import { ref } from "vue";
import {
  userUpdatePasswordAPI,
  userUpdateNameAPI,
  userUpdatePhoneAPI,
  userAddAddressAPI,
} from "@/api/user";
import { ElMessage } from "element-plus";
import { jwtDecode } from "jwt-decode";

const token = localStorage.getItem("token");
const payload = jwtDecode(token);
const uuid = payload.uuid;
const role = payload.role;

const activeTab = ref("basic");

const form = ref({
  nickname: "",
  phone: "",
  newPassword: "",
  addressName: "",
  addressPhone: "",
  addressProvince: "",
  addressCity: "",
  addressDistrict: "",
  addressAddress: "",
  addressIsDefault: "0",
});

const updateBaseInfo = async () => {
  if (form.value.phone) {
    const reply = await userUpdatePhoneAPI(uuid, form.value.phone);
    if (reply.code === 200) {
      ElMessage.success(reply.results);
    } else {
      ElMessage.error(reply.results);
    }
  }

  if (form.value.nickname) {
    const reply = await userUpdateNameAPI(uuid, form.value.nickname);
    if (reply.code === 200) {
      ElMessage.success(reply.results);
    } else {
      ElMessage.error(reply.results);
    }
  }
  
  if (form.value.newPassword) {
    const reply = await userUpdatePasswordAPI(uuid, form.value.newPassword);
    if (reply.code === 200) {
      ElMessage.success(reply.results);
    } else {
      ElMessage.error(reply.results);
    }
  }
};

const updateAddressInfo = async () => {
  const addressPayload = {
    addressUserUuid: uuid,
    addressName: form.value.addressName,
    addressPhone: form.value.addressPhone,
    addressProvince: form.value.addressProvince,
    addressCity: form.value.addressCity,
    addressDistrict: form.value.addressDistrict,
    addressAddress: form.value.addressAddress,
    addressIsDefault: form.value.addressIsDefault,
  };
  if (form.value.addressAddress) {
    const reply = await userAddAddressAPI(uuid, addressPayload);
    if (reply.code === 200) {
      ElMessage.success(reply.results);
    } else {
      ElMessage.error(reply.results);
    }
  }
};
</script>

<style scoped lang="scss">
.user-profile-container {
  display: flex;
  min-height: 100vh;
  background-color: #f5f7fa;
}

.profile-content {
  flex: 1;
  padding: 2rem;
  max-width: 900px;
  margin: 0 auto;
}

.profile-header {
  margin-bottom: 2rem;
  text-align: center;
}

.profile-title {
  font-size: 2rem;
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 0.5rem;
  background: linear-gradient(90deg, #409eff, #67c23a);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.profile-subtitle {
  font-size: 1rem;
  color: #7a8ba9;
}

.profile-card {
  border-radius: 12px;
  border: none;
  overflow: hidden;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
  }
}

.profile-tabs {
  :deep(.el-tabs__nav-wrap) {
    padding: 0 2rem;
  }

  :deep(.el-tabs__item) {
    font-weight: 500;
    padding: 0 1.5rem;
    height: 50px;
    color: #7a8ba9;

    &.is-active {
      color: #409eff;
    }
  }

  :deep(.el-tabs__active-bar) {
    height: 3px;
    background: linear-gradient(90deg, #409eff, #67c23a);
  }
}

.form-section {
  padding: 1.5rem 2rem;
}

.form-section-title {
  font-size: 1.2rem;
  font-weight: 500;
  color: #2c3e50;
  margin-bottom: 1.5rem;
  position: relative;
  padding-left: 1rem;

  &::before {
    content: "";
    position: absolute;
    left: 0;
    top: 50%;
    transform: translateY(-50%);
    height: 60%;
    width: 4px;
    background: linear-gradient(to bottom, #409eff, #67c23a);
    border-radius: 2px;
  }
}

.profile-form {
  .form-item {
    margin-bottom: 1.5rem;

    :deep(.el-form-item__label) {
      font-weight: 500;
      color: #5a6c87;
      padding-bottom: 0.5rem;
    }
  }
}

.address-form-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
}

.custom-input {
  :deep(.el-input__inner) {
    border-radius: 8px;
    height: 44px;
    transition: all 0.3s;

    &:focus {
      border-color: #409eff;
    }
  }
}

.custom-switch {
  :deep(.el-switch__core) {
    height: 24px;
    border-radius: 12px;

    &::after {
      width: 20px;
      height: 20px;
      top: 2px;
    }
  }

  :deep(.el-switch__label) {
    color: #5a6c87;
    font-weight: 500;

    &.is-active {
      color: #409eff;
    }
  }
}

.form-actions {
  display: flex;
  justify-content: center;
  padding: 1.5rem 0;
  border-top: 1px solid #f0f2f5;
}

.save-button {
  padding: 0.8rem 2rem;
  font-size: 1rem;
  font-weight: 500;
  border-radius: 8px;
  background: linear-gradient(90deg, #409eff, #67c23a);
  border: none;
  transition: all 0.3s;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(64, 158, 255, 0.3);
  }

  .button-icon {
    margin-right: 0.5rem;
  }
}
</style>