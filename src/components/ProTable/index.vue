<template>
  <a-spin style="width: 100%">
    <a-card
      v-if="props.formItems"
      style="border-width: 0 0 1px 0"
      :body-style="{
        padding: '16px 16px 8px',
      }"
    >
      <slot name="tabs"></slot>
      <Form
        v-bind="{
          ...props,
        }"
        show-more
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
        <a-list
          v-if="listType === 'card'"
          :bordered="false"
          :loading="loading"
          :data="renderList"
          :grid-props="{
            gutter: [15, 15],
            xs: 24,
            sm: 12,
            md: 8,
            lg: 6,
            xl: 4,
          }"
          :style="{
            marginTop: 10,
            maxHeight: scroll.y,
            overflow: 'auto',
          }"
        >
          <template #item="{ item }">
            <slot name="list-item" :item="item"></slot>
          </template>
        </a-list>
        <a-table
          v-else
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
              >{{ props.checkAll || '全选' }}(已选{{
                checkAll ? pageData.total : selectedKeys?.length || 0
              }}项)</a-checkbox
            >
            <slot v-else name="checkAll"></slot>
          </a-col>
          <a-col :span="12">
            <a-pagination
              v-if="props.pagination"
              v-model:current="pageData.current"
              v-model:page-size="pageData.size"
              style="float: right"
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
  // import type { FormInstance } from '@arco-design/web-vue/es/form';
  import type { PaginationProps } from '@arco-design/web-vue/es/pagination';
  import type { Pagination } from '@/types/global';
  import type {
    TableColumnData,
    TableData,
    TableBorder,
    TableRowSelection,
    TableExpandable,
  } from '@arco-design/web-vue/es/table/interface';
  import { BaseType } from '@arco-design/web-vue/es/_utils/types';
  import type { FormItemProps } from './types';
  import Form from './form.vue';

  const checkAll = ref(false);
  type ProTableProps = {
    formItems?: FormItemProps[];
    columns?: TableColumnData[] | undefined;
    data?: TableData[] | undefined;
    bordered?: boolean | TableBorder | undefined;
    rowKey?: string | undefined;
    checkAll?: string | boolean;
    rowSelection?: TableRowSelection | undefined;
    expandable?: TableExpandable | undefined;
    pagination?: boolean | PaginationProps | any;
    pagePosition?: string | undefined;
    title?: string | undefined;
    listType?: string;
    request?: ((args: any) => Promise<any>) | undefined;
    scroll?: { x?: number | string; y?: number | string };
    selectedKeys?: BaseType[] | undefined;
  };
  const props = defineProps<ProTableProps>();
  const emits = defineEmits(['update:selectedKeys']);
  //   const formRef = ref<FormInstance>();
  const { loading, setLoading } = useLoading();
  const formData = ref({});
  const renderList = ref<any[]>();
  const selectedKeys = ref<BaseType[]>();
  const pageData = ref<Pagination & PaginationProps>({
    current: 1,
    defaultPagesize: props.listType === 'card' ? 30 : 10,
    pageSize: props.listType === 'card' ? 30 : 10,
    showPageSize: true,
    total: 0,
  });
  watch(props, (val) => {
    pageData.value.defaultPageSize = val.listType === 'card' ? 30 : 10;
  });
  watch(selectedKeys, () => {
    emits('update:selectedKeys', selectedKeys);
  });
  watch(checkAll, () => {
    if (!props.rowKey) return;
    selectedKeys.value = checkAll.value
      ? renderList.value?.map((el) => el[props.rowKey || ''])
      : [];
    emits('update:selectedKeys', selectedKeys);
  });
  const scroll = ref({
    x: '100%',
    y:
      (props.scroll &&
        (props.scroll?.y !== 'auto' ? 'calc(100vh - 365px)' : 'auto')) ||
      'calc(100vh - 365px)',
  });
  const fetchData = async () => {
    try {
      if (!props.request) return;
      setLoading(true);
      const { current, pageSize: size } = pageData.value;
      const params = { current, size, ...formData.value };
      const { data } = await props.request(params);

      renderList.value = data.records;
      pageData.value.total = data.total;
      if (checkAll.value && props.rowKey) {
        selectedKeys.value = renderList.value?.map(
          (el) => el[props.rowKey || '']
        );
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
    selectedKeys.value = [];
    checkAll.value = false;
    formData.value = {};
    fetchData();
  };
  const pageSizeChange = (val: any) => {
    pageData.value.pageSize = val;
    pageData.value.current = 1;
    fetchData();
  };
  const pageChange = (val: any) => {
    pageData.value.current = val || 1;
    fetchData();
  };
  const showMore = (val: boolean) => {
    if (props.scroll && props.scroll.y === 'auto') {
      return;
    }
    scroll.value.y = val ? `calc(100vh - 405px)` : 'calc(100vh - 365px)';
  };
  defineExpose({
    reload: reset,
    search,
  });
</script>

<style scoped lang="less">
  //   .general-card {
  //     min-height: 395px;
  //   }
  :deep(.arco-form) {
    .arco-form-item {
      padding: 0 5px;
      border: 1px solid var(--color-neutral-3);
    }
  }
  :deep(.arco-picker),
  :deep(.arco-select-view-single),
  :deep(.arco-input-wrapper) {
    background-color: #fff;
    border: none;
  }
  .arco-picker,
  .arco-select-view-single,
  .arco-input-wrapper {
    background-color: #fff;
    border: 1px solid var(--color-neutral-3);
    &:hover {
      background-color: #fff;
      border: 1px solid rgba(var(--primary-6));
    }
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
