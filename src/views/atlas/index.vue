<template>
  <ProTable
    ref="tableRef"
    row-key="id"
    list-type="card"
    :request="queryFileList"
    :form-items="formItems"
    :pagination="true"
    :show-more="false"
  >
    <template #title>
      {{ $t('menu.atlas.list') }}
    </template>
    <template #list-item="{ item }">
      <a-list-item class="list-item" action-layout="vertical">
        <a-image
          alt="avatar"
          fit="cover"
          width="100%"
          height="160"
          show-loader
          :title="item.category"
          :preview-props="{
            src: item.realUrl,
            defaultVisible: false,
            closable: false,
            maskClosable: true,
            actionsLayout: [
              'fullScreen',
              'rotateRight',
              'rotateLeft',
              'zoomIn',
              'zoomOut',
              'originalSize',
            ],
          }"
          :src="item.url"
        >
          <template #extra>
            <div class="actions">
              <a-tooltip content="下载图片">
                <span
                  class="action"
                  style="margin-right: 5px"
                  @click="onDownLoad(item)"
                  ><icon-download
                /></span>
              </a-tooltip>
              <a-tooltip :content="item.tag">
                <span class="action"><icon-info-circle /></span>
              </a-tooltip>
            </div>
          </template>
        </a-image>
      </a-list-item>
    </template>
  </ProTable>
</template>

<script lang="tsx" setup>
  import { ref } from 'vue';
  import { queryFileList } from '@/api/file';
  import { downloadFile } from '@/utils';
  //   import { Modal } from '@arco-design/web-vue';

  //   const rowSelection = ref<TableRowSelection>({
  //     selectedRowKeys: [],
  //     showCheckedAll: true,
  //   });
  const formData = ref({}) as any;
  const tableRef = ref({}) as any;
  const formItems = ref([
    {
      field: 'k',
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

  formItems.value.map((el: any) => {
    formData[el.field] = undefined;
    return el;
  });
  const onDownLoad = ({ realUrl, tag }: any) => {
    downloadFile(realUrl, tag);
    //   console.log('download');
  };
</script>

<style scoped lang="less">
  .list-item {
    padding: 0 !important;
    box-shadow: 0 0 4px #eee;
    border-radius: 5px;
  }
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
