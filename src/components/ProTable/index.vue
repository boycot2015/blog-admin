<template>
  <a-spin style="width: 100%">
    <a-card style="border-width: 0 0 1px 0">
      <slot name="tabs"></slot>
      <Form
        v-bind="{
          ...props,
        }"
        :form-items="props.formItems"
        @search="search"
        @reset="reset"
        @show-more="showMore"
      ></Form>
    </a-card>
    <a-card
      class="general-card"
      :header-style="{ paddingBottom: '0' }"
      :body-style="{ padding: '17px 20px 21px 20px' }"
    >
      <template #title>
        <span v-if="props.title">{{ props.title }}</span>
        <slot v-else name="title"></slot>
      </template>
      <template #extra>
        <slot name="extra"></slot>
      </template>
      <a-space direction="vertical" :size="10" fill>
        <a-table
          v-model:selectedKeys="selectedKeys"
          :row-key="props.rowKey"
          :data="renderList"
          :pagination="false"
          :loading="loading"
          :columns="props.columns"
          :row-selection="props.rowSelection"
          :bordered="props.bordered || false"
          :scroll="{ ...scroll }"
        ></a-table>
        <a-row>
          <a-col :span="12">
            <a-checkbox
              v-if="props.checkAll"
              v-model="checkAll"
              style="padding-left: 12px"
              >{{ props.checkAll || '全选' }}</a-checkbox
            >
            <slot v-else name="checkAll"></slot>
          </a-col>
          <a-col :span="12">
            <a-pagination
              v-if="props.pagination"
              v-model:current="pageData.current"
              style="float: right"
              :page-size="pageData.size"
              show-total
              show-jumper
              show-page-size
              :page-size-options="[10, 20, 30, 50, 100]"
              :total="pageData.total"
              @change="pageChange"
              @page-size-change="pageSizeChange"
            ></a-pagination>
          </a-col>
        </a-row>
      </a-space>
    </a-card>
  </a-spin>
</template>

<script lang="ts" setup>
  import { ref, watch } from 'vue';
  import useLoading from '@/hooks/loading';
  import type {
    FormInstance,
    // FormItemInstance,
  } from '@arco-design/web-vue/es/form';
  import type { PaginationProps } from '@arco-design/web-vue/es/pagination';
  import type { Pagination, Options } from '@/types/global';
  import type {
    TableColumnData,
    TableData,
    TableBorder,
    TableRowSelection,
    TableExpandable,
  } from '@arco-design/web-vue/es/table/interface';

  import { BaseType } from '@arco-design/web-vue/es/_utils/types';
  import Form from './form.vue';
  //   import Table from './table.vue';
  const checkAll = ref(false);
  //   const emits = defineEmits(['action']);
  export type FormItemProps = {
    labelColFlex?: number | string;
    field: string;
    label: string;
    valueType: string;
    span?: number;
    options?: Options[];
  };
  type ProTableProps = {
    formItems: FormItemProps[] | undefined;
    columns?: TableColumnData[] | undefined;
    data?: TableData[] | undefined;
    bordered?: boolean | TableBorder | undefined;
    rowKey: string;
    checkAll?: string | boolean;
    rowSelection?: TableRowSelection | undefined;
    expandable?: TableExpandable | undefined;
    pagination?: boolean | PaginationProps;
    pagePosition?: string | undefined;
    title?: string | undefined;
    request?: ((args: any) => Promise<any>) | undefined;
    scroll?: { x?: number | string; y?: number | string };
    selectedKeys: any[] | undefined;
  };
  const props = defineProps<ProTableProps>();
  const emits = defineEmits(['update:selectedKeys']);
  const formRef = ref<FormInstance>();
  const { loading, setLoading } = useLoading();
  const formData = ref({});
  const renderList = ref<any[]>();
  const selectedKeys = ref<BaseType[]>();
  const pageData = ref<Pagination & PaginationProps>({
    current: 1,
    pageSize: 10,
    showPageSize: true,
    total: 100000,
  });
  watch(selectedKeys, () => {
    emits('update:selectedKeys', selectedKeys);
  });
  watch(checkAll, () => {
    selectedKeys.value = checkAll.value
      ? renderList.value?.map((el) => el[props.rowKey])
      : [];
    emits('update:selectedKeys', selectedKeys);
  });
  const scroll = ref({ x: '100%', y: 'calc(100vh - 370px)', ...props.scroll });
  const fetchData = async () => {
    try {
      if (!props.request) return;
      setLoading(true);
      const { current, pageSize: size } = pageData.value;
      const params = { current, size, ...formData.value };
      const { data } = await props.request(params);
      renderList.value = data.records;
      pageData.value.total = data.total;
      if (checkAll.value) {
        selectedKeys.value = renderList.value?.map((el) => el[props.rowKey]);
      }
    } catch (err) {
      // you can report use errorHandler or other
    } finally {
      setLoading(false);
    }
  };
  fetchData();
  const search = (params: any) => {
    pageData.value.current = 1;
    formData.value = params;
    fetchData();
  };
  const reset = () => {
    pageData.value.current = 1;
    formRef.value?.resetFields();
    formData.value = {};
    selectedKeys.value = [];
    checkAll.value = false;
    fetchData();
  };
  const pageSizeChange = (val: any) => {
    pageData.value.size = val;
    pageData.value.current = 1;
    fetchData();
  };
  const pageChange = (val: any) => {
    pageData.value.current = val || 1;
    fetchData();
  };
  const showMore = (val: boolean) => {
    if (props.scroll === false) {
      return;
    }
    scroll.value.y = val ? 'calc(100vh - 405px)' : 'calc(100vh - 370px)';
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
