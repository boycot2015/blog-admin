<template>
  <ProTable
    ref="tableRef"
    v-model:selectedKeys="rowSelection.selectedRowKeys"
    row-key="id"
    check-all="全选所有结果"
    :request="queryFileList"
    :form-items="formItems"
    :columns="columns"
    :pagination="true"
    :show-more="false"
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
  import { queryFileList } from '@/api/file';
  import type {
    TableColumnData,
    // TableData,
    TableRowSelection,
  } from '@arco-design/web-vue/es/table';
  //   import router from '@/router';
  //   import { Modal } from '@arco-design/web-vue';

  const rowSelection = ref<TableRowSelection>({
    selectedRowKeys: [],
    showCheckedAll: true,
  });
  const formData = ref({}) as any;
  const tableRef = ref({}) as any;
  const formItems = ref([
    {
      field: 'name',
      label: '文件名',
      width: 200,
      showColon: true,
      valueType: 'text',
    },
    {
      field: 'updateTime',
      label: '上传时间',
      showColon: true,
      span: 12,
      valueType: 'time',
    },
  ]);
  const columns = ref<TableColumnData[]>([
    {
      dataIndex: 'id',
      title: 'ID',
      fixed: 'left',
      width: 120,
    },
    {
      dataIndex: 'avatar',
      title: '图片',
      width: 120,
      render: ({ record }: any) => {
        return <a-image height={40} src={record.url}></a-image>;
      },
    },
    {
      dataIndex: 'fileName',
      title: '文件名',
      tooltip: true,
      ellipsis: true,
      width: 220,
    },
    {
      dataIndex: 'updateTime',
      title: '上传时间',
      render: ({ record }) =>
        new Date(record.createTime).toLocaleString().replace(/\//g, '-'),
      width: 180,
      sortable: {
        sortDirections: ['descend', 'ascend'],
        sorter: false,
        defaultSortOrder: '',
      },
    },
    // {
    //   dataIndex: 'operation',
    //   title: '操作',
    //   fixed: 'right',
    //   width: 180,
    //   render: ({ record }) => (
    //     <a-space size={8} record={record}>
    //       <a-link
    //         onClick={() => {
    //           router.push({
    //             path: '/article/edit',
    //             query: { id: record.id, readOnly: 'true' },
    //           });
    //         }}
    //       >
    //         查看
    //       </a-link>
    //       <a-link
    //         onClick={() => {
    //           router.push({ path: '/article/edit', query: { id: record.id } });
    //         }}
    //       >
    //         编辑
    //       </a-link>
    //     </a-space>
    //   ),
    // },
  ]);
  formItems.value.map((el: any) => {
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
