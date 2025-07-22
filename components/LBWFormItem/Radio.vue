<script setup>
import { computed } from 'vue';

import { ElRadio, ElRadioGroup } from 'element-plus';

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
const computedOptions = computed(() => {
  return props.options.map((item, index) => {
    if (typeof item === 'string') {
      return {
        label: item,
        value: `${index}`,
      };
    }
    return {
      ...item,
      value: processVariable(item.value),
    };
  });
});
</script>

<template>
  <ElRadioGroup v-bind="$attrs" v-model="computedValue">
    <ElRadio
      v-for="item in computedOptions"
      :key="item.value"
      :label="item.value"
      :value="item.value"
    >
      {{ item.label }}
    </ElRadio>
  </ElRadioGroup>
</template>

<style></style>
