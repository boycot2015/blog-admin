<template>
  <a-card
    style="border-width: 0 0 1px 0"
    :body-style="{
      padding: '16px 16px 8px',
    }"
  >
    <a-spin :loading="loading" style="width: 100%">
      <ProForm
        class="rule-form"
        style="width: 100%"
        submit-text="提交"
        label-align="right"
        layout="horizontal"
        centered
        :read-only="!!$route.query.readOnly"
        :default-values="formData"
        :form-items="formItems"
        @search="onSubmit"
      >
        <template #upload>
          <Upload
            url="/upload"
            :disabled="!!$route.query.readOnly"
            :file="{ url: formData.avatar || '' }"
            @change="(file:any) => (formData.avatar = file)"
          ></Upload>
        </template>
      </ProForm>
    </a-spin>
  </a-card>
</template>

<script lang="tsx" setup>
  import { ref } from 'vue';
  import { addUser, queryUser, editUser } from '@/api/user';
  import { useRouter, useRoute } from 'vue-router';
  import useLoading from '@/hooks/loading';
  import { aesEncrypt } from '@/utils';

  const { loading, setLoading } = useLoading();
  const formData = ref({
    status: 1001,
  }) as any;
  const formItems = ref([
    {
      label: '用户头像',
      field: 'avatar',
      showColon: true,
      span: 24,
      labelColProps: {
        span: 3,
      },
      rules: [{ required: false, message: '用户头像不能为空' }],
      slotName: 'upload',
    },
    {
      field: 'username',
      label: '用户名',
      span: 24,
      attrs: {
        placeholder: '请输入用户名',
      },
      labelColProps: {
        span: 3,
      },
      rules: [{ required: true, message: '用户名不能为空' }],
      showColon: true,
      valueType: 'text',
    },
    {
      field: 'password',
      label: '密码',
      span: 24,
      attrs: {
        placeholder: '请输入密码',
      },
      labelColProps: {
        span: 3,
      },
      rules: [{ required: true, message: '密码不能为空' }],
      showColon: true,
      valueType: 'text',
    },
    {
      field: 'email',
      label: '邮箱',
      span: 24,
      labelColProps: {
        span: 3,
      },
      attrs: {
        placeholder: '请输入电子邮箱',
      },
      rules: [{ required: false, message: '邮箱不能为空' }],
      showColon: true,
      valueType: 'text',
    },
    {
      field: 'status',
      label: '用户状态',
      labelColProps: {
        span: 3,
      },
      attrs: {
        placeholder: '请选择用户状态',
      },
      rules: [{ required: true, message: '用户状态不能为空' }],
      showColon: true,
      span: 24,
      valueType: 'radio',
      options: [
        {
          label: '启用',
          value: 1001,
        },
        {
          label: '禁用',
          value: 1002,
        },
      ],
    },
  ]);
  const route = useRoute();
  const fetchData = () => {
    if (!route.query.id) return;
    setLoading(true);
    queryUser({ id: route.query.id }).then((res: any) => {
      formData.value.avatar = res.data.avatar;
      formData.value.id = res.data.id;
      formData.value.username = res.data.username;
      formData.value.email = res.data.email;
      formData.value.status = res.data.status || 1001;
      setLoading(false);
    });
  };
  fetchData();
  const router = useRouter();
  const onSubmit = (val: any) => {
    if (route.query.id) {
      editUser({
        ...val,
        id: route.query.id,
        password: aesEncrypt(val.password),
      }).then((res: any) => {
        if (res.success) {
          router.push('/user');
        }
      });
      return;
    }
    addUser({ ...val }).then((res: any) => {
      if (res.success) {
        router.push('/user');
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
