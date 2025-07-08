import LBWTable from './LBWTable.vue'
import { ref, defineComponent, h } from 'vue'
import { deepClone, array2Tree } from '../../utils'
import { ElMessage, ElMessageBox } from 'element-plus'
export function useLBWTable(loadApi, initParams = {}) {
  initParams = initParams || {}
  initParams = {
    defLoadData: true,  
    defQueryParams: {},
    isTreeTable: false,
    pagesize: 10,
    ...initParams,
  }
  const pagesize = ref(initParams.pagesize )
  const pageno = ref(1)
  const total = ref(0)
  const tableData = ref([])
  const queryParams = ref(deepClone(initParams.defQueryParams))
  const loading = ref(false)
  const staticQueryParams = {}
  const loadData = async (page) => {
    if (page) {
      pageno.value = page.pageno
    }
    loading.value = true
    const res = await loadApi({
      ...staticQueryParams,
      ...queryParams.value,
      pagesize: pagesize.value,
      pageno: pageno.value,
    }).finally(() => {
      loading.value = false
    })
    tableData.value = res.data || []
    if (initParams.isTreeTable) {
      tableData.value = array2Tree(res.data || [], 'id', 'parentId')
    }
    total.value = res.total || 0
  }
  
  if (initParams.defLoadData) {
    loadData(1)
  }

  const handleSearch = () => {
    loadData(1);
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
  const handleReset = () => {
    queryParams.value = deepClone(initParams.defQueryParams);
    loadData(1);
  }
  const TableComponent = defineComponent({
    name: 'TableComponent',
    setup(_, { slots, attrs }) {
      
      return () => {
        const slotProps = {};
        for (const key in slots) {
          slotProps[key] = slots[key];
        }
        
        return h(LBWTable, {
          "pageSize": pagesize.value,
          "currentPage": pageno.value,
          "modelValue": queryParams.value,
          "onUpdate:modelValue": (val) => {
            queryParams.value = val;
          },
          ...attrs,
          "tableData": tableData.value,
          "loading": loading.value,
          "total": total.value,
          "onSizeChange": (val) => {
            pagesize.value = val;
            loadData();
          },
          "onCurrentChange": (val) => {
            pageno.value = val;
            loadData();
          },
          "onSearch": handleSearch,
          "onReset": handleReset
        }, slotProps);
      }
    },
  })
  return [TableComponent, {
    staticQueryParams,
    loadData,
    deleteRow,
  }]
}
