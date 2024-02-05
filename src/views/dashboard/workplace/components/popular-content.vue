<template>
    <ProTable
        :request="queryPopularList"
        :pagination="false"
        :bordered="false"
        :columns="columns"
        :scroll="{ x: '100%', y: 'auto' }"
    >
        <template #title>
            {{ $t('workplace.popularContent') }}
        </template>
        <template #extra>
            <a-link v-permission="['F001']" @click="$router.push('/article')">{{
                $t('workplace.viewMore')
            }}</a-link>
        </template>
    </ProTable>
</template>

<script lang="tsx" setup>
    import { ref } from 'vue';
    import { queryPopularList } from '@/api/dashboard';
    import ProTable from '@/components/ProTable/index.vue';
    import type { TableColumnData } from '@arco-design/web-vue/es/table';

    const columns = ref<TableColumnData[]>([
        {
            dataIndex: 'id',
            title: 'ID',
            fixed: 'left',
            width: 100,
        },
        {
            dataIndex: 'title',
            title: '文章标题',
            tooltip: true,
            ellipsis: true,
            width: 260,
        },
        {
            dataIndex: 'categoryName',
            title: '文章分类',
            width: 150,
            render: ({ record }) => {
                return record.category?.value || record.categoryName;
            },
        },
        {
            dataIndex: 'visitor',
            title: '阅读量',
            width: 100,
            //   sortable: {
            //     sortDirections: ['descend', 'ascend'],
            //     sorter: true,
            //     defaultSortOrder: '',
            //   },
        },
        {
            dataIndex: 'createTime',
            title: '发布时间',
            width: 180,
            render: ({ record }) =>
                new Date(record.createTime)
                    .toLocaleString()
                    .replace(/\//g, '-'),
            //   sortable: {
            //     sortDirections: ['descend', 'ascend'],
            //     sorter: false,
            //     defaultSortOrder: '',
            //   },
        },
    ]);
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
