<template>
  <a-spin style="width: 100%">
    <a-card
      v-if="props.formItems"
      style="border-width: 0 0 1px 0"
      :body-style="{
        padding: '16px 16px 8px',
      }"
    >
      <slot name="tabs" :form="formData"></slot>
      <Form
        v-bind="{
          ...props,
        }"
        show-more
        :form-items="props.formItems"
        @search="search"
        @reset="reset"
        @show-more="(val) => (isMore = val)"
      >
        <template
          v-for="item in props.formItems.filter((el) => el.slotName)"
          :key="item.prop"
        >
          <slot :name="item.slotName" :form="formData" :item="item"></slot>
        </template>
      </Form>
    </a-card>
    <a-card
      ref="tableCardRef"
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
            minHeight: scroll.y,
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
          :style="{ minHeight: scroll.y }"
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
              v-model:page-size="pageData.pageSize"
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
  import { ref, watch, reactive, computed, onMounted, nextTick } from 'vue';
  import useLoading from '@/hooks/loading';
  // import type { FormInstance } from '@arco-design/web-vue/es/form';
  import type { PaginationProps } from '@arco-design/web-vue/es/pagination';
  import type { Pagination } from '@/types/global';
  import { useAppStore } from '@/store';
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

  const appStore = useAppStore();
  const footer = computed(() => appStore.footer);
  const navbar = computed(() => appStore.navbar);
  const tabBar = computed(() => appStore.tabBar);
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
    scroll?: { x?: number | string; y?: number | string | bigint | any };
    selectedKeys?: BaseType[] | undefined;
  };
  const props = defineProps<ProTableProps>();
  const emits = defineEmits(['update:selectedKeys']);
  const tableCardRef = ref<any>();
  const { loading, setLoading } = useLoading();
  const formData = ref<any>({});
  const isMore = ref<boolean>(false);
  const renderList = ref<any[]>();
  const selectedKeys = ref<BaseType[]>();
  const pageData = ref<Pagination & PaginationProps>({
    current: 1,
    pageSize: props.listType === 'card' ? 30 : 10,
    showPageSize: true,
    total: 0,
  });
  watch(props, (val) => {
    pageData.value.pageSize = val.listType === 'card' ? 30 : 10;
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
  const getOffsetTop = (el: any) => {
    let { offsetTop } = el;
    if (el.offsetParent) {
      offsetTop += getOffsetTop(el.offsetParent);
    }
    return offsetTop;
  };
  const getHeight = (isNavBar?: boolean) => {
    const offsetTop = getOffsetTop(tableCardRef.value?.$el);
    return `calc(100vh - ${
      offsetTop +
      (footer.value ? 192 : 152) +
      // eslint-disable-next-line no-nested-ternary
      (isNavBar ? (navbar.value ? 60 : -60) : 0)
    }px)`;
  };
  const scroll = reactive({
    x: '100%',
    y: props.scroll?.y,
  });
  watch([footer, tabBar, isMore], () => {
    nextTick(() => {
      scroll.y =
        (props.scroll && (props.scroll?.y !== 'auto' ? getHeight() : 'auto')) ||
        getHeight();
    });
  });
  watch([navbar], () => {
    nextTick(() => {
      scroll.y =
        (props.scroll &&
          (props.scroll?.y !== 'auto' ? getHeight(true) : 'auto')) ||
        getHeight(true);
    });
  });
  const fetchData = async () => {
    try {
      if (!props.request) return;
      setLoading(true);
      const { current, pageSize: size } = pageData.value;
      let params: any = {};
      Object.keys(formData.value).forEach((key: string) => {
        if (formData.value[key] !== '' && formData.value[key] !== undefined) {
          params[key] = formData.value[key];
        }
        if (typeof formData.value[key] === 'object') {
          params[key] = params[key].filter((el: any) => el).toString();
        }
      });
      params = { current, size, ...params };
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
  onMounted(() => {
    nextTick(() => {
      scroll.y =
        (props.scroll && (props.scroll?.y !== 'auto' ? getHeight() : 'auto')) ||
        getHeight();
    });
  });
  const search = (params: any) => {
    pageData.value.current = 1;
    Object.assign(formData.value, params);
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
      padding-left: 5px;
      background-color: var(--color-fill-2);
      border: 1px solid var(--color-neutral-3);
    }
  }
  :deep(.arco-picker),
  :deep(.arco-select-view-single),
  :deep(.arco-input-wrapper) {
    // background-color: #fff;
    border: none;
  }
  .arco-picker,
  .arco-select-view-single,
  .arco-input-wrapper {
    // background-color: #fff;
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
