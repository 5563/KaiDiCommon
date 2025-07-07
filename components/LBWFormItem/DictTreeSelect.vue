<template>
  <el-tree-select
    v-bind="$attrs"
    :data="data"
    :render-after-expand="true"
    node-key="no"
    :props="{
      label: 'name',
      value: 'no',
      children: 'childs'
    }"
  />
</template>

<script setup>
  import { getDictTreeList } from '../../api/baseApi';
  import { ref, onMounted } from 'vue';
//   
  const props = defineProps({
    dictType: {
      type: String,
      required: true,
      validator: (value) => {
        return ['enterprisetype', 'Business', "EnergyCategory"].includes(value);
      }
    }
  });
  
  const data = ref([]);
  
  onMounted(async () => {
    try {
      const res = await getDictTreeList(props.dictType);
      data.value = res.childs
    } catch (error) {
      console.error('获取字典树数据失败', error);
    }
  });
</script>

<style scoped>
</style>
