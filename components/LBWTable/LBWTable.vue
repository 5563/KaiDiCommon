<template>
  <div class="custom-table" v-loading="loading">
    <div class="search_box" v-if="!hideSearch">
      <slot name="searchTop"></slot>
      <el-form :inline="true">
        <template v-for="item in computedSearchColumns" :key="item.prop">
          <slot :name="'search_' + item.prop" v-bind="item">
            <FormItem
              v-model="queryParams[item.prop]"
              :useCol="false"
              v-bind="item"
            />
          </slot>
        </template>
        <FormItem :useCol="false">
          <template v-if="computedSearchColumns.length">
            <el-button type="primary" @click="search">搜索</el-button>
            <el-button @click="reset">重置</el-button>
          </template>
          <template v-else>
            <el-button type="primary" @click="loadData">刷新</el-button>
          </template>
          
          <slot name="searchButtonRight"></slot>
        </FormItem>
      </el-form>
    </div>
    <div class="button_box" v-if="$slots.buttonBox" style="margin-bottom: 10px">
      <slot name="buttonBox"></slot>
    </div>
    <div v-if="card" class="table_card_box">
      <div :span="12" class="table_card_item" v-for="(item, index) in tableData" :key="item.id + index">
        <slot name="table_card_item" :row="item" :index="index" :deleteRow="deleteRow">
          <div class="card_box">
            cardTable的单相
          </div>
        </slot>
      </div>
    </div>
    <el-table v-else class="table_box" border :data="tableData" style="width: 100%" row-key="id">
      <el-table-column v-for="column in computedColumns" :key="column.prop" v-bind="column">
        <template #default="scope">
          <slot v-if="column.prop" :name="column.prop" v-bind="scope" :deleteRow="deleteRow">
            {{ scope.row[column.prop] }}
          </slot>
          <slot v-if="column.type && column.slot" :name="column.type" v-bind="scope"></slot>
        </template>
      </el-table-column>
    </el-table>
    
    <div
      class="pagination_box"
      v-if="!props.hidePagination"
      style="display: flex; justify-content: flex-end; margin-top: 10px"
    >
      <el-pagination
        background
        size="small"
        v-model:current-page="ipagination.pageno"
        v-model:page-size="ipagination.pagesize"
        :total="ipagination.total"
        :layout="props.layout"
        :page-sizes="props.pageSizes"
        @current-change="handleCurrentChange"
        @size-change="handleSizeChange"
      />
    </div>
  </div>
</template>

<script setup>
import { ElTable, ElTableColumn, ElPagination, ElForm, ElButton } from 'element-plus'
import { computed, onMounted, ref } from 'vue'
import FormItem from '../LBWFormItem/index.vue'
import { array2Tree, deepClone } from '../../utils/index.js'
import { ElMessageBox } from 'element-plus'
import { ElMessage, ElRow, ElCol } from 'element-plus'

const props = defineProps({
  // 列配置
  columns: {
    type: Array,
    default: () => [],
  },
  layout: {
    type: String,
    default: 'total, sizes, prev, pager, next, jumper',
  },
  hideSearch: {
    type: Boolean,
    default: false,
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
  pagesize: {
    type: Number,
    default: 10,
  },
  loadApi: {
    type: Function,
    default: () => {},
  },
  isTreeTable: {
    type: Boolean,
    default: false,
  },
  autoLoad: {
    type: Boolean,
    default: true,
  },
  pageSizes: {
    type: Array,
    default: () => [10, 20, 50, 100],
  },
  card: {
    type: Boolean,
    default: false,
  }
})
const tableData = ref([])
const loading = ref(false)
const ipagination = ref({
  pageno: 1,
  pagesize: props.pagesize,
})
const queryParams = defineModel('queryParams', {
  default: () => ({}),
})
const optionsQueryParams = deepClone(queryParams.value)
const staticQueryParams = defineModel('staticQueryParams', {
  default: () => ({}),
})
const computedColumns = computed(() => {
  let tempColumns = []
  if (props.columns.some((column) => column.type === 'index') || props.hideIndex) {
    tempColumns = props.columns
  } else {
    tempColumns = [
      {
        type: 'index',
        label: '序号',
        width: 60,
        align: 'center',
      },
      ...props.columns,
    ]
  }
  return tempColumns.filter((column) => !column.hideTable).map(item => ({
    ...item,
    align: item.align || 'center',
  }))
})
const computedSearchColumns = computed(() => {
  return props.columns.filter((column) => column.search || column.showSearch)
})

const loadData = async (page) => {
  if (page) {
    ipagination.value.pageno = page
  }
  loading.value = true
  const res = await props
    .loadApi({
      ...staticQueryParams.value,
      ...queryParams.value,
      pagesize: ipagination.value.pagesize,
      pageno: ipagination.value.pageno,
    })
    .finally(() => {
      loading.value = false
    })
  tableData.value = res.data || []
  if (props.isTreeTable) {
    tableData.value = array2Tree(res.data || [], 'id', 'parentId')
  }
  ipagination.value.total = res.total || 0
}

// 搜索函数
const search = () => {
  loadData(1)
}

// 重置函数
const reset = () => {
  queryParams.value = deepClone(optionsQueryParams)
  setTimeout(() =>{
    loadData(1)
  })
}

onMounted(() => {
  if (props.autoLoad) {
    loadData(1)
  }
})

const handleCurrentChange = () => {
  loadData()
}

const handleSizeChange = (value) => {
  console.log(value, '===========',  ipagination.value)
  loadData(1)
}
const deleteRow = (delAction = () =>{}, row = {}) => {
  // 二次确认
  ElMessageBox.confirm('确定要删除这条数据吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(() => {
    delAction({
      id: row.id,
    }).then(() => {
      ElMessage.success('删除成功');
      loadData();
    })
  }).catch(() => {})
  
}
defineExpose({
  loadData,
  
})
</script>
<style lang="scss">
.custom-table {
  background-color: #fff;
  height: 100%;
  padding: 20px;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  .search_box, .button_box, .pagination_box {
    flex-shrink: 0;
  }
  .table_box {
    flex: 1;
    height: 0;
  }
  .table_card_box {
    overflow: auto;
    flex: 1;
    height: 0;
    background-color: #f5f5f5;
    display: flex;
    flex-wrap: wrap;
    gap: 20px;
    padding: 20px;
    .table_card_item {
      background-color: #fff;
      min-width: 200px;
      width: max-content;
    }
  }
  .el-table thead th {
    background-color: #f5f7fa !important;
  }
}
</style>
