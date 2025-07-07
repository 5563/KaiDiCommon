<script setup>
import { ElRadio, ElRadioGroup } from 'element-plus';
import { computed } from 'vue';
const props = defineProps({
  options: {
    type: Array,
    default: () => [],
  },
});
const modelValue = defineModel('modelValue');
const computedValue = computed({
  get() {
    return modelValue.value + '';
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
        value: index + '',
      };
    }
    return item;
  });
});
</script>

<template>
  <ElRadioGroup v-bind="$attrs" v-model="computedValue">
    <ElRadio
      v-for="item in computedOptions"
      :key="item.value"
      border
      :label="item.value"
      size="large"
      >{{ item.label }}</ElRadio
    >
  </ElRadioGroup>
</template>

<style></style>
