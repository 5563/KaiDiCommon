<script setup>
import { ElInput, ElTreeSelect, ElDatePicker } from 'element-plus'

// import LngLat from './lngLat.vue';
import Radio from './Radio.vue'
import Select from './Select.vue'
import UploadOneImg from './UploadOneImg.vue'
import DictTreeSelect from './DictTreeSelect.vue'
import DictSelect from './DictSelect.vue'
import { computed } from 'vue'

const props = defineProps({
  type: {
    type: String,
    default: 'input',
  },
  nativeType: {
    default: 'text',
  },

})
const dateValueFormat = computed(() => {
  let temp =
    {
      year: 'YYYY',
      years: 'YYYY',
      yearrange: 'YYYY',
      month: 'YYYY-MM',
      months: 'YYYY-MM',
      monthrange: 'YYYY-MM',
      date: 'YYYY-MM-DD',
      dates: 'YYYY-MM-DD',
      daterange: 'YYYY-MM-DD',
      datetime: 'YYYY-MM-DD HH:mm:ss',
      datetimerange: 'YYYY-MM-DD HH:mm:ss',
      week: 'YYYY 第 WW 周',
    }[props.nativeType] || 'YYYY-MM-DD'
  return temp
})
</script>

<template>
  <ElInput
    v-if="type === 'input'"
    :type="nativeType"
    v-bind="$attrs"
    :placeholder="$attrs.placeholder || '请输入内容'"
  >
    <template v-for="(value, name) in $slots" #[name]>
      <slot :name="name"></slot>
    </template>
  </ElInput>
  <el-date-picker
    v-else-if="type === 'datePicker'"
    v-bind="$attrs"
    :type="nativeType"
    :value-format="dateValueFormat"
    :placeholder="$attrs.placeholder || '请选择'"
  />
  <ElTreeSelect
    v-else-if="type === 'treeSelect'"
    v-bind="$attrs"
    :data="$attrs.options || $attrs.data"
    :placeholder="$attrs.placeholder || '请选择'"
  />
  <Select
    v-else-if="type === 'select'"
    v-bind="$attrs"
    :placeholder="$attrs.placeholder || '请选择'"
  />
  <Radio
    v-else-if="type === 'radio'"
    v-bind="$attrs"
    :placeholder="$attrs.placeholder || '请选择'"
  />
  <UploadOneImg v-else-if="type === 'uploadOneImg'" v-bind="$attrs" />
  <!-- <LngLat v-else-if="type === 'lngLat'" v-bind="$attrs" /> -->
  <DictTreeSelect v-else-if="type === 'dictTreeSelect'" v-bind="$attrs" />
  <DictSelect v-else-if="type === 'dictSelect'" v-bind="$attrs" />
</template>

<style scoped lang="scss">
.mb0 {
  margin-bottom: 0;
}
</style>
