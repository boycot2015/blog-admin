<template>
  <a-spin :loading="loading" style="width: 100%">
    <a-card
      class="general-card"
      :header-style="{ paddingBottom: '0' }"
      :body-style="{ padding: '17px 20px 21px 20px' }"
    >
      <template #title>
        {{ $t('workplace.popularContent') }}
      </template>
      <template #extra>
        <a-link>{{ $t('workplace.viewMore') }}</a-link>
      </template>
      <a-space direction="vertical" :size="10" fill>
        <a-table
          :data="renderList"
          :pagination="false"
          :bordered="false"
          :scroll="{ x: '100%', y: 'auto' }"
        >
          <template #columns>
            <a-table-column title="ID" data-index="id"></a-table-column>
            <a-table-column title="文章标题" data-index="articleAbstract">
              <template #cell="{ record }">
                <a-typography-paragraph
                  :ellipsis="{
                    rows: 1,
                  }"
                >
                  {{ record.title }}
                </a-typography-paragraph>
              </template>
            </a-table-column>
            <a-table-column title="文章分类" data-index="articleType">
              <template #cell="{ record }">
                {{
                  record.articleType === 'COMPANY_NEWS'
                    ? '公司动态'
                    : '其他资讯'
                }}
              </template>
            </a-table-column>
            <a-table-column title="阅读量" data-index="clickNum">
            </a-table-column>
            <a-table-column title="发布时间" data-index="publishTime">
            </a-table-column>
            <a-table-column title="状态" data-index="status">
              <template #cell="{ record }">
                <a-switch v-model="record.status"></a-switch>
              </template>
            </a-table-column>
            <a-table-column title="是否推荐" data-index="isRecommended">
              <template #cell="{ record }">
                <a-switch v-model="record.isRecommended"></a-switch>
              </template>
            </a-table-column>
            <a-table-column title="操作" :width="140" data-index="action">
              <template #cell="{ record }">
                <a-link>查看{{ record.id }}</a-link>
                <a-link>编辑</a-link>
                <a-link>删除</a-link>
              </template>
            </a-table-column>
          </template>
        </a-table>
      </a-space>
    </a-card>
  </a-spin>
</template>

<script lang="ts" setup>
  import { ref } from 'vue';
  import useLoading from '@/hooks/loading';
  import { queryArticleList } from '@/api/article';
  //   import type { TableData } from '@arco-design/web-vue/es/table/interface';
  import type { ArticleRecord } from '@/api/article';

  const { loading, setLoading } = useLoading();
  const renderList = ref<ArticleRecord[]>();
  const fetchData = async (contentType: string) => {
    try {
      setLoading(true);
      const { data } = await queryArticleList({ type: contentType });
      renderList.value = data.records;
    } catch (err) {
      // you can report use errorHandler or other
    } finally {
      setLoading(false);
    }
  };
  fetchData('text');
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
