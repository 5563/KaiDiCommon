<script setup>
import { ElOption, ElSelect } from 'element-plus';
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
const options = computed(() => {
  return props.options.map((item) => {
    return {
      label: item.label,
      value: item.value + '',
    };
  });
});
</script>

<template>
  <ElSelect v-bind="$attrs" v-model="computedValue">
    <ElOption
      v-for="item in options"
      :key="item.value"
      :label="item.label"
      :value="item.value"
    />
  </ElSelect>
</template>

<style></style>
