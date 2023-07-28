<template>
  <a-row :gutter="16">
    <a-form ref="formRef" :model="formData" layout="inline">
      <a-col
        v-for="(item, index) in props.formItems"
        v-show="showMore || index < 2"
        :key="item.field"
        :span="item.span || 6"
        :xs="24"
        :sm="12"
        :md="8"
        :lg="item.span || 6"
        :xl="item.span || 6"
      >
        <a-form-item
          v-if="item"
          v-bind="{
            ...item,
          }"
        >
          <a-input
            v-if="item.valueType === 'text'"
            v-model="formData[item.field]"
            :placeholder="(item.attrs && item.attrs.placeholder) || '请输入'"
          ></a-input>
          <a-select
            v-if="item.valueType === 'select' && item.options"
            v-model="formData[item.field]"
            :placeholder="(item.attrs && item.attrs.placeholder) || '请选择'"
          >
            <a-option
              v-for="option in item.options"
              :key="option.label"
              :label="option.label"
              :value="option.value || ''"
            ></a-option>
          </a-select>
          <a-range-picker
            v-if="item.valueType === 'time'"
            v-model="formData[item.field]"
            show-time
            format="YYYY-MM-DD HH:mm:ss"
            :time-picker-props="{
              defaultValue: ['00:00:00', '23:59:59'],
            }"
          ></a-range-picker>
        </a-form-item>
      </a-col>
      <a-col :span="6">
        <a-space :size="16">
          <a-button @click="onShowMore">
            <a-space :size="5">
              <span>{{ !showMore ? '展开' : '收起' }}</span>
              <icon-down v-if="!showMore" /> <icon-up v-else
            /></a-space>
          </a-button>
          <a-button type="primary" @click="search">搜索</a-button>
          <a-button @click="reset">重置</a-button>
        </a-space>
      </a-col>
    </a-form>
  </a-row>
</template>

<script lang="ts" setup>
  import { ref } from 'vue';
  import type { FormInstance } from '@arco-design/web-vue/es/form';
  import type { Options } from '@/types/global';

  export type FormItemProps = {
    labelColFlex?: number | string;
    field: string;
    label: string;
    valueType: string;
    span?: number;
    attrs?: any;
    options?: Options[];
  };
  type FormProp = {
    formItems?: FormItemProps[];
  };
  const emits = defineEmits(['search', 'reset', 'showMore']);
  const props = defineProps<FormProp>();
  const formRef = ref<FormInstance>();
  const formData = ref({}) as any;
  const showMore = ref(false);
  const onShowMore = () => {
    showMore.value = !showMore.value;
    emits('showMore', showMore.value);
  };
  const search = () => {
    emits('search', formData.value);
  };
  const reset = () => {
    formRef.value?.resetFields();
    emits('reset', formData.value);
  };
</script>

<style scoped lang="less">
  .general-card {
    min-height: 395px;
  }
  :deep(.arco-table-tr) {
    height: 44px;
    .arco-typography {
      margin-bottom: 0;
    }
  }
  .increases-cell {
    display: flex;
    align-items: center;
    span {
      margin-right: 4px;
    }
  }
</style>
