<template>
    <a-grid :cols="24" :row-gap="16" class="panel">
        <a-grid-item
            v-for="item in statisticList"
            :key="item.prop"
            class="panel-col"
            :span="{ xs: 12, sm: 12, md: 12, lg: 6, xl: 6, xxl: 4 }"
        >
            <a-skeleton animation :loading="loading">
                <a-space style="width: 100%">
                    <a-skeleton-shape shape="circle" />
                    <div>
                        <a-skeleton-line :widths="[100, 60]" :rows="2" />
                    </div>
                </a-space>
            </a-skeleton>
            <template v-if="!loading">
                <a-link :hoverable="false" @click="onJump(item.link)">
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
                                <span class="unit">
                                    {{ $t('workplace.pecs') }}
                                </span>
                            </template>
                        </a-statistic>
                    </a-space>
                </a-link>
            </template>
        </a-grid-item>
        <a-grid-item :span="24">
            <a-divider class="panel-border" />
        </a-grid-item>
    </a-grid>
</template>

<script lang="ts" setup>
    import { ref } from 'vue';
    import useLoading from '@/hooks/loading';
    import { queryContentData } from '@/api/dashboard';
    import { useI18n } from 'vue-i18n';
    import { isValidKey } from '@/utils/is';
    import { useRouter } from 'vue-router';
    import type { ContentDataRecord } from '@/api/dashboard';

    const { t } = useI18n();

    const { loading, setLoading } = useLoading();
    const statisticList = ref<ContentDataRecord[]>([
        {
            title: t('workplace.totalNum'),
            value: 0,
            prop: 'total',
            link: '/article/index',
            imgUrl: '//p3-armor.byteimg.com/tos-cn-i-49unhts6dw/fdc66b07224cdf18843c6076c2587eb5.svg~tplv-49unhts6dw-image.image',
        },
        {
            title: t('workplace.articleNum'),
            value: 0,
            prop: 'publicData',
            link: '/article/index?status=1001',
            imgUrl: '//p3-armor.byteimg.com/tos-cn-i-49unhts6dw/288b89194e657603ff40db39e8072640.svg~tplv-49unhts6dw-image.image',
        },
        {
            title: t('workplace.visitorNum'),
            value: 0,
            prop: 'visitorData',
            link: '/article/index',
            imgUrl: '//p3-armor.byteimg.com/tos-cn-i-49unhts6dw/288b89194e657603ff40db39e8072640.svg~tplv-49unhts6dw-image.image',
        },
        {
            title: t('workplace.category'),
            value: 0,
            prop: 'category',
            link: '/material/category',
            imgUrl: '//p3-armor.byteimg.com/tos-cn-i-49unhts6dw/288b89194e657603ff40db39e8072640.svg~tplv-49unhts6dw-image.image',
        },
        {
            title: t('workplace.tag'),
            value: 0,
            prop: 'tag',
            link: '/material/tag',
            imgUrl: '//p3-armor.byteimg.com/tos-cn-i-49unhts6dw/288b89194e657603ff40db39e8072640.svg~tplv-49unhts6dw-image.image',
        },
        {
            title: t('workplace.newFromYesterday'),
            value: 0,
            prop: '',
            link: 'https://tongji.baidu.com/main/overview/demo/overview/index',
            imgUrl: '//p3-armor.byteimg.com/tos-cn-i-49unhts6dw/c8b36e26d2b9bb5dbf9b74dd6d7345af.svg~tplv-49unhts6dw-image.image',
        },
    ]);
    const fetchData = async () => {
        try {
            setLoading(true);
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
            setLoading(false);
        }
    };
    const router = useRouter();
    const onJump = (link: any) => {
        if (link && link.includes('http')) return window.open(link);
        if (link) router.push(link);
        return false;
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
