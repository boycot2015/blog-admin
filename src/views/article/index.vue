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
  import { ref, watch, reactive } from 'vue';
  import { queryArticleList, deleteArticle, changeStatus } from '@/api/article';
  import type {
    TableColumnData,
    TableData,
    TableRowSelection,
  } from '@arco-design/web-vue/es/table';
  import router from '@/router';
  import { Modal, Message } from '@arco-design/web-vue';
  import { useAppStore } from '@/store';

  const colors: any = reactive(useAppStore().colors as any);

  const rowSelection = reactive<TableRowSelection>({
    selectedRowKeys: [],
    showCheckedAll: true,
  });
  const tableRef = ref({}) as any;
  const formItems = ref([
    {
      field: 'title',
      label: '标题名称',
      showColon: true,
      attrs: {
        placeholder: '请输入标题名称 ',
      },
      valueType: 'text',
    },
    {
      field: 'category',
      label: '文章分类',
      showColon: true,
      attrs: {
        placeholder: '请选择文章分类 ',
      },
      valueType: 'select',
      request: '/category/get',
      props: {
        label: 'value',
        value: 'id',
      },
    },
    {
      field: 'tag',
      label: '标签',
      showColon: true,
      attrs: {
        placeholder: '请选择标签 ',
        // multiple: true,
      },
      valueType: 'select',
      request: '/tag/get',
      props: {
        label: 'value',
        value: 'id',
      },
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
        deleteArticle({ id: record.id }).then((res: any) => {
          Message.success(res.data || res.message);
          tableRef.value?.reload();
        });
      },
    });
  };
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
      dataIndex: 'tagName',
      title: '标签',
      width: 220,
      render: ({ record }) => {
        return record.tags ? (
          <div>
            {record.tags.map((el: any) => (
              <a-tag
                color={colors[Math.floor(Math.random() * colors.length)]}
                style={{ margin: '0 5px 5px 0' }}
              >
                {el.value}
              </a-tag>
            ))}
          </div>
        ) : (
          record.tagName
        );
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
                content: `确认${record.status === 1001 ? '取消' : ''}发布？`,
                hideCancel: false,
                onOk: () => {
                  return changeStatus({
                    id: record.id,
                    status: record.status === 1001 ? 1002 : 1001,
                  }).then((res: any) => {
                    // eslint-disable-next-line no-unused-expressions
                    res.success ? resolve(res) : reject(res);
                    Message[res.success ? 'success' : 'error'](
                      res.data || res.message
                    );
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
  watch(rowSelection, (val) => {
    console.log(val, 'selectedKeys');
  });
</script>

<script lang="tsx">
  export default {
    name: 'Artice', // If you want the include property of keep-alive to take effect, you must name the component
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
