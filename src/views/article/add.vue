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
                :read-only="!!$route.query.readOnly"
                :default-values="formData"
                :form-items="formItems"
                @search="onSubmit"
            >
            </ProForm>
        </a-spin>
    </a-card>
</template>

<script lang="tsx" setup>
    import { ref } from 'vue';
    import { addArticle, queryArticle, editArticle } from '@/api/article';
    import { useRouter, useRoute } from 'vue-router';
    import useLoading from '@/hooks/loading';

    const { loading, setLoading } = useLoading();
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
        },
        {
            field: 'tags',
            label: '标签',
            labelColProps: {
                span: 3,
            },
            rules: [{ required: false, message: '标签不能为空' }],
            showColon: true,
            span: 24,
            valueType: 'select',
            request: '/tag/get',
            attrs: {
                multiple: true,
            },
            props: {
                label: 'value',
                value: 'id',
            },
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
        setLoading(true);
        queryArticle({ id: route.query.id }).then((res: any) => {
            formData.value.title = res.data.title;
            formData.value.categoryId = res.data.category.id;
            formData.value.tags = res.data.tags.map((_: any) => _.id);
            formData.value.content = res.data.content;
            setLoading(false);
        });
    };
    fetchData();
    const router = useRouter();
    const onSubmit = (val: any) => {
        val.tags = val.tags.filter((el: any) => el);
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

<script lang="tsx">
    export default {
        name: 'AddArticle', // If you want the include property of keep-alive to take effect, you must name the component
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
