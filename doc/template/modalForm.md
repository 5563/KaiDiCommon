# 弹框

## 新增修改弹框模版

```vue
<template>
  <ElDialog v-model="visible" :title="computedTitle" width="800px" @close="cancal">
    <ElForm ref="formRef" :rules="rules" :model="ruleFrom" v-loading="loading">    
        <ElRow :gutter="20">
            <FormItem v-model="ruleFrom.roleName" label="楼栋名称" :span="12" prop="roleName" />
        
        </ElRow>
        <!-- 确认取消 -->
         <div style="text-align: right;">
          <ElButton @click="cancal">取消</ElButton>
          <ElButton type="primary" @click="submit">确定</ElButton>
         </div>
    </ElForm>
  </ElDialog>
</template>
<script setup>
import { ref, computed } from 'vue'
import { ElDialog, ElForm, ElRow } from 'element-plus'
import FormItem from '@common/components/LBWFormItem/index.vue'
import { deepClone } from '@common/utils/index.js'
import { updateRoom as updateApi, addRoom as addApi } from '@/api/baseApi'
import { ElMessage } from 'element-plus'
const loading = ref(false)
const formRef = ref(null)
const visible = ref(false)
const source = ref('add')
const optionsRuleForm = {
  roleName: undefined,
}
const ruleFrom = ref(deepClone(optionsRuleForm))

const computedTitle = computed(() => {
  return {
    'edit': '编辑',
    'add': '新增',
  }[source.value] || '新增'
})
const rules = ref({
  roleName: [
    { required: true, message: '请输入楼栋名称', trigger: 'change' },
  ],
})
const showModal = (row = undefined, tempSource) => {
  ruleFrom.value = deepClone(optionsRuleForm)
  source.value = tempSource || (row ? 'edit' : 'add');
  if (row) {
    ruleFrom.value = deepClone({ ...ruleFrom.value, ...row });
  }
  formRef.value && formRef.value.resetFields()
  visible.value = true;
};


const cancal = () => {
  visible.value = false
}
const emit = defineEmits(['success'])
const submit = () => {
  formRef.value.validate(valid => {
    if (valid) {
      loading.value = true
      let tempApi = source.value === 'add' ? addApi : updateApi
      tempApi(ruleFrom.value).then(() => {
          ElMessage.success('编辑成功')
          emit('success')
          cancal()
      })
      .finally(() => {
        loading.value = false
      })
    }
  })
}
defineExpose({
  showModal,
})
</script>
<style lang="scss" scoped>
</style>
```
## 弹框table模版

```vue
<template>
  <ElDialog v-model="visible" :autoLoad="false" :title="computedTitle" width="800px" @close="cancal">
    <LBWTable
      v-model:queryParams="queryParams"
      v-model:staticQueryParams="staticQueryParams"
      :columns="columns"
      :loadApi="getRoomList"
      ref="LBWTableRef"
      :autoLoad="false"
    >
      <template #searchButtonRight>
        <!-- <el-button type="primary" @click="$refs.AddEditModalRef.showModal()">新增</el-button> -->
      </template>
      <template #action="{ row, deleteRow }">
        <!-- <el-button type="primary" text size="small" @click="() => $refs.AddEditModalRef.showModal(row)">编辑</el-button>
                <el-button type="primary" text size="small" @click="() => $refs.AddEditModalRef.showModal(row, 'add')">复制</el-button>
                <el-button type="danger" text size="small" @click="deleteRow(deleteRoom, row)">删除</el-button> -->
      </template>
    </LBWTable>
  </ElDialog>
</template>
<script setup>
import { ref, computed, nextTick } from 'vue'
import { ElDialog } from 'element-plus'
import LBWTable from '@common/components/LBWTable/LBWTable.vue'
import { getRoomList, deleteRoom } from '@/api/baseApi'

const visible = ref(false)
const queryParams = ref({})
const staticQueryParams = ref({})
const LBWTableRef = ref(null)

const columns = ref([
  { label: '角色名称', prop: 'roleName', search: true },
  { label: '角色描述', prop: 'roleDesc' },
  { label: '操作', prop: 'action', width: '200', align: 'center' },
])

const computedTitle = computed(() => {
  return '弹框列表'
})
const showModal = (row) => {
  staticQueryParams.value.enterpriseId = 1
  visible.value = true
  nextTick(() => {
    LBWTableRef.value.loadData()
  })
}

const cancal = () => {
  visible.value = false
}

defineExpose({
  showModal,
})
</script>
<style lang="scss" scoped></style>

```
