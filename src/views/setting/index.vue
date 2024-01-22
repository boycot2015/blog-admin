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
        <template #banner>
          <div class="banner" style="width: 100%">
            <div class="banner-inner">
              <a-carousel
                class="carousel"
                animation-name="slide"
                style="width: 100%; height: 230px"
              >
                <a-carousel-item
                  v-for="item in formData.banner"
                  :key="item.url"
                >
                  <div :key="item.url" class="carousel-item">
                    <!-- <div class="carousel-title">{{ item.slogan }}</div>
            <div class="carousel-sub-title">{{ item.subSlogan }}</div> -->
                    <img
                      class="carousel-image"
                      style="height: auto; width: 100%"
                      :src="item.url"
                    />
                  </div>
                </a-carousel-item>
              </a-carousel>
            </div>
          </div>
        </template>
        <template #colorPicker>
          <a-form-item
            label="主题色："
            :wrapper-col-props="{ span: 4 }"
            :label-col-props="{ span: 6 }"
            ><pick-colors v-model:value="formData.color" format="rgb"
          /></a-form-item>
          <a-form-item
            label="背景色："
            :wrapper-col-props="{ span: 4 }"
            :label-col-props="{ span: 6 }"
            ><pick-colors v-model:value="formData.background" format="rgb"
          /></a-form-item>
        </template>
      </ProForm>
    </a-spin>
  </a-card>
</template>

<script lang="tsx" setup>
  import { ref } from 'vue';
  import { querySetting, updateSetting } from '@/api/setting';
  //   import { useRouter, useRoute } from 'vue-router';
  import { Message } from '@arco-design/web-vue';
  import PickColors from 'vue-pick-colors';
  import useLoading from '@/hooks/loading';

  const { loading, setLoading } = useLoading();
  const formData = ref({}) as any;
  const formItems = ref([
    {
      slotName: 'banner',
      label: '轮播图',
      span: 24,
      labelColProps: {
        span: 3,
      },
      showColon: true,
      rules: [{ required: true, type: 'array', message: '轮播图不能为空' }],
    },
    {
      field: 'notice',
      label: '公告名称',
      span: 24,
      labelColProps: {
        span: 3,
      },
      rules: [{ required: true, message: '公告名称不能为空' }],
      showColon: true,
      valueType: 'text',
    },
    {
      field: 'noticeUrl',
      label: '公告链接',
      span: 24,
      labelColProps: {
        span: 3,
      },
      rules: [{ required: true, message: '公告链接不能为空' }],
      showColon: true,
      valueType: 'text',
    },
    // {
    //   field: 'categoryId',
    //   label: '文章分类',
    //   labelColProps: {
    //     span: 3,
    //   },
    //   rules: [{ required: true, message: '文章分类不能为空' }],
    //   showColon: true,
    //   span: 24,
    //   valueType: 'select',
    //   request: '/category/get',
    //   props: {
    //     label: 'value',
    //     value: 'id',
    //   },
    //   options: [
    //     {
    //       label: '公司动态',
    //       value: 'COMPANY_NEWS',
    //     },
    //     {
    //       label: '行业资讯',
    //       value: 'OTHER_NEWS',
    //     },
    //   ],
    // },
    {
      field: 'gitHub',
      label: 'gitHub',
      labelColProps: {
        span: 3,
      },
      rules: [{ required: false, message: 'gitHub不能为空' }],
      showColon: true,
      span: 24,
      attrs: {
        style: {
          width: '100%',
          height: '500px',
        },
      },
      valueType: 'text',
    },
    {
      field: 'email',
      label: 'email',
      labelColProps: {
        span: 3,
      },
      rules: [{ required: false, message: 'email不能为空' }],
      showColon: true,
      span: 24,
      attrs: {
        style: {
          width: '100%',
          height: '500px',
        },
      },
      valueType: 'text',
    },
    {
      field: 'color',
      label: '主题配置',
      labelColProps: {
        span: 3,
      },
      rules: [{ required: false, message: '主题色不能为空' }],
      showColon: true,
      span: 24,
      slotName: 'colorPicker',
    },
  ]);
  //   const route = useRoute();
  const fetchData = () => {
    setLoading(true);
    querySetting({}).then((res: any) => {
      formData.value.id = res.data.id;
      formData.value.notice = JSON.parse(res.data.notice).title;
      formData.value.noticeUrl = JSON.parse(res.data.notice).link;
      formData.value.banner = JSON.parse(res.data.banner);
      formData.value.gitHub = JSON.parse(res.data.siteConfig).gitHub;
      formData.value.email = JSON.parse(res.data.siteConfig).email;
      formData.value.color = JSON.parse(res.data.theme).color;
      formData.value.background = JSON.parse(res.data.theme).background;
      setLoading(false);
    });
  };
  fetchData();
  //   const router = useRouter();
  const onSubmit = (val: any) => {
    if (formData.value.id) {
      updateSetting({
        id: formData.value.id,
        banner: JSON.stringify(val.banner),
        notice: JSON.stringify({ title: val.notice, link: val.noticeUrl }),
        theme: JSON.stringify({ background: val.background, color: val.color }),
        siteConfig: JSON.stringify({ gitHub: val.gitHub, email: val.email }),
      }).then((res: any) => {
        Message[res.success ? 'success' : 'error'](res.data || res.message);
      });
    }
    // addArticle({ ...val }).then((res: any) => {
    //   if (res.success) {
    //     router.push('/article');
    //   }
    // });
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
