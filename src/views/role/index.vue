<template>
    <div class="role-list">
        <ProTable
            ref="tableRef"
            row-key="id"
            :request="queryRoleList"
            :form-items="formItems"
            :columns="columns"
            :pagination="true"
        >
            <template #title>
                {{ $t('menu.role.list') }}
            </template>
            <template #extra>
                <a-space :size="16">
                    <a-button
                        v-permission="['F0020']"
                        type="primary"
                        @click="onAdd"
                    >
                        <a-space :size="8">
                            <icon-plus></icon-plus>新增</a-space
                        >
                    </a-button>
                </a-space>
            </template>
        </ProTable>
        <a-modal
            v-model:visible="visible"
            :title="
                formData.permissions
                    ? '配置权限'
                    : `${!formData.id ? '新增' : '编辑'}角色`
            "
            @cancel="onModalClose"
            @before-ok="handleBeforeOk"
        >
            <a-form ref="roleFormRef" :model="formData">
                <template v-if="formData.permissions">
                    <a-form-item
                        :label-col-props="{
                            col: 0,
                        }"
                        :wrapper-col-props="{
                            col: 24,
                        }"
                    >
                        <a-tree
                            ref="treeRef"
                            v-model:checked-keys="checkedKeys"
                            v-model:selected-keys="checkedKeys"
                            :checkable="true"
                            :multiple="true"
                            :tree-checkable="true"
                            :check-strictly="true"
                            :data="treeData"
                            :field-names="{
                                key: 'code',
                                title: 'name',
                            }"
                            placeholder="请选择权限"
                            style="
                                width: 100%;
                                max-height: 500px;
                                overflow: auto;
                            "
                            @check="onChecked"
                            @select="
                (selectedKeys: any, { selected, node }: any) =>
                  onChecked(selectedKeys, { checked: selected, node })
              "
                        ></a-tree>
                    </a-form-item>
                </template>
                <template v-else>
                    <a-form-item
                        field="name"
                        label="名称"
                        :rules="[{ required: true, message: '名称不能为空' }]"
                    >
                        <a-input
                            v-model="formData.name"
                            max-length="30"
                            show-word-limit
                            placeholder="请输入名称"
                        />
                    </a-form-item>
                    <a-form-item field="desc" label="说明">
                        <a-textarea
                            v-model="formData.desc"
                            max-length="100"
                            show-word-limit
                            :auto-size="{ minRows: 4 }"
                            placeholder="请输入说明"
                        />
                    </a-form-item>
                </template>
            </a-form>
        </a-modal>
    </div>
</template>

<script lang="tsx" setup>
    import { ref } from 'vue';
    import {
        queryRoleList,
        addRole,
        getRoleById,
        editRole,
        deleteRole,
        getMenuList,
    } from '@/api/role';
    import type { ColumnData } from '@/components/ProTable/types';
    import { Message, Modal } from '@arco-design/web-vue';
    import { convertArrayToTree } from '@/utils';
    import { useUserStore, useTabBarStore } from '@/store';
    import router from '@/router';
    import { checkPermission } from '@/directive/permission';

    const tabBarStore = useTabBarStore();
    const userInfo = useUserStore();
    const treeRef = ref();
    const visible = ref(false);
    const roleFormRef = ref();
    const formData = ref({}) as any;
    const tableRef = ref({}) as any;
    const treeData = ref({}) as any;
    const sourceData = ref({}) as any;
    const checkedKeys = ref<string[]>([]);
    const onDelete = (record: any) => {
        Modal.warning({
            title: '温馨提示',
            content: '确认删除？',
            hideCancel: false,
            onOk: () => {
                deleteRole({ id: record.id }).then((res: any) => {
                    tableRef.value?.reload();
                    Message[res.success ? 'success' : 'error'](
                        res.data || res.message
                    );
                });
            },
        });
    };
    const onAdd = () => {
        visible.value = true;
        formData.value = {};
    };
    const formItems = ref([
        {
            field: 'name',
            label: '角色名称',
            showColon: true,
            valueType: 'text',
            attrs: {
                placeholder: '请输入角色名称',
            },
        },
        {
            field: 'createTime',
            label: '创建时间',
            showColon: true,
            span: 12,
            valueType: 'time',
        },
    ]);
    const columns = ref<ColumnData[]>([
        {
            dataIndex: 'name',
            title: '角色名称',
            tooltip: true,
            ellipsis: true,
            width: 200,
        },
        {
            dataIndex: 'desc',
            title: '角色说明',
            tooltip: true,
            ellipsis: true,
            width: 300,
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
            dataIndex: 'operation',
            title: '操作',
            fixed: 'right',
            width: 200,
            permission: (): boolean =>
                checkPermission({ value: ['F0021', 'F0022', 'F0023'] }),
            render: ({ record }) => (
                <a-space size={8} record={record}>
                    {checkPermission({ value: ['F0023'] }) && (
                        <a-link
                            onClick={() => {
                                getRoleById({ id: record.id }).then(
                                    (result: any) => {
                                        getMenuList().then((res) => {
                                            sourceData.value = res.data;
                                            const data = convertArrayToTree(
                                                [
                                                    {
                                                        code: '0',
                                                        pcode: null,
                                                        name: '所有权限',
                                                    },
                                                    ...res.data,
                                                ],
                                                {
                                                    id: 'code',
                                                    pid: 'pCode',
                                                    children: 'children',
                                                }
                                            );
                                            treeData.value = data;
                                            checkedKeys.value =
                                                result.data?.permissions?.map(
                                                    (el: any) => el.code
                                                );
                                            if (
                                                res.data.length ===
                                                result.data.permissions.length
                                            ) {
                                                checkedKeys.value.unshift('0');
                                            }
                                            Object.assign(
                                                formData.value,
                                                result.data
                                            );
                                            visible.value = true;
                                        });
                                    }
                                );
                            }}
                        >
                            配置权限
                        </a-link>
                    )}
                    {checkPermission({ value: ['F0021'] }) && (
                        <a-link
                            onClick={() => {
                                Object.assign(formData.value, record);
                                visible.value = true;
                            }}
                        >
                            编辑
                        </a-link>
                    )}
                    {checkPermission({ value: ['F0022'] }) &&
                    record.id !== 1 ? (
                        <a-link onClick={() => onDelete(record)}>删除</a-link>
                    ) : null}
                </a-space>
            ),
        },
    ]);
    formItems.value.map((el) => {
        formData[el.field] = undefined;
        return el;
    });
    const handleBeforeOk = (done: any) => {
        return !roleFormRef.value.validate((errors: any) => {
            if (!errors) {
                const data = {
                    id: formData.value.id,
                    name: formData.value.name,
                    desc: formData.value.desc,
                    permissions: [] as any,
                };
                if (!data.id) {
                    addRole(data).then((res: any) => {
                        tableRef.value?.reload();
                        Message[res.success ? 'success' : 'error'](
                            res.data || res.message
                        );
                        visible.value = false;
                        done();
                        onModalClose();
                    });
                    return;
                }
                if (checkedKeys.value && checkedKeys.value.length) {
                    data.permissions = Array.from(new Set(checkedKeys.value));
                }
                editRole(data).then(async (res: any) => {
                    visible.value = false;
                    if (userInfo.roleIds?.includes(data.id) && res.success) {
                        Message.warning('权限已发生变化，请重新登录！');
                        await userInfo.logoutCallBack();
                        await tabBarStore.resetTabList();
                        router.push('/login');
                    } else {
                        tableRef.value?.reload();
                        Message[res.success ? 'success' : 'error'](
                            res.data || res.message
                        );
                    }
                    done();
                    onModalClose();
                });
            }
        });
    };
    const onModalClose = () => {
        visible.value = false;
        roleFormRef.value.clearValidate();
        formData.value = {};
        checkedKeys.value = [];
    };
    const onChecked = (checkKeys: any, { checked, node }: any) => {
        const checkeTravel = (nodes: any, checked: boolean) => {
            if (nodes) {
                const keys = nodes.map((el: any) => el.code);
                if (checked)
                    checkedKeys.value = [...checkedKeys.value, ...keys];
                else
                    checkedKeys.value = checkedKeys.value.filter(
                        (el: any) => !keys.includes(el)
                    );
                nodes.map((el: any) => {
                    if (el && el.children && el.children.length) {
                        checkeTravel(el.children, checked);
                    }
                    return el;
                });
            }
        };
        if (node && node.children && node.children.length) {
            checkeTravel(node.children, checked);
        }
        if (node && node.pCode !== '0' && checked) {
            checkedKeys.value = [...checkedKeys.value, node.pCode];
        }
        if (node && node.code === '0') {
            treeRef.value.checkAll(checked);
            treeRef.value.selectAll(checked);
        }
        if (checkKeys.length === sourceData.value.length) {
            if (checked) {
                treeRef.value.checkAll(checked);
                treeRef.value.selectAll(checked);
            } else
                checkedKeys.value = checkedKeys.value.filter(
                    (el: any) => el !== '0'
                );
        }
        checkedKeys.value = Array.from(new Set(checkedKeys.value));
        console.log(checkedKeys.value, 'checkedKeys.value');
    };
</script>

<script lang="tsx">
    export default {
        name: 'Role',
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
