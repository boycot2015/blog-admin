<template>
    <a-card
        style="border-width: 0 0 1px 0"
        :body-style="{
            padding: '16px 16px 8px',
        }"
    >
        <a-spin :loading="loading" style="width: 100%">
            <div class="flex">
                <a-tabs
                    v-model="activeTab"
                    style="height: calc(100vh - 200px)"
                    :trigger="'click'"
                    position="left"
                    @tab-click="(key: string | number, ev: Event) => (activeTab = key)"
                >
                    <a-tab-pane key="base" title="基础配置"></a-tab-pane>
                    <a-tab-pane key="index" title="首页配置"></a-tab-pane>
                    <a-tab-pane key="theme">
                        <template #title>主题配置</template>
                    </a-tab-pane>
                </a-tabs>
                <ProForm
                    class="rule-form"
                    style="width: 100%"
                    submit-text="提交"
                    label-align="right"
                    layout="horizontal"
                    centered
                    :loading="submitLoading"
                    :read-only="!!$route.query.readOnly"
                    :default-values="formData"
                    :form-items="
                        formItems.map((item) => ({
                            ...item,
                            hidden: item.key !== activeTab,
                        }))
                    "
                    @search="onSubmit"
                >
                    <template #banner>
                        <div class="banner" style="width: 100%">
                            <div class="banner-inner">
                                <a-carousel
                                    v-model:current="current"
                                    class="carousel"
                                    auto-play
                                    indicator-type="line"
                                    style="width: 100%; height: 230px"
                                >
                                    <a-carousel-item
                                        v-for="(item, index) in formData.banner"
                                        :key="item.url"
                                    >
                                        <div
                                            :key="item.url"
                                            class="carousel-item"
                                            @click="
                                                () => {
                                                    visible = true;
                                                    currentBanner = {
                                                        ...item,
                                                        index,
                                                    };
                                                }
                                            "
                                        >
                                            <img
                                                class="carousel-image"
                                                style="
                                                    height: auto;
                                                    width: 100%;
                                                    cursor: pointer;
                                                "
                                                :src="item.url"
                                            />
                                        </div>
                                    </a-carousel-item>
                                </a-carousel>
                            </div>
                            <div
                                v-if="formData && formData.banner"
                                class="tr"
                                style="margin-top: 5px"
                            >
                                <a-button
                                    v-if="formData.banner.length < 10"
                                    type="primary"
                                    size="small"
                                    @click="
                                        () => {
                                            visible = true;
                                            currentBanner = {};
                                        }
                                    "
                                    >+新增</a-button
                                >
                                <a-popconfirm
                                    v-if="formData.banner.length > 3"
                                    content="确定删除?"
                                    @ok="
                                        () => {
                                            formData.banner = formData.banner.filter((el: any) => el.index !== current - 1).map((el: any, index: number) => ({ ...el, index }));
                                            current = 1
                                            currentBanner = {};
                                        }
                                    "
                                >
                                    <a-button
                                        style="margin-left: 5px"
                                        type="primary"
                                        status="danger"
                                        size="small"
                                        >删除</a-button
                                    >
                                </a-popconfirm>
                            </div>
                        </div>
                    </template>
                    <template #colorPicker>
                        <a-form-item
                            label="主题色："
                            :wrapper-col-props="{ span: 4 }"
                            :label-col-props="{ span: 6 }"
                            ><pick-colors
                                v-model:value="formData.color"
                                format="rgb"
                        /></a-form-item>
                        <a-form-item
                            label="背景色："
                            :wrapper-col-props="{ span: 4 }"
                            :label-col-props="{ span: 6 }"
                            ><pick-colors
                                v-model:value="formData.background"
                                format="rgb"
                        /></a-form-item>
                    </template>
                    <template #links="{ item }">
                        <a-form-item
                            :wrapper-col-props="{ span: 21 }"
                            :label-col-props="{ span: 3 }"
                            style="text-align: left; margin-bottom: 0"
                            >{{ item.attrs.placeholder }}</a-form-item
                        >
                    </template>
                </ProForm>
            </div>
            <a-modal
                v-model:visible="visible"
                title="配置轮播图"
                @cancel="onModalClose"
                @before-ok="handleBeforeOk"
            >
                <a-form ref="formRef" :model="currentBanner">
                    <a-form-item
                        field="url"
                        label="轮播图"
                        :rules="[{ required: true, message: '轮播图不能为空' }]"
                    >
                        <Upload
                            url="/upload"
                            :file="{ url: currentBanner.url || '' }"
                            @change="(file:any) => (currentBanner.url = file)"
                        >
                            <template #button>
                                <img
                                    v-if="currentBanner.url"
                                    class="carousel-image"
                                    style="height: auto; width: 100%"
                                    :src="currentBanner.url"
                                />
                                <a-button v-else>+上传图片</a-button>
                            </template>
                        </Upload>
                    </a-form-item>
                    <a-form-item
                        field="title"
                        label="名称"
                        :rules="[{ required: true, message: '名称不能为空' }]"
                    >
                        <a-input
                            v-model="currentBanner.title"
                            :max-length="30"
                            show-word-limit
                            placeholder="请输入名称"
                        />
                    </a-form-item>
                    <a-form-item field="link" label="链接">
                        <a-input
                            v-model="currentBanner.link"
                            :max-length="100"
                            show-word-limit
                            placeholder="请输入链接"
                        />
                    </a-form-item>
                </a-form>
            </a-modal>
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

    const visible = ref(false);
    const { loading, setLoading } = useLoading();
    const { loading: submitLoading, setLoading: setSubmitLoading } =
        useLoading();
    const formData = ref({}) as any;
    const current = ref(1);
    const currentBanner = ref({ index: 1 }) as any;
    const formRef = ref();
    const activeTab = ref<string | number>('base');
    const formItems = ref([
        {
            key: 'index',
            slotName: 'banner',
            label: '轮播图',
            span: 24,
            labelColProps: {
                span: 3,
            },
            hidden: false,
            showColon: true,
            rules: [
                { required: true, type: 'array', message: '轮播图不能为空' },
            ],
        },
        {
            key: 'theme',
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
        {
            key: 'index',
            field: 'notice',
            label: '公告名称',
            span: 24,
            labelColProps: {
                span: 3,
            },
            rules: [{ required: true, message: '公告名称不能为空' }],
            showColon: true,
            valueType: 'text',
            attrs: {
                showWordLimit: true,
                maxLength: 50,
            },
        },
        {
            key: 'index',
            field: 'noticeUrl',
            label: '公告链接',
            span: 24,
            labelColProps: {
                span: 3,
            },
            rules: [{ required: true, message: '公告链接不能为空' }],
            showColon: true,
            valueType: 'text',
            attrs: {
                showWordLimit: true,
                maxLength: 150,
            },
        },
        {
            key: 'base',
            field: 'gitHub',
            label: 'gitHub',
            labelColProps: {
                span: 3,
            },
            rules: [{ required: false, message: 'gitHub不能为空' }],
            showColon: true,
            span: 24,
            attrs: {
                showWordLimit: true,
                maxLength: 50,
            },
            valueType: 'text',
        },
        {
            key: 'base',
            field: 'email',
            label: 'email',
            labelColProps: {
                span: 3,
            },
            rules: [{ required: false, message: 'email不能为空' }],
            showColon: true,
            span: 24,
            attrs: {
                showWordLimit: true,
                maxLength: 50,
            },
            valueType: 'text',
        },
        {
            key: 'base',
            field: 'links',
            label: '友情链接',
            labelColProps: {
                span: 3,
            },
            rules: [
                {
                    required: false,
                    message: 'links不能为空',
                },
            ],
            showColon: true,
            span: 24,
            style: 'text-align: left; margin-bottom: 0',
            attrs: {
                placeholder: '名称|链接|个性签名，多个,以逗号分隔',
                showWordLimit: true,
                maxLength: 500,
            },
            valueType: 'textarea',
        },
        {
            key: 'base',
            field: 'links',
            labelColProps: {
                span: 0,
            },
            wrapperColProps: {
                span: 24,
            },
            span: 24,
            attrs: {
                placeholder:
                    '多个以,分隔，例如: 名称|链接|个性签名,名称|链接|个性签名',
                showWordLimit: true,
            },
            slotName: 'links',
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
            formData.value.banner = formData.value.banner.map(
                (el: any, index: number) => ({
                    ...el,
                    index,
                })
            );
            formData.value.gitHub = JSON.parse(res.data.siteConfig).gitHub;
            formData.value.email = JSON.parse(res.data.siteConfig).email;
            formData.value.links = JSON.parse(res.data.siteConfig).links;
            formData.value.color = JSON.parse(res.data.theme).color;
            formData.value.background = JSON.parse(res.data.theme).background;
            setLoading(false);
        });
    };
    fetchData();
    //   const router = useRouter();
    const onSubmit = (val: any) => {
        // console.log(
        //     val.links
        //         .split(',')
        //         .filter((el: any) => el)
        //         .map((el: any) => ({
        //             name: el.trim().split('|')[0],
        //             url: el.trim().split('|')[1],
        //             desc: el.split('|')[2],
        //         }))
        //         .filter((el: any) => el.name && el.url)
        //         .flat()
        // );
        if (formData.value.id) {
            setSubmitLoading(true);
            updateSetting({
                id: formData.value.id,
                banner: JSON.stringify(val.banner),
                notice: JSON.stringify({
                    title: val.notice,
                    link: val.noticeUrl,
                }),
                theme: JSON.stringify({
                    background: val.background,
                    color: val.color,
                }),
                siteConfig: JSON.stringify({
                    gitHub: val.gitHub,
                    email: val.email,
                    links: val.links,
                }),
            }).then((res: any) => {
                Message[res.success ? 'success' : 'error'](
                    res.data || res.message
                );
                setSubmitLoading(false);
            });
        }
        // addArticle({ ...val }).then((res: any) => {
        //   if (res.success) {
        //     router.push('/article');
        //   }
        // });
    };
    const onModalClose = () => {
        visible.value = false;
        currentBanner.value = {};
    };
    const handleBeforeOk = (done: any) => {
        return !formRef.value.validate((errors: any) => {
            if (!errors) {
                const index = formData.value.banner.findIndex(
                    (el: any) => el.index === current.value - 1
                );
                if (index > -1) {
                    formData.value.banner.splice(
                        current.value - 1,
                        1,
                        currentBanner.value
                    );
                } else {
                    formData.value.banner.push(currentBanner.value);
                }
                done();
                onModalClose();
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
