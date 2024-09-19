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
        <template #tabs="{ form }">
            <a-tabs
                v-model:active-key="form.sourceFrom"
                @change="
                    tableRef.search({
                        sourceFrom: Number(form.sourceFrom) || '',
                    })
                "
            >
                <a-tab-pane key="" title="本地"></a-tab-pane>
                <a-tab-pane key="1002" title="网络"></a-tab-pane>
            </a-tabs>
        </template>
        <template #title>
            {{ $t('menu.material.list') }}
        </template>
        <template #extra>
            <a-space :size="16">
                <Upload url="/upload" @change="() => tableRef.reload()">
                    <template #button>
                        <a-button type="primary" size="small">+上传</a-button>
                    </template>
                </Upload>
            </a-space>
        </template>
        <template #list-item="{ item }">
            <a-list-item class="list-item" action-layout="vertical">
                <a-image
                    alt="avatar"
                    fit="cover"
                    width="100%"
                    height="160"
                    show-loader
                    :title="
                        (
                            item.title ||
                            item.img_title ||
                            item.name ||
                            item.category ||
                            ''
                        ).slice(0, 10)
                    "
                    :preview-props="{
                        src: item.high_img || item.realUrl || item.img,
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
                    :src="item.url || item.img"
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
                            <a-tooltip
                                :content="
                                    item.tag ||
                                    item.title ||
                                    item.img_title ||
                                    item.name ||
                                    item.category ||
                                    ''
                                "
                            >
                                <span class="action" style="margin-right: 5px"
                                    ><icon-info-circle
                                /></span>
                            </a-tooltip>
                            <a-tooltip v-if="item.canDelete" content="删除">
                                <a-popconfirm
                                    content="确定删除?"
                                    @ok="onDelete(item)"
                                >
                                    <span class="action"><icon-delete /></span>
                                </a-popconfirm>
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
    import { queryFileList, deleteFileById } from '@/api/file';
    import { downloadFile } from '@/utils';
    import { Message } from '@arco-design/web-vue';

    const tableRef = ref({}) as any;
    const formItems = ref([
        {
            field: 'name',
            label: '文件名',
            attrs: {
                placeholder: '请输入文件名',
            },
            width: 200,
            showColon: true,
            valueType: 'text',
        },
        // {
        //   field: 'sourceFrom',
        //   label: '来源',
        //   attrs: {
        //     placeholder: '请选择来源',
        //   },
        //   width: 200,
        //   showColon: true,
        //   valueType: 'select',
        //   options: [
        //     {
        //       label: '全部',
        //       value: '',
        //     },
        //     {
        //       label: '网络',
        //       value: 1001,
        //     },
        //     {
        //       label: '本地',
        //       value: 1002,
        //     },
        //   ],
        //   slotName: 'tabs',
        // },
        {
            field: 'createTime',
            label: '上传时间',
            showColon: true,
            span: 12,
            valueType: 'time',
        },
    ]);
    const onDownLoad = ({ realUrl, tag }: any) => {
        downloadFile(realUrl, tag);
    };
    const onDelete = (item: any) => {
        deleteFileById({ ids: [item.id] }).then((res: any) => {
            Message[res.success ? 'success' : 'error'](res.data || res.message);
            tableRef.value.reload();
        });
    };
</script>

<script lang="tsx">
    export default {
        name: 'Material',
    };
</script>

<style scoped lang="less">
    .list-item {
        padding: 0 !important;
        box-shadow: 0 0 4px #eee;
        border-radius: 5px;
        cursor: pointer;
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
