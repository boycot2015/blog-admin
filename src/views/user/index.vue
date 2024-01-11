<template>
  <ProTable
    ref="tableRef"
    v-model:selectedKeys="rowSelection.selectedRowKeys"
    row-key="id"
    check-all="全选所有结果"
    :request="queryUserList"
    :form-items="formItems"
    :columns="columns"
    :pagination="true"
    :row-selection="{
      ...rowSelection,
    }"
  >
    <template #title>
      {{ $t('menu.article.list') }}
    </template>
    <template #extra>
      <a-space :size="16">
        <a-button type="primary" @click="$router.push('/user/add')">
          <a-space :size="8"> <icon-plus></icon-plus>新增</a-space>
        </a-button>
        <a-button :disabled="!rowSelection.selectedRowKeys?.length"
          >导出</a-button
        >
      </a-space>
    </template>
  </ProTable>
</template>

<script lang="tsx" setup>
  import { ref } from 'vue';
  import { queryUserList, changeStatus, deleteUser } from '@/api/user';
  import type {
    TableColumnData,
    // TableData,
    TableRowSelection,
  } from '@arco-design/web-vue/es/table';
  import router from '@/router';
  import { useUserStore } from '@/store';
  import { Message, Modal } from '@arco-design/web-vue';

  const rowSelection = ref<TableRowSelection>({
    selectedRowKeys: [],
    showCheckedAll: true,
  });
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
      field: 'publishTime',
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
          Message[res.success ? 'success' : 'error'](res.data || res.message);
        });
      },
    });
  };
  const columns = ref<TableColumnData[]>([
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
      dataIndex: 'email',
      title: '邮箱',
      width: 200,
      //   sortable: {
      //     sortDirections: ['descend', 'ascend'],
      //     sorter: false,
      //     defaultSortOrder: '',
      //   },
    },
    {
      dataIndex: 'updateTime',
      title: '发布时间',
      render: ({ record }) =>
        new Date(record.createTime).toLocaleString().replace(/\//g, '-'),
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
      render: ({ record }) => (
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
          disabled={userInfo.accountId === record.id || record.id === 1}
          v-model={record.status}
          checked-value={1001}
          unchecked-value={1002}
          checked-text="启用"
          unchecked-text="禁用"
        ></a-switch>
      ),
    },
    {
      dataIndex: 'operation',
      title: '操作',
      fixed: 'right',
      width: 180,
      render: ({ record }) => (
        <a-space size={8} record={record}>
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
          <a-link
            onClick={() => {
              router.push({ path: '/user/edit', query: { id: record.id } });
            }}
          >
            编辑
          </a-link>
          {userInfo.accountId !== record.id && record.id !== 1 && (
            <a-link onClick={() => onDelete(record)}>删除</a-link>
          )}
        </a-space>
      ),
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
