<template>
    <ProTable
        ref="tableRef"
        row-key="id"
        :request="queryUserList"
        :form-items="formItems"
        :columns="columns"
        :pagination="true"
    >
        <template #title>
            {{ $t('menu.user.list') }}
        </template>
        <template #extra>
            <a-space :size="16">
                <a-button
                    v-permission="['F0030']"
                    type="primary"
                    @click="$router.push('/user/add')"
                >
                    <a-space :size="8"> <icon-plus></icon-plus>新增</a-space>
                </a-button>
            </a-space>
        </template>
    </ProTable>
</template>

<script lang="tsx" setup>
    import { ref, reactive, onActivated } from 'vue';
    import { queryUserList, changeStatus, deleteUser } from '@/api/user';
    import type { ColumnData } from '@/components/ProTable/types';
    import router from '@/router';
    import { useUserStore, useAppStore } from '@/store';
    import { Message, Modal } from '@arco-design/web-vue';
    import { checkPermission } from '@/directive/permission';

    const colors: any = reactive(useAppStore().colors as any);
    const userInfo = useUserStore();

    const formData = ref({}) as any;
    const tableRef = ref({}) as any;
    const formItems = ref([
        {
            field: 'username',
            label: '用户名',
            showColon: true,
            attrs: {
                placeholder: '请输入用户名',
            },
            valueType: 'text',
        },
        {
            field: 'roleIds',
            label: '角色',
            labelColProps: {
                span: 3,
            },
            attrs: {
                'multiple': true,
                'max-tag-count': 2,
                'placeholder': '请选择或搜索角色',
            },
            showColon: true,
            span: 6,
            valueType: 'select',
            request: '/role/get',
            props: {
                label: 'name',
                value: 'id',
            },
        },
        {
            field: 'email',
            label: '邮箱',
            attrs: {
                placeholder: '请输入邮箱',
            },
            showColon: true,
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
                    label: '启用',
                    value: '1001',
                },
                {
                    label: '禁用',
                    value: '1002',
                },
            ],
        },
        {
            field: 'createTime',
            label: '创建时间',
            showColon: true,
            span: 12,
            valueType: 'time',
        },
    ]);

    const onDelete = (record: any) => {
        Modal.warning({
            title: '温馨提示',
            content: '确认删除？',
            hideCancel: false,
            onOk: () => {
                deleteUser({ id: record.id }).then((res: any) => {
                    tableRef.value?.reload();
                    Message[res.success ? 'success' : 'error'](
                        res.data || res.message
                    );
                });
            },
        });
    };
    const columns = ref<ColumnData[]>([
        {
            dataIndex: 'id',
            title: 'ID',
            width: 100,
        },
        {
            dataIndex: 'avatar',
            title: '头像',
            width: 120,
            render: ({ record }) => {
                return <a-image height={40} src={record.avatar}></a-image>;
            },
        },
        {
            dataIndex: 'username',
            title: '用户名',
            tooltip: true,
            ellipsis: true,
            width: 200,
        },
        {
            dataIndex: 'roles',
            title: '角色',
            width: 200,
            render: ({ record }) => {
                return record.roles?.map((el: any) => (
                    <a-tag
                        color={
                            colors[Math.floor(Math.random() * colors.length)]
                        }
                        style={{ marginRight: '5px', marginBottom: '5px' }}
                    >
                        {el.name}
                    </a-tag>
                ));
            },
        },
        {
            dataIndex: 'status',
            title: '状态',
            width: 120,
            render: ({ record }) => {
                if (checkPermission({ value: ['F0032'] })) {
                    return (
                        <a-switch
                            onChange={() =>
                                changeStatus({
                                    id: record.id,
                                    status: record.status,
                                }).then((res: any) =>
                                    Message[res.success ? 'success' : 'error'](
                                        res.data || res.message
                                    )
                                )
                            }
                            disabled={
                                userInfo.accountId === record.id ||
                                record.id === 1
                            }
                            v-model={record.status}
                            checked-value={1001}
                            unchecked-value={1002}
                            checked-text="启用"
                            unchecked-text="禁用"
                        ></a-switch>
                    );
                }
                return record.status === 1001 ? '启用' : '禁用';
            },
        },
        {
            dataIndex: 'email',
            title: '邮箱',
            width: 200,
        },
        {
            dataIndex: 'updateTime',
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
            dataIndex: 'operation',
            title: '操作',
            fixed: 'right',
            width: 180,
            permission: (): boolean =>
                checkPermission({ value: ['F0031', 'F0032'] }),
            render: ({ record }) => (
                <a-space size={8} record={record}>
                    {checkPermission({ value: ['F0032'] }) && (
                        <a-link
                            onClick={() => {
                                router.push({
                                    path: '/user/edit',
                                    query: { id: record.id, readOnly: 'true' },
                                });
                            }}
                        >
                            查看
                        </a-link>
                    )}
                    {(record.id !== 1 || userInfo.accountId === 1) &&
                        checkPermission({ value: ['F0031'] }) && (
                            <a-link
                                onClick={() => {
                                    router.push({
                                        path: '/user/edit',
                                        query: { id: record.id },
                                    });
                                }}
                            >
                                编辑
                            </a-link>
                        )}
                    {userInfo.accountId !== record.id &&
                        record.id !== 1 &&
                        userInfo.administrator &&
                        checkPermission({ value: ['F0032'] }) && (
                            <a-link onClick={() => onDelete(record)}>
                                删除
                            </a-link>
                        )}
                </a-space>
            ),
        },
    ]);
    formItems.value.map((el) => {
        formData[el.field] = undefined;
        return el;
    });
    onActivated(() => {
        tableRef.value.refresh();
    });
</script>

<script lang="tsx">
    export default {
        name: 'User',
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
