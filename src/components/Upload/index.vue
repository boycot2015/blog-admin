<template>
  <a-space direction="vertical" :style="{ width: '100%' }">
    <a-upload
      :custom-request="customRequest"
      :file-list="file ? [file] : [] as any"
      :show-file-list="false"
      :disabled="disabled"
    >
      <template #upload-button>
        <div
          :class="`arco-upload-list-item${
            file && file.status === 'error'
              ? ' arco-upload-list-item-error'
              : ''
          }`"
        >
          <div
            v-if="file && file.url"
            class="arco-upload-list-picture custom-upload-avatar"
          >
            <img :src="file.url" />
            <div class="arco-upload-list-picture-mask">
              <IconEdit />
            </div>
            <a-progress
              v-if="file.status === 'uploading' && file.percent < 100"
              :percent="file.percent"
              type="circle"
              size="mini"
              :style="{
                position: 'absolute',
                left: '50%',
                top: '50%',
                transform: 'translateX(-50%) translateY(-50%)',
              }"
            />
          </div>
          <div v-else class="arco-upload-picture-card">
            <div class="arco-upload-picture-card-text">
              <IconPlus />
              <div style="margin-top: 10px; font-weight: 600">上传头像</div>
            </div>
          </div>
        </div>
      </template>
    </a-upload>
  </a-space>
</template>

<script lang="ts" setup>
  import { IconEdit, IconPlus } from '@arco-design/web-vue/es/icon';
  import { computed } from 'vue';
  import { getToken } from '../../utils/auth';
  import { apiUrl } from '../../api/baseUrl';

  const token = getToken();
  interface Props {
    disabled?: boolean;
    url: string;
    file?: {
      url: string;
      percent: number;
      status: number | string;
    };
    method?: string;
  }
  const props = defineProps<Props>();
  const emits = defineEmits(['change']);
  //   const file = ref(props.file ? { ...props.file } : null);
  const file = computed(() => (props.file ? { ...props.file } : null));
  const customRequest = (option: any) => {
    const { onProgress, onError, onSuccess, fileItem, name } = option;
    const xhr = new XMLHttpRequest();
    if (xhr.upload) {
      xhr.upload.onprogress = function onprogress(event) {
        let percent;
        if (event.total > 0) {
          // 0 ~ 1
          percent = event.loaded / event.total;
        }
        onProgress(percent, event);
      };
    }
    xhr.onerror = function error(e) {
      onError(e);
    };
    xhr.onload = function onload() {
      if (xhr.status < 200 || xhr.status >= 300) {
        return onError(xhr.responseText);
      }
      emits('change', JSON.parse(xhr.response).data);
      if (file.value) file.value.url = JSON.parse(xhr.response).data;
      return onSuccess(xhr.response);
    };

    const formData = new FormData();
    formData.append(name || 'file', fileItem.file);
    xhr.open(props.method || 'post', apiUrl + (props.url || '/upload'), true);
    xhr.setRequestHeader('Authorization', `Bearer ${token}`);

    xhr.send(formData);

    return {
      abort() {
        xhr.abort();
      },
    };
  };
</script>
