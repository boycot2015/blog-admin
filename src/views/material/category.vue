<template>
  <a-spin :style="{ display: 'flex', minWidth: '1200px' }" :loading="loading">
    <a-card :style="{ flex: 1 }">
      <a-space wrap>
        <a-tag
          v-for="item of data"
          :key="item.id"
          checkable
          :color="item.color"
          :closable="item.closable"
          @close.prevent
          @check="() => onTagChecked(item)"
        >
          {{ item.title }}
          <template #close-icon>
            <a-popconfirm
              v-if="item.closable"
              content="确定删除?"
              @ok="onClose(item)"
            >
              <icon-close @click.stop />
            </a-popconfirm>
          </template>
          <!-- {{ item.count ? `(${item.count})` : '' }} -->
        </a-tag>
      </a-space>
      <p>{{ parents.map((el) => el.title).join(' > ') }}</p>
      <a-space style="margin-top: 10px">
        <a-input
          v-model="formData.title"
          style="width: 400px"
          placeholder="请选择或输入分类"
        ></a-input>
        <a-button
          type="primary"
          :disabled="!formData.title"
          @click="
            editCategory({
              id: formData.id,
              value: formData.title,
              parentId: formData.pid,
            }).then((res) => fetchData(res))
          "
          >保存</a-button
        >
        <a-button
          type="outline"
          :disabled="!formData.title"
          @click="
            addCategory({
              value: formData.title,
              parentId: formData.pid,
            }).then((res) => fetchData(res))
          "
          >+节点</a-button
        >
        <a-button
          :disabled="!formData.title"
          @click="
            addCategory({
              value: formData.title,
              parentId: formData.id,
            }).then((res) => fetchData(res))
          "
          >+子集</a-button
        >
      </a-space>
    </a-card>
    <a-card :style="{ flex: 1 }">
      <a-tree
        v-model:selected-keys="selectedKeys"
        v-model:expanded-keys="expandedKeys"
        show-line
        :data="treeData"
        draggable
        @select="(selectedKeys: any, { selected, selectedNodes }:any) => onTagChecked(selectedNodes[0], selected)"
        @drop="(data:any) => dropData(data)"
      >
        <template #extra="nodeData">
          <IconPlus
            style="color: rgb(var(--green-6)); font-size: 12px"
            @click="() => onAdd(nodeData)"
          />
          <a-popconfirm content="确定删除?" @ok="onClose(nodeData)">
            <icon-delete
              v-if="nodeData.closable"
              style="
                font-size: 12px;
                margin-left: 10px;
                color: rgb(var(--danger-6));
              "
            />
          </a-popconfirm>
        </template>
      </a-tree>
    </a-card>
  </a-spin>
</template>

<script lang="ts" setup>
  import { reactive, ref } from 'vue';
  import { convertArrayToTree, getAllChild } from '@/utils';
  import { useAppStore } from '@/store';
  import {
    queryCategory,
    addCategory,
    editCategory,
    deleteCategory,
  } from '@/api/category';
  import { Message } from '@arco-design/web-vue';
  import useLoading from '@/hooks/loading';

  type treeProp = {
    title?: string;
    pid?: string;
    id: string;
    color?: string;
    count?: string | number;
    closable?: boolean;
    children?: treeProp[];
  };
  const { loading, setLoading } = useLoading();
  const treeData = ref<treeProp[]>([]);
  const data = ref<treeProp[]>([]);
  const parents = ref<treeProp[]>([]);
  const selectedKeys = ref<string[]>([]);
  const expandedKeys = ref<string[]>([]);
  const formData = ref<treeProp>({
    id: '',
    title: '',
  });
  const colors: any = reactive(useAppStore().colors as any);
  const fetchData = (params?: any) => {
    setLoading(true);

    queryCategory({}).then((res: any) => {
      data.value = res.data.map((el: any) => ({
        title: el.value,
        pid: el.parentId,
        id: el.id,
        count: el.articleNum,
        color: colors[Math.floor(Math.random() * colors.length)],
        key: el.id,
      }));
      treeData.value = convertArrayToTree([...data.value], {
        pid: 'pid',
        id: 'id',
        children: 'children',
      });
      const childs = getAllChild(treeData.value);
      data.value = childs.map((el: any) => {
        let temp = getAllChild([el]);
        temp = [...temp.slice(1, temp.length)];
        el.count = temp.length
          ? temp.reduce((p: any, n: any) => p + n.count, el.count)
          : el.count;
        el.closable = !el.count;
        const obj = { ...el };
        delete obj.children;
        return obj;
      });
      if (params)
        Message[params.success ? 'success' : 'error'](
          params.data || params.message
        );
      else {
        expandedKeys.value = treeData.value.map((el) => el.id).slice(0, 2);
      }
      setLoading(false);
    });
  };
  const getParents = (item: treeProp, arr: treeProp[]) => {
    const temp = data.value.filter((el) => el.id === item.pid)[0];
    if (temp && temp.pid) {
      getParents(temp, arr);
    }
    if (temp) arr.push(temp);
    return arr;
  };
  const onTagChecked = (item: treeProp, selected?: boolean) => {
    formData.value.id = item.id;
    formData.value.pid = item.pid;
    formData.value.title = item.title;
    parents.value = getParents(item, []);
    if (!selected) {
      expandedKeys.value = parents.value.map((el) => el.id);
      selectedKeys.value = [item.id];
    }
  };
  const dropData = async ({ dragNode, dropNode, dropPosition }: any) => {
    formData.value.id = dragNode.id;
    formData.value.pid = dropNode.pid;
    formData.value.title = dragNode.title;
    const tree = treeData.value;
    const res: any = await editCategory({
      id: dragNode.id,
      parentId: dropNode.pid,
    });
    if (!res.success) return;
    const loop = (arr: any, key: any, callback: any) => {
      arr.some((item: any, index: number, temp: any) => {
        if (item.key === key) {
          callback(item, index, temp);
          return true;
        }
        if (item.children) {
          return loop(item.children, key, callback);
        }
        return false;
      });
    };

    loop(tree, dragNode.key, (_: any, index: number, arr: any) => {
      arr.splice(index, 1);
    });

    if (dropPosition === 0) {
      loop(data, dropNode.key, (item: any) => {
        item.children = item.children || [];
        item.children.push(dragNode);
      });
    } else {
      loop(tree, dropNode.key, (_: any, index: number, arr: any) => {
        arr.splice(dropPosition < 0 ? index : index + 1, 0, dragNode);
      });
    }
    fetchData(res);
  };
  const onAdd = async (nodeData: any) => {
    const children = nodeData.children || [];
    await addCategory({
      value: `new category${children.length + 1}`,
      parentId: nodeData.id,
    }).then((res) => fetchData(res));
  };
  const onClose = (item: treeProp) => {
    if (item.id === formData.value.id) formData.value = { id: '' };
    deleteCategory({ id: item.id }).then((res: any) => fetchData(res));
  };
  fetchData();
</script>

<script lang="ts">
  export default {
    name: 'Category',
  };
</script>

<style lang="less" scoped></style>
