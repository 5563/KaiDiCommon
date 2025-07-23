# table模版

## 简易table模版使用

```vue
<template>
  <div>
    <LBWTable
      v-model:queryParams="queryParams"
      v-model:staticQueryParams="staticQueryParams"
      :columns="columns"
      :loadApi="getRoomList"
      ref="LBWTableRef"
    >
      <template #searchButtonRight>
        <!-- <el-button type="primary" @click="$refs.AddEditModalRef.showModal()">新增</el-button> -->
      </template>
      <template #action="{row, deleteRow}"> 
        <!-- <el-button type="primary" text size="small" @click="() => $refs.AddEditModalRef.showModal(row)">编辑</el-button>
        <el-button type="primary" text size="small" @click="() => $refs.AddEditModalRef.showModal(row, 'add')">复制</el-button>
        <el-button type="danger" text size="small" @click="deleteRow(deleteRoom, row)">删除</el-button> -->
      </template>
    </LBWTable>
    <!-- <AddEditModal ref="AddEditModalRef" @success="$refs.LBWTableRef.loadData()" /> -->
  </div>
</template>
<script setup>
import { ref } from 'vue'
import LBWTable from '@common/components/LBWTable/LBWTable.vue'
import { getRoomList, deleteRoom } from '@/api/baseApi'
// import AddEditModal from './AddEditModal.vue'
import { ElButton } from 'element-plus'

const queryParams = ref({})
const staticQueryParams = ref({
  enterpriseId: 1,
})

const columns = ref([
  { label: '角色名称', prop: 'roleName', search: true },
  { label: '角色描述', prop: 'roleDesc' },
  { label: '操作', prop: 'action', width: "200", align: 'center' },
])
</script>
<style lang="scss" scoped></style>

```

## 左树右Table布局

```vue
<template>
  <div style="height: 100%; display: flex; gap: 10px;">
    <div style="width: 200px; height: 100%; background-color: #fff;">
      左侧树
    </div>
    <LBWTable
      style="flex-grow: 1; width: 0;"
      v-model:queryParams="queryParams"
      v-model:staticQueryParams="staticQueryParams"
      :columns="columns"
      :loadApi="getRoomList"
      ref="LBWTableRef"
    >
      <template #searchButtonRight>
        <el-button type="primary" @click="$refs.ModalTableRef.showModal()">二级弹框</el-button>
      </template>
      <template #action="{row, deleteRow}"> 
        <!-- <el-button type="primary" text size="small" @click="() => $refs.AddEditModalRef.showModal(row)">编辑</el-button>
        <el-button type="primary" text size="small" @click="() => $refs.AddEditModalRef.showModal(row, 'add')">复制</el-button>
        <el-button type="danger" text size="small" @click="deleteRow(deleteRoom, row)">删除</el-button> -->
      </template>
    </LBWTable>
    <!-- <AddEditModal ref="AddEditModalRef" @success="$refs.LBWTableRef.loadData()" /> -->
    <!-- <ModalTable ref="ModalTableRef" /> -->
  </div>
</template>
<script setup>
import { ref } from 'vue'
import LBWTable from '@common/components/LBWTable/LBWTable.vue'
import { getRoomList, deleteRoom } from '@/api/baseApi'
// import AddEditModal from './AddEditModal.vue'
import { ElButton } from 'element-plus'
// import ModalTable from './ModalTable.vue'

const queryParams = ref({})
const staticQueryParams = ref({
  enterpriseId: 1,
})

const columns = ref([
  { label: '角色名称', prop: 'roleName', search: true },
  { label: '角色描述', prop: 'roleDesc' },
  { label: '操作', prop: 'action', width: "200", align: 'center' },
])
</script>
<style lang="scss" scoped></style>

```