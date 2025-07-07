<template>
  <div class="custom-table">
    <div class="search-box">
      <el-form :inline="true">
          <template v-for="item in computedSearchColumns" :key="item.prop">
            <slot :name="item.prop" v-bind="item">
              <FormItem v-model="queryParams[item.prop]" :useCol="false" v-bind="item" />
            </slot>
          </template>
          <FormItem :useCol="false">
              <el-button type="primary" @click="search">搜索</el-button>
              <el-button @click="reset">重置</el-button>
              <slot name="searchButtonRight"></slot>
          </FormItem>
      </el-form>
      
    </div>

    <el-table border :data="props.tableData" style="width: 100%">
      <el-table-column v-for="column in computedColumns" :key="column.prop" v-bind="column">
        <template #default="scope">
          <slot v-if="column.prop" :name="column.prop" v-bind="scope">
            {{ scope.row[column.prop] }}
          </slot>
          <slot v-if="column.type && column.slot" :name="column.type" v-bind="scope"></slot>
        </template>
      </el-table-column>
    </el-table>

    <div
      v-if="!props.hidePagination"
      style="display: flex; justify-content: flex-end; margin-top: 10px"
    >
      <el-pagination
        background
        size="small"
        :total="props.total"
        :layout="props.layout"
        v-bind="$attrs"
      />
    </div>
  </div>
</template>

<script setup>
import { ElTable, ElTableColumn, ElPagination, ElForm } from 'element-plus'
import { computed } from 'vue'
import FormItem from '../LBWFormItem/index.vue'

const props = defineProps({
  // 表格数据
  tableData: {
    type: Array,
    default: () => [],
  },
  // 列配置
  columns: {
    type: Array,
    default: () => [],
  },
  layout: {
    type: String,
    default: 'total, sizes, prev, pager, next, jumper',
  },
  total: {
    type: Number,
    default: 0,
  },
  // 是否隐藏分页
  hidePagination: {
    type: Boolean,
    default: false,
  },
  // 是否隐藏序号列
  hideIndex: {
    type: Boolean,
    default: false,
  },
})
const queryParams = defineModel('queryParams', {
  default: () => ({}),
})
const computedColumns = computed(() => {
  if (props.columns.some((column) => column.type === 'index') || props.hideIndex) {
    return props.columns
  } else {
    return [
      {
        type: 'index',
        label: '序号',
        width: 60,
        align: 'center',
      },
      ...props.columns,
    ]
  }
})
const computedSearchColumns = computed(() => {
  return props.columns.filter((column) => column.search)
})
const emit = defineEmits(['searchFromChange', 'search', 'reset'])

// 重置函数
const reset = () => {
  const resetForm = {}
  computedSearchColumns.value.forEach(item => {
    resetForm[item.prop] = undefined
  })
  emit('searchFromChange', resetForm)
  emit('reset')
}
</script>
<style lang="scss">
.custom-table {
  .el-table thead th {
    background-color: #f5f7fa !important;
  }
}
</style>
