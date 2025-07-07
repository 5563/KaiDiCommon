<script setup>
import { defineModel, nextTick, onBeforeUnmount, ref, watch } from 'vue';

import axios from 'axios';
import {
  ElButton,
  ElDialog,
  ElInput,
  ElLoading,
  ElMessage,
} from 'element-plus';

import { myCesium } from './cesiumObj.js';

const lng = defineModel('lng');
const lat = defineModel('lat');
let mineCesium;
const poiList = ref([]);
const selectedPoi = ref(null);
const searchQuery = ref('');
const longitude = ref(lng.value);
const latitude = ref(lat.value);
const dialogVisible = ref(false);

// 监听对话框显示状态
watch(dialogVisible, (val) => {
  if (val) {
    // 每次打开对话框时初始化地图
    nextTick(() => {
      initMap();
    });
  } else {
    // 关闭时清理地图实例
    if (mineCesium) {
      mineCesium.destroy?.();
      mineCesium = null;
    }
  }
});

// 初始化地图
const initMap = () => {
  setTimeout(() => {
    mineCesium = new myCesium('mapContainer111', { useTian: true });
    mineCesium.setCallback(0, (lng, lat) => {
      longitude.value = lng;
      latitude.value = lat;
    });

    // 如果有初始经纬度值,自动定位到该位置
    if (lng.value && lat.value) {
      mineCesium.flytoPoint({
        lonlat: `${lng.value},${lat.value}`,
        name: '当前位置',
        address: ''
      });
    }
  }, 200);
};

// 监听经纬度变化,自动更新地图位置
watch([lng, lat], ([newLng, newLat]) => {
  if (mineCesium && newLng && newLat) {
    mineCesium.flytoPoint({
      lonlat: `${newLng},${newLat}`,
      name: '当前位置',
      address: ''
    });
  }
});

// 打开对话框
const openDialog = () => {
  dialogVisible.value = true;
};

// 关闭对话框
const handleClose = () => {
  dialogVisible.value = false;
};

// 确认选择
const handleConfirm = () => {
  lng.value = longitude.value;
  lat.value = latitude.value;
  dialogVisible.value = false;
};

// 搜索地点
const handleSearch = () => {
  const tk = '760564bd76c08f98ab63213b20119687';
  const specify = '156321300';
  const url = `https://api.tianditu.gov.cn/v2/search?postStr=${encodeURIComponent(
    JSON.stringify({
      keyWord: searchQuery.value,
      queryType: 12,
      start: 0,
      count: 20,
      specify,
    }),
  )}&type=query&tk=${tk}`;

  const loading = ElLoading.service({
    lock: true,
    text: 'Loading',
    background: 'rgba(0, 0, 0, 0.5)',
  });

  axios(url)
    .then((response) => {
      poiList.value = response?.data?.pois ?? [];
      if (poiList.value.length === 0) {
        ElMessage.warning('未查到此地位置');
      }
    })
    .finally(() => {
      loading.close();
    });
};

// 选择POI点
const selectPoi = (index) => {
  selectedPoi.value = index;
  const poi = poiList.value[index];
  // 从 lonlat 字符串中获取经纬度
  const [lng, lat] = poi.lonlat.split(',').map(Number);
  // 更新经纬度值
  longitude.value = lng;
  latitude.value = lat;
  // 地图飞行到选中位置
  mineCesium.flytoPoint({
    lonlat: poi.lonlat,
    name: poi.name,
    address: poi.address,
  });
};

// 添加 watch 来监听 props 变化
watch(
  () => lng,
  (newVal) => {
    longitude.value = newVal;
  },
);

watch(
  () => lat,
  (newVal) => {
    latitude.value = newVal;
  },
);

// 组件卸载时清理地图实例
onBeforeUnmount(() => {
  if (mineCesium) {
    mineCesium.destroy?.();
    mineCesium = null;
  }
});

defineExpose({
  openDialog,
});
</script>

<template>
  <div class="coordinates-selector">
    <div class="input-wrapper">
      <ElInput v-model="lng" placeholder="请输入经度" class="coordinate-input" />
      <ElInput v-model="lat" placeholder="请输入纬度" class="coordinate-input" />
      <ElButton type="primary" @click="openDialog" class="select-btn">
        选择位置
      </ElButton>
    </div>

    <ElDialog
      v-model="dialogVisible"
      :before-close="handleClose"
      append-to-body
      destroy-on-close
      title="位置选择"
      width="85%"
      custom-class="map-dialog"
    >
      <div class="map-wrapper">
        <div id="mapContainer111" class="map-view"></div>
        
        <div class="toolbar">
          <div class="search-container">
            <ElInput
              v-model="searchQuery"
              placeholder="搜索地点"
              class="search-input"
              clearable
            />
            <ElButton type="primary" @click="handleSearch">
              搜索
            </ElButton>
          </div>
          <div class="help-text">点击地图选择位置</div>
        </div>
        
        <div class="coordinates-display" v-if="longitude || latitude">
          <div class="value">{{ longitude ? longitude.toFixed(6) : '0.000000' }}</div>
          <div class="divider"></div>
          <div class="value">{{ latitude ? latitude.toFixed(6) : '0.000000' }}</div>
        </div>
        
        <div v-if="poiList.length > 0" class="results-panel">
          <div class="results-header">
            <span>搜索结果</span>
            <span class="results-count">{{ poiList.length }}</span>
          </div>
          <div class="results-list">
            <div
              v-for="(poi, index) in poiList"
              :key="poi.hotPointID"
              :class="{ active: selectedPoi === index }"
              class="result-item"
              @click="selectPoi(index)"
            >
              <div class="result-name">{{ poi.name }}</div>
              <div class="result-address">{{ poi.address }}</div>
            </div>
          </div>
        </div>
      </div>
      
      <template #footer>
        <div class="dialog-footer">
          <ElButton @click="dialogVisible = false">取消</ElButton>
          <ElButton type="primary" @click="handleConfirm">确定</ElButton>
        </div>
      </template>
    </ElDialog>
  </div>
</template>

<style lang="scss" scoped>
.coordinates-selector {
  --primary-color: #409EFF;
  --primary-light: #ecf5ff;
  --text-primary: #303133;
  --text-regular: #606266;
  --text-secondary: #909399;
  --border-color: #dcdfe6;
  --background: #f5f7fa;
  --background-light: #ffffff;
  --shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  --radius: 4px;
  --spacing: 12px;
  
  width: 100%;
}

.input-wrapper {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 10px;
  background-color: var(--background-light);
  border-radius: var(--radius);
  padding: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.coordinate-input {
  flex: 1;
  
  :deep(.el-input__inner) {
    border: none;
    background: transparent;
  }
}

.separator {
  width: 1px;
  height: 20px;
  background-color: var(--border-color);
  margin: 0 var(--spacing);
}

.select-btn {
  border-radius: var(--radius);
}

.map-dialog {
  :deep(.el-dialog__header) {
    border-bottom: 1px solid var(--border-color);
    padding: 16px 20px;
  }
  
  :deep(.el-dialog__body) {
    padding: 0;
  }
  
  :deep(.el-dialog__footer) {
    border-top: 1px solid var(--border-color);
    padding: 12px 20px;
  }
}

.map-wrapper {
  position: relative;
  width: 100%;
  height: 70vh;
}

.map-view {
  width: 100%;
  height: 100%;
}

.toolbar {
  position: absolute;
  top: 16px;
  left: 16px;
  right: 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  z-index: 10;
}

.search-container {
  display: flex;
  gap: 8px;
  background: rgba(255, 255, 255, 0.9);
  padding: 8px 12px;
  border-radius: var(--radius);
  box-shadow: var(--shadow);
  backdrop-filter: blur(4px);
  max-width: 450px;
}

.search-input {
  width: 300px;
}

.help-text {
  background: rgba(0, 0, 0, 0.6);
  color: white;
  padding: 6px 12px;
  border-radius: var(--radius);
  font-size: 12px;
  font-weight: 500;
}

.coordinates-display {
  position: absolute;
  bottom: 16px;
  left: 16px;
  display: flex;
  align-items: center;
  background: rgba(0, 0, 0, 0.75);
  backdrop-filter: blur(4px);
  color: white;
  border-radius: var(--radius);
  padding: 10px 16px;
  font-family: 'Roboto Mono', monospace;
  font-size: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.value {
  letter-spacing: 0.5px;
}

.divider {
  height: 20px;
  width: 1px;
  background-color: rgba(255, 255, 255, 0.3);
  margin: 0 12px;
}

.results-panel {
  position: absolute;
  top: 16px;
  right: 16px;
  width: 320px;
  max-height: calc(100% - 32px);
  background-color: white;
  border-radius: var(--radius);
  box-shadow: var(--shadow);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  z-index: 10;
}

.results-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background-color: var(--background);
  color: var(--text-primary);
  font-weight: 500;
  border-bottom: 1px solid var(--border-color);
}

.results-count {
  background-color: var(--primary-color);
  color: white;
  border-radius: 10px;
  padding: 2px 8px;
  font-size: 12px;
  font-weight: 500;
}

.results-list {
  overflow-y: auto;
  flex: 1;
}

.result-item {
  padding: 12px 16px;
  border-bottom: 1px solid var(--border-color);
  cursor: pointer;
  transition: background-color 0.2s;
  
  &:hover {
    background-color: var(--background);
  }
  
  &.active {
    background-color: var(--primary-light);
    border-left: 3px solid var(--primary-color);
    padding-left: 13px;
  }
  
  &:last-child {
    border-bottom: none;
  }
}

.result-name {
  color: var(--text-primary);
  font-weight: 500;
  margin-bottom: 4px;
}

.result-address {
  color: var(--text-secondary);
  font-size: 13px;
  line-height: 1.4;
}

@media (max-width: 768px) {
  .toolbar {
    flex-direction: column;
    align-items: stretch;
    top: 8px;
    left: 8px;
    right: 8px;
  }
  
  .search-container {
    width: 100%;
    margin-bottom: 8px;
  }
  
  .search-input {
    width: 100%;
  }
  
  .help-text {
    text-align: center;
  }
  
  .results-panel {
    width: calc(100% - 16px);
    max-height: 40vh;
    top: auto;
    bottom: 60px;
  }
}
</style>
