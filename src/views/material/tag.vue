<template>
  <a-spin :style="{ display: 'flex' }" :loading="loading">
    <a-card :style="{ flex: 1 }">
      <a-space wrap>
        <a-tag
          v-for="item of data"
          :key="item.id"
          checkable
          :color="item.color"
          :closable="!item.count"
          @close.prevent
          @check="() => onTagChecked(item)"
        >
          {{ item.title }}
          <template #close-icon>
            <a-popconfirm
              v-if="!item.count"
              content="确定删除?"
              @ok="onClose(item)"
            >
              <icon-close @click.stop />
            </a-popconfirm>
          </template>
          <!-- {{ item.count ? `(${item.count})` : '' }} -->
        </a-tag>
      </a-space>
      <a-space style="margin-top: 10px">
        <a-input
          v-model="formData.title"
          style="width: 400px"
          placeholder="请选择或输入标签"
        ></a-input>
        <a-button type="primary" :disabled="!formData.title" @click="onSubmit"
          >保存</a-button
        >
        <a-button
          type="outline"
          :disabled="!formData.title"
          @click="
            addTag({
              value: formData.title,
            }).then((res) => fetchData(res))
          "
          >+新增</a-button
        >
      </a-space>
    </a-card>
  </a-spin>
</template>

<script lang="ts" setup>
  import { ref, reactive } from 'vue';
  import { queryTag, addTag, editTag, deleteTag } from '@/api/tag';
  import { Message } from '@arco-design/web-vue';
  import { useAppStore } from '@/store';
  import useLoading from '@/hooks/loading';

  type Props = {
    title?: string;
    id: string | undefined;
    color?: string;
    count?: string | number;
  };
  const { loading, setLoading } = useLoading();
  const data = ref<Props[]>([]);
  const formData = ref<Props>({
    id: '',
    title: '',
  });
  const colors: any = reactive(useAppStore().colors as any);
  const fetchData = (params?: any) => {
    setLoading(true);
    queryTag({}).then((res: any) => {
      data.value = res.data.map((el: any) => ({
        title: el.value,
        pid: el.parentId,
        id: el.id,
        count: el.articleNum,
        color: colors[Math.floor(Math.random() * colors.length)],
        key: el.id,
      }));
      //   console.log(treeData.value, 'data.value');
      if (params)
        Message[params.success ? 'success' : 'error'](
          params.data || params.message
        );
      setLoading(false);
    });
  };
  const onTagChecked = (item: Props) => {
    formData.value.id = item.id;
    formData.value.title = item.title;
  };
  const onSubmit = () => {
    const params = {
      id: formData.value.id || undefined,
      value: formData.value.title,
    };
    if (params.id) editTag(params).then((res) => fetchData(res));
    else addTag(params).then((res) => fetchData(res));
  };
  const onClose = (item: Props) => {
    if (item.id === formData.value.id) formData.value = { id: '' };
    deleteTag({ id: item.id }).then((res: any) => fetchData(res));
  };
  fetchData();
</script>

<script lang="ts">
  export default {
    name: 'Tag',
  };
</script>

<style lang="less" scoped></style>
