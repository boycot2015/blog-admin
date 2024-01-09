<template>
  <ProTable
    ref="tableRef"
    v-model:selectedKeys="rowSelection.selectedRowKeys"
    row-key="id"
    check-all="全选所有结果"
    :request="queryArticleList"
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
        <a-button type="primary" @click="$router.push('/article/add')">
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
  import { queryArticleList, deleteArticle, changeStatus } from '@/api/article';
  import type {
    TableColumnData,
    TableData,
    TableRowSelection,
  } from '@arco-design/web-vue/es/table';
  import router from '@/router';
  import { Modal } from '@arco-design/web-vue';

  const rowSelection = ref<TableRowSelection>({
    selectedRowKeys: [],
    showCheckedAll: true,
  });
  const formData = ref({}) as any;
  const tableRef = ref({}) as any;
  const formItems = ref([
    {
      field: 'title',
      label: '标题名称',
      showColon: true,
      valueType: 'text',
    },
    {
      field: 'category',
      label: '文章分类',
      showColon: true,
      valueType: 'select',
      request: '/category/get',
      props: {
        label: 'value',
        value: 'id',
      },
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
    },
    {
      field: 'status',
      label: '状态',
      showColon: true,
      valueType: 'select',
      options: [
        {
          label: '已发布',
          value: '1001',
        },
        {
          label: '未发布',
          value: '1002',
        },
      ],
    },
    {
      field: 'publishTime',
      label: '发布时间',
      showColon: true,
      span: 12,
      valueType: 'time',
    },
  ]);
  const onDelete = (record: TableData) => {
    Modal.warning({
      title: '温馨提示',
      content: '确认删除？',
      hideCancel: false,
      onOk: () => {
        deleteArticle({ id: record.id });
        tableRef.value?.reload();
      },
    });
  };
  const columns = ref<TableColumnData[]>([
    {
      dataIndex: 'id',
      title: 'ID',
      fixed: 'left',
      width: 120,
    },
    {
      dataIndex: 'title',
      title: '文章标题',
      tooltip: true,
      ellipsis: true,
      width: 220,
    },
    {
      dataIndex: 'categoryName',
      title: '文章分类',
      width: 150,
      render: ({ record }) => {
        return record.categoryName || record.category?.value;
      },
    },
    {
      dataIndex: 'visitor',
      title: '阅读量',
      width: 100,
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
          before-change={() => {
            return new Promise((resolve, reject) => {
              Modal.warning({
                title: '温馨提示',
                simple: true,
                draggable: true,
                content: `确认${record.status === 1002 ? '取消' : ''}发布？`,
                hideCancel: false,
                onOk: () => {
                  return changeStatus({
                    id: record.id,
                    status: record.status,
                  }).then((res: any) => {
                    // eslint-disable-next-line no-unused-expressions
                    res.success ? resolve(res) : reject(res);
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
      ),
    },
    // {
    //   dataIndex: 'isRecommended',
    //   title: '是否推荐',
    //   width: 150,
    //   render: ({ record }) => (
    //     <a-switch v-model={record.isRecommended}></a-switch>
    //   ),
    // },
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
                path: '/article/edit',
                query: { id: record.id, readOnly: 'true' },
              });
            }}
          >
            查看
          </a-link>
          <a-link
            onClick={() => {
              router.push({ path: '/article/edit', query: { id: record.id } });
            }}
          >
            编辑
          </a-link>
          <a-link onClick={() => onDelete(record)}>删除</a-link>
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
