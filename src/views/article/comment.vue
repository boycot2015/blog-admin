<template>
    <ProTable
        ref="tableRef"
        v-model:selectedKeys="rowSelection.selectedRowKeys"
        row-key="id"
        check-all="全选所有结果"
        :request="querycommentList"
        :form-items="formItems"
        :columns="columns"
        :pagination="true"
        :spread="false"
        :default-values="defaultValues"
        :row-selection="{
            ...rowSelection,
        }"
    >
        <template #title>
            {{ $t('menu.article.comment') }}
        </template>
        <template #extra>
            <a-space v-permission="['F00142']" :size="16">
                <a-button
                    v-permission="['F00142']"
                    :disabled="!rowSelection.selectedRowKeys?.length"
                    @click="onExport"
                    >导出</a-button
                >
            </a-space>
        </template>
    </ProTable>
</template>

<script lang="tsx" setup>
    import { ref, reactive, onActivated } from 'vue';
    import type {
        TableData,
        TableRowSelection,
    } from '@arco-design/web-vue/es/table';
    import type { ColumnData } from '@/components/ProTable/types';
    import { useRoute } from 'vue-router';
    import { Modal, Message } from '@arco-design/web-vue';
    import { checkPermission } from '@/directive/permission';
    import {
        querycommentList,
        deletecomment,
        changeStatus,
    } from '@/api/comment';
    import { exportFile } from '@/utils';

    const route = useRoute();
    const defaultValues = reactive({
        status: route.query.status ? +route.query.status : '',
    }) as any;
    const rowSelection = reactive<TableRowSelection>({
        selectedRowKeys: [],
        fixed: true,
        showCheckedAll: true,
    });
    const tableRef = ref({}) as any;
    const formItems = ref([
        {
            field: 'name',
            label: '用户名称',
            showColon: true,
            attrs: {
                placeholder: '请输入用户名称',
            },
            valueType: 'text',
        },
        {
            field: 'content',
            label: '内容',
            showColon: true,
            attrs: {
                placeholder: '请输入内容',
            },
            valueType: 'text',
        },
        {
            field: 'status',
            label: '状态',
            showColon: true,
            valueType: 'select',
            options: [
                {
                    label: '全部',
                    value: undefined,
                },
                {
                    label: '已发布',
                    value: 1001,
                },
                {
                    label: '未发布',
                    value: 1002,
                },
            ],
        },
        // {
        //     field: 'publishTime',
        //     label: '发布时间',
        //     showColon: true,
        //     span: 12,
        //     valueType: 'time',
        // },
    ]);
    const onDelete = (record: TableData) => {
        Modal.warning({
            title: '温馨提示',
            content: '确认删除？',
            hideCancel: false,
            onOk: () => {
                deletecomment({ id: record.id }).then((res: any) => {
                    Message.success(res.data || res.message);
                    tableRef.value?.reload();
                });
            },
        });
    };
    const onExport = () => {
        const list = tableRef.value
            .getData()
            .filter((item: any) =>
                rowSelection.selectedRowKeys?.includes(item.id)
            );
        exportFile({
            data: list,
            name: '评论列表',
            type: 'json',
        });
    };
    const columns = ref<ColumnData[]>([
        {
            dataIndex: 'avatar',
            title: '用户头像',
            tooltip: true,
            ellipsis: true,
            width: 260,
            render: ({ record }) => {
                return (
                    <a-avatar
                        style={{
                            backgroundColor: record.avatar,
                        }}
                        image-url={record.url}
                        alt={record.avatar}
                    >
                        {record.name.substring(0, 1).toUpperCase()}
                    </a-avatar>
                );
            },
        },
        {
            dataIndex: 'name',
            title: '用户名',
            tooltip: true,
            ellipsis: true,
            width: 260,
        },
        {
            dataIndex: 'email',
            title: '邮箱',
            tooltip: true,
            ellipsis: true,
            width: 260,
        },
        {
            dataIndex: 'content',
            title: '内容',
            width: 150,
            render: ({ record }) => {
                return <div v-html={record.content}></div>;
            },
        },
        {
            dataIndex: 'ip',
            title: 'IP',
            tooltip: true,
            ellipsis: true,
            width: 260,
        },
        {
            dataIndex: 'userAgent',
            title: '客户端',
            tooltip: true,
            ellipsis: true,
            width: 260,
        },
        {
            dataIndex: 'createTime',
            title: '创建时间',
            render: ({ record }) =>
                new Date(record.createTime)
                    .toLocaleString()
                    .replace(/\//g, '-'),
            width: 180,
            sortable: {
                sortDirections: ['descend', 'ascend'],
                sorter: false,
                defaultSortOrder: '',
            },
        },
        {
            dataIndex: 'updateTime',
            title: '发布时间',
            render: ({ record }) =>
                new Date(record.updateTime)
                    .toLocaleString()
                    .replace(/\//g, '-'),
            width: 180,
            sortable: {
                sortDirections: ['descend', 'ascend'],
                sorter: false,
                defaultSortOrder: '',
            },
        },
        {
            dataIndex: 'status',
            title: '状态',
            width: 120,
            fixed: 'right',
            render: ({ record }) =>
                checkPermission({ value: ['F00141'] }) ? (
                    <a-switch
                        before-change={() => {
                            return new Promise((resolve, reject) => {
                                Modal.warning({
                                    title: '温馨提示',
                                    simple: true,
                                    draggable: true,
                                    content: `确认${
                                        record.status === 1001 ? '取消' : ''
                                    }发布？`,
                                    hideCancel: false,
                                    onOk: () => {
                                        return changeStatus({
                                            id: record.id,
                                            status:
                                                record.status === 1001
                                                    ? 1002
                                                    : 1001,
                                        }).then((res: any) => {
                                            // eslint-disable-next-line no-unused-expressions
                                            res.success
                                                ? resolve(res)
                                                : reject(res);
                                            Message[
                                                res.success
                                                    ? 'success'
                                                    : 'error'
                                            ](res.data || res.message);
                                            tableRef.value.refresh();
                                        });
                                    },
                                    onCancel: () => reject(),
                                });
                            });
                        }}
                        v-model={record.status}
                        checked-value={1001}
                        unchecked-value={1002}
                        checked-text="已发布"
                        unchecked-text="未发布"
                    ></a-switch>
                ) : (
                    <span>{record.status === 1001 ? '已发布' : '未发布'}</span>
                ),
        },
        {
            dataIndex: 'operation',
            title: '操作',
            fixed: 'right',
            width: 180,
            permission: (): boolean => checkPermission({ value: ['F00140'] }),
            render: ({ record }) => (
                <a-space size={8} record={record}>
                    <a-link
                        onClick={() => {
                            Modal.info({
                                content: () => (
                                    <div>
                                        <a-space align="align">
                                            <span>{record.name}:</span>
                                            <span
                                                v-html={record.content}
                                            ></span>
                                        </a-space>
                                        {record.parentName && (
                                            <a-space align="align">
                                                &nbsp;
                                                {'//'}
                                                {record.parentName}:
                                                <span
                                                    v-html={
                                                        record.parentContent
                                                    }
                                                ></span>
                                            </a-space>
                                        )}
                                    </div>
                                ),
                                title: '查看详情',
                            });
                        }}
                    >
                        查看
                    </a-link>
                    {checkPermission({ value: ['F00140'] }) && (
                        <a-link onClick={() => onDelete(record)}>删除</a-link>
                    )}
                </a-space>
            ),
        },
    ]);
    onActivated(() => {
        tableRef.value.refresh();
    });
</script>

<script lang="tsx">
    export default {
        name: 'Articlecomment', // If you want the include property of keep-alive to take effect, you must name the component
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
