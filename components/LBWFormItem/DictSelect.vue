<script setup lang="ts">
import { ElOption, ElSelect } from 'element-plus';
import { getDictList } from '../../api/baseApi';
import { ref, onMounted } from 'vue';

const props = defineProps({
  dictType: {
    type: String,
    default: '',
  },
});

const options = ref([]);

onMounted(() => {
  getDictList(props.dictType).then((res) => {
    options.value = res.data;
  });
});
</script>

<template>
  <ElSelect v-bind="$attrs">
    <ElOption
      v-for="(item, index) in options"
      :key="item.cid"
      :label="item.cname"
      :value="item.cid"
    />
  </ElSelect>
</template>

<style></style>
