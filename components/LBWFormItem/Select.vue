<script setup>
import { computed } from 'vue';

import { ElOption, ElSelect } from 'element-plus';

import { processVariable } from '../../utils/index.js';

const props = defineProps({
  options: {
    type: Array,
    default: () => [],
  },
});
const modelValue = defineModel('modelValue');
const computedValue = computed({
  get() {
    return processVariable(modelValue.value);
  },
  set(value) {
    modelValue.value = value;
  },
});
const options = computed(() => {
  return props.options.map((item) => {
    return {
      ...item,
      label: item.label,
      value: processVariable(item.value),
    };
  });
});
</script>

<template>
  <ElSelect v-bind="$attrs" v-model="computedValue" style="min-width: 200px">
    <ElOption
      v-for="item in options"
      :key="item.value"
      :label="item.label"
      :value="item.value"
    />
  </ElSelect>
</template>

<style></style>
