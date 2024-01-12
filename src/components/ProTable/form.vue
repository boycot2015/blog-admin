<template>
  <a-row :gutter="16">
    <a-form
      ref="formRef"
      :model="formData"
      :style="{
        margin: centered ? '0 auto' : '',
        maxWidth: centered ? '800px' : '100%',
        minWidth: centered ? '750px' : '100%',
      }"
      :label-align="props.labelAlign"
      :layout="props.layout || 'inline'"
    >
      <a-col
        v-for="(item, index) in props.formItems"
        v-show="
          showMore ||
          index < 3 ||
          item.span === 24 ||
          props.formItems.length < 3
        "
        :key="item.field"
        :span="item.span || 6"
        :xs="24"
        :sm="props.layout == 'horizontal' ? 24 : 12"
        :md="props.layout == 'horizontal' ? 24 : 8"
        :lg="item.span || 6"
        :xl="item.span || 6"
      >
        <a-form-item
          v-if="item"
          v-bind="{
            ...item,
          }"
          style="width: 100%"
        >
          <a-input
            v-if="item.valueType === 'text'"
            v-model="formData[item.field]"
            :disabled="readOnly"
            style="width: 100%"
            allow-clear
            :placeholder="(item.attrs && item.attrs.placeholder) || '请输入'"
          ></a-input>
          <a-textarea
            v-if="item.valueType === 'textarea'"
            v-model="formData[item.field]"
            style="width: 100%"
            show-word-limit
            :max-length="500"
            :disabled="readOnly"
            :placeholder="(item.attrs && item.attrs.placeholder) || '请输入'"
          ></a-textarea>
          <a-select
            v-if="item.valueType === 'select' && options[item.field]"
            v-model="formData[item.field]"
            style="width: 100%"
            :disabled="readOnly"
            allow-clear
            :placeholder="(item.attrs && item.attrs.placeholder) || '请选择'"
            :multiple="(item.attrs && item.attrs.multiple) || false"
          >
            <a-option
              v-for="option in options[item.field]"
              :key="option.label"
              :label="option.label"
              :value="option.value || ''"
            ></a-option>
          </a-select>
          <a-radio-group
            v-if="item.valueType === 'radio' && options[item.field]"
            v-model="formData[item.field]"
            style="width: 100%"
            :disabled="readOnly"
            :options="(item.options as any)"
            :placeholder="(item.attrs && item.attrs.placeholder) || '请选择'"
          >
          </a-radio-group>
          <a-range-picker
            v-if="item.valueType === 'time'"
            v-model="formData[item.field]"
            show-time
            :disabled="readOnly"
            format="YYYY-MM-DD HH:mm:ss"
            style="width: 100%"
            :time-picker-props="{
              defaultValue: ['00:00:00', '23:59:59'],
            }"
          ></a-range-picker>
          <Editor
            v-if="item.valueType === 'rich'"
            :disabled="readOnly"
            style="height: 100%; width: 100%"
            :style="item.attrs && item.attrs.style"
            :content="formData[item.field]"
            :catch-data="(val: any) => {
                formData[item.field] = val
            }"
          ></Editor>
          <slot
            v-if="item.slotName"
            :name="item.slotName"
            :form="formData"
            :form-item="item"
          ></slot>
        </a-form-item>
      </a-col>
      <a-col
        v-if="!readOnly"
        :span="props.layout == 'horizontal' ? 22 : 6"
        :style="{ textAlign: centered ? 'center' : 'right' }"
      >
        <a-space :size="16">
          <a-button
            v-if="props.showMore && props.formItems.length > 2"
            type="outline"
            @click="onShowMore"
          >
            <a-space :size="5">
              <span>{{ !showMore ? '展开' : '收起' }}条件</span>
              <icon-down v-if="!showMore" /> <icon-up v-else
            /></a-space>
          </a-button>
          <slot name="actions"></slot>
          <a-button type="primary" @click="search">{{
            props.submitText || '搜索'
          }}</a-button>
          <a-button @click="reset">{{ props.resetText || '重置' }}</a-button>
        </a-space>
      </a-col>
    </a-form>
  </a-row>
</template>

<script lang="ts" setup>
  import { ref, reactive, watch } from 'vue';
  import type { FormInstance, FieldRule } from '@arco-design/web-vue/es/form';
  import axios from 'axios';
  import type { FormItemProps } from './types';

  export type FormProp = {
    layout?: 'inline' | 'horizontal' | 'vertical' | undefined;
    submitText?: string;
    resetText?: string;
    labelAlign?: 'left' | 'right';
    showMore?: boolean;
    rules?: FieldRule | FieldRule[];
    defaultValues?: any;
    readOnly?: boolean;
    centered?: boolean;
    formItems: FormItemProps[];
  };
  const emits = defineEmits(['search', 'reset', 'showMore']);
  const props = defineProps<FormProp>();
  const formRef = ref<FormInstance>();
  const options = reactive<any>({});
  const formData = reactive({
    ...(props.defaultValues || {}),
  }) as any;
  props.formItems.map((val: any) => {
    formData[val.field] = val.valueType === 'time' ? [] : '';
    return val;
  });
  watch(props, (val) => {
    Object.assign(formData, val.defaultValues);
  });

  props.formItems.map(async (el: any) => {
    options[el.field] = el.options;
    if (el.request) {
      options[el.field] = [];
      if (typeof el.request === 'string') {
        el.method = el.method || 'get';
        const params =
          el.method.toLowerCase() === 'get'
            ? { params: el.params }
            : { data: el.params };
        options[el.field] = await axios({
          url: el.request,
          params,
          method: el.method || 'get',
          headers: el.headers,
        }).then((res) => {
          let data: any = [];
          if (el.resultKey) {
            el.resultKey.split('.').some((key: string) => {
              data = res.data[key];
              if (data) return true;
              return key;
            });
          } else {
            data = res.data[0] as any;
          }

          return data.map((val: any) => ({
            label: val[el.props?.label || 'label'],
            value: val[el.props?.value || 'value'],
          }));
        });
      } else if (el.request instanceof Function) {
        options[el.field] = await el.request();
      }
    }
  });

  const showMore = ref(false);
  const onShowMore = () => {
    showMore.value = !showMore.value;
    emits('showMore', showMore.value);
  };
  const search = () => {
    formRef.value?.validate((val) => {
      if (!val) {
        const data = { ...formData };
        props.formItems.map((item: any) => {
          if (item.valueType === 'time' && formData[item.field]) {
            // eslint-disable-next-line prefer-destructuring
            data[
              (item.fieldKeys && item.fieldKeys[0]) || `${item.field}Start`
            ] = formData[item.field][0];
            // eslint-disable-next-line prefer-destructuring
            data[(item.fieldKeys && item.fieldKeys[1]) || `${item.field}End`] =
              formData[item.field][1];
            delete data[item.field];
          }
          return item;
        });
        emits('search', data);
      }
    });
  };
  const reset = () => {
    formRef.value?.resetFields();
    emits('reset', formData);
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
