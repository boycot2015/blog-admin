<template>
  <div
    id="wangeditor"
    ref="editorElem"
    :class="(cls || '') + ' wangEditors'"
    style="text-align: left"
  >
  </div>
</template>

<script lang="ts" setup>
  import E from 'wangeditor';
  import { onMounted, ref, watch } from 'vue';

  interface Props {
    catchData: (args: any) => void;
    content: string;
    cls?: string;
    isBlind?: boolean;
    uploadUrl?: string;
    disabled?: boolean;
  }
  const props = defineProps<Props>();
  const editorElem: any = ref();
  let editor: any = null;
  watch(props, (val: any) => {
    editor.txt.html(val.content);
  });
  onMounted(() => {
    editor = new E(editorElem.value);
    // 此处解决光标始终置于尾部问题，需要再使用富文本的页面，再保存的时间上加上一个setTimeout
    editor.config.onchange = (html: string) => {
      if (props.catchData) props.catchData(html); // 把这个html通过catchData的方法传入父组件
    };
    // 配置 server 接口地址
    editor.config.uploadFileName = 'file';
    // editor.config.uploadImgServer = this.upimgurl + '/yzh/file/upload'
    editor.config.height = 500;
    // editor.config.zIndex = 100
    if (props.isBlind) {
      editor.config.menus = [];
    } else {
      editor.config.menus = [
        // 菜单配置
        'head', // 标题
        'bold', // 粗体
        'fontSize', // 字号
        'fontName', // 字体
        'italic', // 斜体
        'underline', // 下划线
        'strikeThrough', // 删除线
        'foreColor', // 文字颜色
        'backColor', // 背景颜色
        'link', // 插入链接
        'list', // 列表
        'justify', // 对齐方式
        'quote', // 引用
        'emoticon', // 表情
        'image', // 插入图片
        'table', // 表格
        'code', // 插入代码
        'undo', // 撤销
        'redo', // 重复
      ];
    }
    editor.create(); // 创建富文本实例
    if (!props.content) {
      editor.txt.html('');
    } else {
      editor.txt.html(props.content);
    }
    if (props.disabled) {
      editor.disable();
    }
  });
  //   export default {
  //     name: 'Editor',
  //     // eslint-disable-next-line vue/require-prop-types
  //     props: ['catchData', 'content', 'cls', 'isBlind', 'uploadUrl', 'disabled'],
  //     data() {
  //       return {
  //         editor: null,
  //         editorContent: '',
  //         imgUrl: '',
  //       };
  //     }, // 接收父组件的方法
  //     watch: {
  //       content() {
  //         if (this.content !== this.editor.txt.html()) {
  //           this.editor.txt.html(this.content);
  //         }
  //       },
  //     },
  //     mounted() {
  //       this.editor = new E(this.$refs.editorElem);
  //       // 此处解决光标始终置于尾部问题，需要再使用富文本的页面，再保存的时间上加上一个setTimeout
  //       this.editor.config.onchange = (html) => {
  //         this.editorContent = html;
  //         if (this.catchData) this.catchData(this.editorContent); // 把这个html通过catchData的方法传入父组件
  //       };
  //       // 配置 server 接口地址
  //       this.editor.config.uploadFileName = 'file';
  //       // this.editor.config.uploadImgServer = this.upimgurl + '/yzh/file/upload'
  //       this.editor.config.height = 500;
  //       // this.editor.config.zIndex = 100
  //       if (this.isBlind) {
  //         this.editor.config.menus = [];
  //       } else {
  //         this.editor.config.menus = [
  //           // 菜单配置
  //           'head', // 标题
  //           'bold', // 粗体
  //           'fontSize', // 字号
  //           'fontName', // 字体
  //           'italic', // 斜体
  //           'underline', // 下划线
  //           'strikeThrough', // 删除线
  //           'foreColor', // 文字颜色
  //           'backColor', // 背景颜色
  //           'link', // 插入链接
  //           'list', // 列表
  //           'justify', // 对齐方式
  //           'quote', // 引用
  //           'emoticon', // 表情
  //           'image', // 插入图片
  //           'table', // 表格
  //           'code', // 插入代码
  //           'undo', // 撤销
  //           'redo', // 重复
  //         ];
  //       }
  //       this.editor.create(); // 创建富文本实例
  //       if (!this.content) {
  //         this.editor.txt.html('');
  //       } else {
  //         this.editor.txt.html(this.content);
  //       }
  //       if (this.disabled) {
  //         this.editor.disable();
  //       }
  //     },
  //     methods: {},
  //   };
</script>

<style lang="less" scoped rel="stylesheet/less">
  :deep(.w-e-text),
  #wangeditor {
    height: 100%;
    min-height: 100%;
    z-index: 0;
  }
  .w-e-text {
    overflow-y: auto;
  }
  :deep(.w-e-text-container) {
    height: 85% !important;
    min-height: 85% !important;
  }
</style>
