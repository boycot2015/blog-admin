<template>
  <a-card
    style="border-width: 0 0 1px 0"
    :body-style="{
      padding: '16px 16px 8px',
    }"
  >
    <ProForm
      class="rule-form"
      style="width: 600px"
      submit-text="提交"
      label-align="right"
      layout="horizontal"
      :form-items="formItems"
    >
    </ProForm>
  </a-card>
</template>

<script lang="tsx" setup>
  import { ref } from 'vue';
  import ProForm from '@/components/ProTable/form.vue';

  const formData = ref({}) as any;
  const formItems = ref([
    {
      field: 'title',
      label: '标题名称',
      span: 24,
      rules: [{ required: true, message: '标题不能为空' }],
      showColon: true,
      valueType: 'text',
    },
    {
      field: 'articleType',
      label: '文章分类',
      rules: [{ required: true, message: '文章分类不能为空' }],
      showColon: true,
      span: 24,
      valueType: 'select',
      options: [
        {
          label: '公司动态',
          value: 'COMPANY_NEWS',
        },
        {
          label: '行业资讯',
          value: 'OTHER_NEWS',
        },
      ],
    },
    {
      field: 'content',
      label: '内容',
      rules: [{ required: true, message: '内容不能为空' }],
      showColon: true,
      span: 24,
      valueType: 'textarea',
    },
  ]);
  formItems.value.map((el) => {
    formData[el.field] = undefined;
    return el;
  });
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
