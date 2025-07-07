<script setup>
import { ElFormItem, ElCol } from 'element-plus'
import CollectionComponent from './CollectionComponent.vue'
defineProps({
  span: {
    type: Number,
    default: 24,
  },
  label: {
    type: String,
    default: '',
  },
  prop: {
    type: String,
  },
  mb0: {
    type: Boolean,
    default: false,
  },
  labelWidth: {
    type: [String, Number],
    default: 'auto',
  },
  useCol: {
    type: Boolean,
    default: true,
  },
})
</script>

<template>
  <el-col v-if="useCol" :span="span">
    <el-form-item
      :label="label"
      :label-width="labelWidth"
      :prop="prop"
      :class="{ mb0: mb0 }"
      style="width: 100%"
    >
      <slot>
        <CollectionComponent v-bind="$attrs" />
      </slot>
    </el-form-item>
  </el-col>
  <el-form-item
    v-else
    v-bind="$attrs"
    :label="label"
    :label-width="labelWidth"
    :prop="prop"
    :class="{ mb0: mb0 }"
  >
    <slot>
      <CollectionComponent v-bind="$attrs" />
    </slot>
  </el-form-item>
</template>

<style scoped lang="scss">
.mb0 {
  margin-bottom: 0;
}
</style>
