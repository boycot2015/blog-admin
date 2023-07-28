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
        <!-- <a-radio-group
          v-model:model-value="type"
          type="button"
          @change="typeChange as any"
        >
          <a-radio value="text">
            {{ $t('workplace.popularContent.text') }}
          </a-radio>
          <a-radio value="image">
            {{ $t('workplace.popularContent.image') }}
          </a-radio>
          <a-radio value="video">
            {{ $t('workplace.popularContent.video') }}
          </a-radio>
        </a-radio-group> -->
        <a-table
          :data="renderList"
          :pagination="false"
          :bordered="false"
          :scroll="{ x: '100%', y: 'auto' }"
        >
          <template #columns>
            <a-table-column title="日志编号" data-index="id"></a-table-column>
            <a-table-column title="操作时间" data-index="createTime">
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
            <a-table-column title="操作账号" data-index="operationUserId">
            </a-table-column>
            <a-table-column title="姓名" data-index="operationUserName">
            </a-table-column>
            <a-table-column title="IP地址" data-index="operationIp">
            </a-table-column>
            <a-table-column title="操作模块" data-index="operationModule">
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
  import { queryPopularList } from '@/api/dashboard';
  //   import type { TableData } from '@arco-design/web-vue/es/table/interface';
  import type { PopularRecord } from '@/api/dashboard';

  const { loading, setLoading } = useLoading();
  const renderList = ref<PopularRecord[]>();
  const fetchData = async (contentType: string) => {
    try {
      setLoading(true);
      const { data } = await queryPopularList({ type: contentType });
      renderList.value = data.logInfoList;
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
