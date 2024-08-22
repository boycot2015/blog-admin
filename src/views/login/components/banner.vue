<template>
    <div class="banner">
        <div class="banner-inner">
            <a-carousel class="carousel" animation-name="fade">
                <a-carousel-item
                    v-for="item in settingData.banner"
                    :key="item.url"
                >
                    <div :key="item.url" class="carousel-item">
                        <img class="carousel-image" :src="item.url" />
                        <div class="carousel-title">{{ item.title }}</div>
                        <!-- <div class="carousel-sub-title">{{ item.subSlogan }}</div> -->
                    </div>
                </a-carousel-item>
            </a-carousel>
        </div>
        <!-- <a-image :src="bannerImage"></a-image> -->
    </div>
</template>

<script lang="ts" setup>
    import { reactive } from 'vue';
    //   import bannerImage from '@/assets/images/login-banner.png';
    import { querySetting } from '@/api/setting';

    const settingData = reactive<any>({});
    const fetchData = () => {
        querySetting({}).then((res: any) => {
            settingData.id = res.data.id;
            settingData.notice = JSON.parse(res.data.notice).title;
            settingData.noticeUrl = JSON.parse(res.data.notice).link;
            settingData.banner = JSON.parse(res.data.banner);
            //   settingData.value.gitHub = JSON.parse(res.data.siteConfig).gitHub;
            //   settingData.value.email = JSON.parse(res.data.siteConfig).email;
            //   settingData.value.color = JSON.parse(res.data.theme).color;
            //   settingData.value.background = JSON.parse(res.data.theme).background;
        });
    };
    fetchData();
    //   import { useI18n } from 'vue-i18n';

    //   const { t } = useI18n();
</script>

<style lang="less" scoped>
    .banner {
        display: flex;
        align-items: center;
        justify-content: center;
        // background: url('@/assets/images/bg.jpg') center/cover no-repeat !important;
        &-inner {
            flex: 1;
            height: 100%;
        }
    }

    .carousel {
        height: 100%;

        &-item {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            height: 100%;
        }

        &-title {
            color: var(--color-fill-1);
            font-weight: 500;
            font-size: 20px;
            line-height: 28px;
        }

        &-sub-title {
            margin-top: 8px;
            color: var(--color-text-3);
            font-size: 14px;
            line-height: 22px;
        }

        &-image {
            width: 500px;
            margin-bottom: 30px;
        }
    }
</style>
