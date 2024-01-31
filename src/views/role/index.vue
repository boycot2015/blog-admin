<template>
  <div class="role-list">
    <ProTable
      ref="tableRef"
      v-model:selectedKeys="rowSelection.selectedRowKeys"
      row-key="id"
      check-all="全选所有结果"
      :request="queryRoleList"
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
          <a-button type="primary" @click="onAdd">
            <a-space :size="8"> <icon-plus></icon-plus>新增</a-space>
          </a-button>
        </a-space>
      </template>
    </ProTable>
    <a-modal
      v-model:visible="visible"
      :title="
        formData.permissions ? '配置权限' : `${!formData.id ? '新增' : '编辑'}角色`"
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
              v-model:checked-keys="checkedKeys"
              :only-check-leaf="true"
              :checkable="true"
              :allow-search="true"
              :allow-clear="true"
              :tree-checkable="true"
              :tree-check-strictly="treeCheckStrictly"
              :data="treeData"
              :field-names="{
                key: 'id',
                title: 'name',
              }"
              placeholder="请选择权限"
              style="width: 100%"
            ></a-tree>
          </a-form-item>
        </template>
        <template v-else>
          <a-form-item
            field="name"
            label="名称"
            :rules="[{ required: true, message: '名称不能为空' }]"
          >
            <a-input v-model="formData.name" placeholder="请输入名称" />
          </a-form-item>
          <a-form-item field="desc" label="说明">
            <a-input v-model="formData.desc" placeholder="请输入说明" />
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
  import type {
    TableColumnData,
    TableRowSelection,
  } from '@arco-design/web-vue/es/table';
  import { Message, Modal } from '@arco-design/web-vue';
  import { convertArrayToTree } from '@/utils';

  const rowSelection = ref<TableRowSelection>({
    selectedRowKeys: [],
    showCheckedAll: true,
  });
  const visible = ref(false);
  const roleFormRef = ref();
  const formData = ref({}) as any;
  const tableRef = ref({}) as any;
  const treeData = ref({}) as any;
  const checkedKeys = ref([]);
  const treeCheckStrictly = ref(false);
  const onDelete = (record: any) => {
    Modal.warning({
      title: '温馨提示',
      content: '确认删除？',
      hideCancel: false,
      onOk: () => {
        deleteRole({ id: record.id }).then((res: any) => {
          tableRef.value?.reload();
          Message[res.success ? 'success' : 'error'](res.data || res.message);
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
    },
    {
      field: 'createTime',
      label: '创建时间',
      showColon: true,
      span: 12,
      valueType: 'time',
    },
  ]);
  const columns = ref<TableColumnData[]>([
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
        new Date(record.createTime).toLocaleString().replace(/\//g, '-'),
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
      render: ({ record }) => (
        <a-space size={8} record={record}>
          <a-link
            onClick={() => {
              console.log('配置权限');
              getRoleById({ id: record.id }).then((result) => {
                getMenuList().then((res) => {
                  const data = convertArrayToTree([
                    {
                      id: 0,
                      pid: null,
                      name: '所有权限',
                    },
                    ...res.data,
                  ]);
                  treeData.value = data;
                  Object.assign(formData.value, result.data);
                  console.log(data, result.data, 'data');
                  visible.value = true;
                });
              });
            }}
          >
            配置权限
          </a-link>
          <a-link
            onClick={() => {
              Object.assign(formData.value, record);
              visible.value = true;
            }}
          >
            编辑
          </a-link>
          {record.id !== 1 ? (
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
          permissions: [] as any
        };
        if (!data.id) {
          addRole(data).then((res: any) => {
            tableRef.value?.reload();
            Message[res.success ? 'success' : 'error'](res.data || res.message);
            visible.value = false;
            done();
            onModalClose();
          });
          return;
        }
        // console.log(formData.permissions, 'formData.permissions');
        
        if (checkedKeys.value && checkedKeys.value.length) {
          data.permissions = checkedKeys.value
        }
        editRole(data).then((res: any) => {
          tableRef.value?.reload();
          Message[res.success ? 'success' : 'error'](res.data || res.message);
          visible.value = false;
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
    checkedKeys.value = []
  };
  const filterTreeNode = (searchValue: string, nodeData: any) => {
    return nodeData.name.toLowerCase().indexOf(searchValue.toLowerCase()) > -1;
  }
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
