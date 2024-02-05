<template>
    <a-grid :cols="24" :row-gap="16" class="panel">
        <a-grid-item
            v-for="item in statisticList"
            :key="item.prop"
            class="panel-col"
            :span="{ xs: 12, sm: 12, md: 12, lg: 12, xl: 12, xxl: 6 }"
        >
            <a-space>
                <a-avatar :size="54" class="col-avatar">
                    <img alt="avatar" :src="item.imgUrl" />
                </a-avatar>
                <a-statistic
                    :title="item.title"
                    :value="item.prop ? item.value : undefined"
                    :precision="0"
                    :value-from="0"
                    animation
                    show-group-separator
                >
                    <template #suffix>
                        <span class="unit">{{ $t('workplace.pecs') }}</span>
                    </template>
                </a-statistic>
            </a-space>
        </a-grid-item>
        <a-grid-item :span="24">
            <a-divider class="panel-border" />
        </a-grid-item>
    </a-grid>
</template>

<script lang="ts" setup>
    import { ref } from 'vue';
    //   import useLoading from '@/hooks/loading';
    import { queryContentData } from '@/api/dashboard';
    import { useI18n } from 'vue-i18n';
    import { isValidKey } from '@/utils/is';
    //   import type { TableData } from '@arco-design/web-vue/es/table/interface';
    import type { ContentDataRecord } from '@/api/dashboard';

    const { t } = useI18n();

    //   const { loading, setLoading } = useLoading();
    const statisticList = ref<ContentDataRecord[]>([
        {
            title: t('workplace.totalNum'),
            value: 0,
            prop: 'total',
            imgUrl: '//p3-armor.byteimg.com/tos-cn-i-49unhts6dw/288b89194e657603ff40db39e8072640.svg~tplv-49unhts6dw-image.image',
        },
        {
            title: t('workplace.articleNum'),
            value: 0,
            prop: 'publicData',
            imgUrl: '//p3-armor.byteimg.com/tos-cn-i-49unhts6dw/fdc66b07224cdf18843c6076c2587eb5.svg~tplv-49unhts6dw-image.image',
        },
        {
            title: t('workplace.visitorNum'),
            value: 0,
            prop: 'visitorData',
            imgUrl: '//p3-armor.byteimg.com/tos-cn-i-49unhts6dw/288b89194e657603ff40db39e8072640.svg~tplv-49unhts6dw-image.image',
        },
        {
            title: t('workplace.category'),
            value: 0,
            prop: 'category',
            imgUrl: '//p3-armor.byteimg.com/tos-cn-i-49unhts6dw/288b89194e657603ff40db39e8072640.svg~tplv-49unhts6dw-image.image',
        },
        {
            title: t('workplace.tag'),
            value: 0,
            prop: 'tag',
            imgUrl: '//p3-armor.byteimg.com/tos-cn-i-49unhts6dw/288b89194e657603ff40db39e8072640.svg~tplv-49unhts6dw-image.image',
        },
        {
            title: t('workplace.newFromYesterday'),
            value: 0,
            prop: '',
            imgUrl: '//p3-armor.byteimg.com/tos-cn-i-49unhts6dw/c8b36e26d2b9bb5dbf9b74dd6d7345af.svg~tplv-49unhts6dw-image.image',
        },
    ]);
    const fetchData = async () => {
        try {
            //   setLoading(true);
            const { data } = (await queryContentData()) as any;
            statisticList.value.map((el: ContentDataRecord) => {
                // eslint-disable-next-line no-restricted-syntax
                for (const key in data) {
                    if (el.prop === key && isValidKey(key, data)) {
                        el.value =
                            data[key].total >= 0 ? data[key].total : data[key];
                    }
                }
                return el;
            });
        } catch (err) {
            // you can report use errorHandler or other
        } finally {
            //   setLoading(false);
        }
    };
    fetchData();
</script>

<style lang="less" scoped>
    .arco-grid.panel {
        margin-bottom: 0;
        padding: 16px 20px 0 20px;
    }
    .panel-col {
        padding-left: 43px;
        border-right: 1px solid rgb(var(--gray-2));
        &:nth-child(2n) {
            border-right: 0;
        }
    }
    .col-avatar {
        margin-right: 12px;
        background-color: var(--color-fill-2);
    }
    .up-icon {
        color: rgb(var(--red-6));
    }
    .unit {
        margin-left: 8px;
        color: rgb(var(--gray-8));
        font-size: 12px;
    }
    :deep(.panel-border) {
        margin: 4px 0 0 0;
    }
</style>
