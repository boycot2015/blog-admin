<template>
  <a-card
    style="border-width: 0 0 1px 0"
    :body-style="{
      padding: '16px 16px 8px',
    }"
  >
    <ProForm
      class="rule-form"
      style="width: 100%"
      submit-text="提交"
      label-align="left"
      layout="horizontal"
      :read-only="!!$route.query.readOnly"
      :default-values="formData"
      :form-items="formItems"
      @search="onSubmit"
    >
    </ProForm>
  </a-card>
</template>

<script lang="tsx" setup>
  import { ref } from 'vue';
  import { addArticle, queryArticle, editArticle } from '@/api/article';
  import { useRouter, useRoute } from 'vue-router';

  const formData = ref({}) as any;
  const formItems = ref([
    {
      field: 'title',
      label: '标题名称',
      span: 24,
      labelColProps: {
        span: 3,
      },
      rules: [{ required: true, message: '标题不能为空' }],
      showColon: true,
      valueType: 'text',
    },
    {
      field: 'categoryId',
      label: '文章分类',
      labelColProps: {
        span: 3,
      },
      rules: [{ required: true, message: '文章分类不能为空' }],
      showColon: true,
      span: 24,
      valueType: 'select',
      request: '/category/get',
      props: {
        label: 'value',
        value: 'id',
      },
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
      labelColProps: {
        span: 3,
      },
      rules: [{ required: true, message: '内容不能为空' }],
      showColon: true,
      span: 24,
      attrs: {
        style: {
          width: '100%',
          height: '500px',
        },
      },
      valueType: 'rich',
    },
  ]);
  const route = useRoute();
  const fetchData = () => {
    if (!route.query.id) return;
    queryArticle({ id: route.query.id }).then((res: any) => {
      formData.value.title = res.data.title;
      formData.value.categoryId = res.data.category.id;
      formData.value.content = res.data.content;
    });
  };
  fetchData();
  const router = useRouter();
  const onSubmit = (val: any) => {
    if (route.query.id) {
      editArticle({ ...val, id: route.query.id }).then((res: any) => {
        if (res.success) {
          router.push('/article');
        }
      });
      return;
    }
    addArticle({ ...val }).then((res: any) => {
      if (res.success) {
        router.push('/article');
      }
    });
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
