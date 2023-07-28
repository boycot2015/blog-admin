<template>
  <ProTable
    v-model:selectedKeys="rowSelection.selectedRowKeys"
    row-key="id"
    check-all="全选所有结果"
    :request="queryArticleList"
    :form-items="formItems"
    :columns="columns"
    :pagination="{ showTotal: true }"
    :row-selection="{
      ...rowSelection,
    }"
    :scroll="{ y: 'calc(100vh - 370px)' }"
  >
    <template #title>
      {{ $t('menu.article.list') }}
    </template>
    <template #extra>
      <a-space :size="16">
        <a-button type="primary" icon="plus">新增</a-button>
        <a-button :disabled="!rowSelection.selectedRowKeys?.length"
          >导出</a-button
        >
      </a-space>
    </template>
  </ProTable>
</template>

<script lang="tsx" setup>
  import { ref } from 'vue';
  import { queryArticleList } from '@/api/article';
  import type {
    TableColumnData,
    TableRowSelection,
  } from '@arco-design/web-vue/es/table';
  import ProTable from '@/components/ProTable/index.vue';

  const rowSelection = ref<TableRowSelection>({
    selectedRowKeys: [],
    showCheckedAll: true,
  });
  const formData = ref({}) as any;
  const formItems = ref([
    {
      field: 'title',
      label: '标题名称',
      valueType: 'text',
    },
    {
      field: 'articleType',
      label: '文章分类',
      valueType: 'select',
      options: [
        {
          label: '公司动态',
          value: 'COMPANY_NEWS',
        },
        {
          label: '行业资讯',
          value: 'OTHER_NEWS',
        },
      ],
    },
    {
      field: 'publishTime',
      label: '发布时间',
      span: 12,
      valueType: 'time',
    },
  ]);
  const columns = ref<TableColumnData[]>([
    {
      dataIndex: 'id',
      title: 'ID',
      fixed: 'left',
      width: 160,
    },
    {
      dataIndex: 'title',
      title: '文章标题',
      fixed: 'left',
      tooltip: true,
      ellipsis: true,
      width: 220,
    },
    {
      dataIndex: 'articleType',
      title: '文章分类',
      width: 150,
      render: ({ record }) => {
        return record.articleType === 'OTHER_NEWS' ? '行业资讯' : '公司动态';
      },
    },
    {
      dataIndex: 'clickNum',
      title: '阅读量',
      width: 150,
      sortable: {
        sortDirections: ['descend', 'ascend'],
        sorter: false,
        defaultSortOrder: '',
      },
    },
    {
      dataIndex: 'publishTime',
      title: '发布时间',
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
      width: 150,
      render: ({ record }) => <a-switch v-model={record.status}></a-switch>,
    },
    {
      dataIndex: 'isRecommended',
      title: '是否推荐',
      width: 150,
      render: ({ record }) => (
        <a-switch v-model={record.isRecommended}></a-switch>
      ),
    },
    {
      dataIndex: 'operation',
      title: '操作',
      fixed: 'right',
      width: 180,
      render: ({ record }) => (
        <a-space size={8} record={record}>
          <a-link>查看</a-link>
          <a-link>编辑</a-link>
          <a-link>删除</a-link>
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
