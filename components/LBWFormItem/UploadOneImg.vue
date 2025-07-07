<script setup>
import { ref, watch } from 'vue';
import { ElMessage, ElUpload } from 'element-plus';
import { Plus, Loading, Delete } from '@element-plus/icons-vue';
import global from "../../utils/global.js";

// 定义props和emits
const modelValue = defineModel('modelValue');

// 上传的图片URL
const imageUrl = ref('');
// 加载状态
const loading = ref(false);
// 上传组件实例
const uploadRef = ref();

// 获取token和API地址
const token = global.token;
const apiURL = import.meta.env.VITE_BASE_URL;
const appid = global.appId;
const convertOssToUrl = (ossPath) => {
  if (!ossPath) return '';
  // 如果已经是完整的URL格式，直接返回
  if (ossPath.startsWith('http://') || ossPath.startsWith('https://')) {
    return ossPath;
  }
  // 移除 oss:// 前缀并转换为完整URL
  const path = ossPath.replace(
    'oss://',
    'https://kdimage20200722.oss-cn-shenzhen.aliyuncs.com/',
  );
  return `${path}`;
};
// 监听props更新
watch(
  () => modelValue.value,
  (newVal) => {
    imageUrl.value = convertOssToUrl(newVal);
  },
  { immediate: true }
);

// 上传之前的钩子
const beforeUpload = (file) => {
  const isImage = file.type.startsWith('image/');
  const isLt2M = file.size / 1024 / 1024 < 10;

  if (!isImage) {
    ElMessage.error('只能上传图片文件！');
    return false;
  }
  if (!isLt2M) {
    ElMessage.error('图片大小不能超过 10MB！');
    return false;
  }

  loading.value = true;
  return true;
};

// 上传成功的回调
const handleSuccess = (response) => {
  console.log(response);
  loading.value = false;
  if (response.errorCode === 0) {
    imageUrl.value = convertOssToUrl(response.resultData);
    modelValue.value = convertOssToUrl(response.resultData);
    ElMessage.success('上传成功');
  } else {
    ElMessage.error(response.message || '上传失败');
  }
};

// 上传失败的回调
const handleError = () => {
  loading.value = false;
  ElMessage.error('上传失败');
};

// 删除图片
const handleRemove = () => {
  imageUrl.value = '';
  modelValue.value = '';
};
</script>

<template>
  <div class="upload-container">
    <el-upload
      ref="uploadRef"
      :action="`${apiURL}api/common/oss/UploadFile`"
      :headers="{
        Authorization: `Bearer ${token}`,
        appId: appid
      }"
      :data="{
        uploadDir: 'kdimage20200722/root/projecthelper/',
      }"
      :before-upload="beforeUpload"
      :on-success="handleSuccess"
      :on-error="handleError"
      :show-file-list="false"
      class="avatar-uploader"
    >
      <div v-if="imageUrl" class="image-wrapper">
        <img :src="imageUrl" class="avatar" />
        <div class="image-actions">
          <el-icon class="delete-icon" @click.stop="handleRemove">
            <Delete />
          </el-icon>
        </div>
      </div>
      <div v-else class="upload-placeholder">
        <el-icon v-if="loading" class="loading-icon">
          <Loading />
        </el-icon>
        <el-icon v-else class="upload-icon">
          <Plus />
        </el-icon>
        <span class="upload-text">点击上传</span>
      </div>
    </el-upload>
  </div>
</template>

<style lang="scss" scoped>
.upload-container {
  width: 100%;
  display: flex;
}

.avatar-uploader {
  :deep(.el-upload) {
    border: 1px dashed var(--el-border-color);
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    transition: var(--el-transition-duration);

    &:hover {
      border-color: var(--el-color-primary);
    }
  }
}

.upload-placeholder {
  width: 178px;
  height: 178px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.upload-icon,
.loading-icon {
  font-size: 28px;
  color: var(--el-text-color-secondary);
  margin-bottom: 8px;
}

.loading-icon {
  animation: rotating 2s linear infinite;
}

.upload-text {
  color: var(--el-text-color-secondary);
  font-size: 14px;
}

.image-wrapper {
  position: relative;
  width: 178px;
  height: 178px;

  &:hover .image-actions {
    opacity: 1;
  }
}

.image-actions {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background: rgba(0, 0, 0, 0.5);
  opacity: 0;
  transition: opacity 0.3s;
}

.delete-icon {
  color: #fff;
  font-size: 24px;
  cursor: pointer;

  &:hover {
    color: #f56c6c;
  }
}

.avatar {
  width: 178px;
  height: 178px;
  display: block;
  object-fit: cover;
}

@keyframes rotating {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
