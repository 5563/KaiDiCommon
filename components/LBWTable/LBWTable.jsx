import LBWTable from './LBWTable.vue'
import { ref, defineComponent } from 'vue'
export function useLBWTable(loadApi, initParams = {
    defLoadData: true,
}) {
  const pagesize = ref(10)
  const pageno = ref(1)
  const total = ref(0)
  const tableData = ref([])
  const queryParams = ref({})
  const loading = ref(false)
  const staticQueryParams = {}

  const loadData = async (page) => {
    if (page) {
      pageno.value = page.pageno
    }
    console.log('pageno', pageno.value)
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
    console.log('tableData', tableData.value)
    total.value = res.total || 0
  }
  
  if (initParams.defLoadData) {
    loadData()
  }

  const TableComponent = defineComponent({
    name: 'TableComponent',
    setup(_, { slots, attrs }) {
      return () => {
        return (
          <LBWTable
            pageSize={pagesize.value}
            currentPage={pageno.value}
            queryParams={queryParams}
            onUpdate:queryParams={(val) => queryParams.value = val}
            {...attrs}
            v-slots={slots}
            tableData={tableData.value}
            loading={loading.value}
            total={total.value}
            onSizeChange={(val) => {
              pagesize.value = val
              loadData()
            }}
            onCurrentChange={(val) => {
              pageno.value = val
              loadData()
            }}
          />
        )
      }
    },
  })
  console.log('TableComponent', TableComponent)
  return [TableComponent, {
    staticQueryParams,
    loadData,
  }]
}
