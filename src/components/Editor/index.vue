<template>
    <!-- <div
        id="wangeditor"
        ref="editorElem"
        :class="(cls || '') + ' wangEditors'"
        style="text-align: left"
    >
    </div> -->
    <div :class="props.cls">
        <MdEditor v-if="!props.disabled" v-model="text" />
        <template v-else>
            <MdPreview :editor-id="id" :model-value="text" />
            <MdCatalog :editor-id="id" :scroll-element="scrollElement" />
        </template>
    </div>
</template>

<script lang="ts" setup>
    import { ref, watch } from 'vue';
    import { MdEditor, MdPreview, MdCatalog } from 'md-editor-v3';
    import 'md-editor-v3/lib/style.css';
    import 'md-editor-v3/lib/preview.css';

    interface Props {
        modelValue: string;
        cls?: string;
        isBlind?: boolean;
        uploadUrl?: string;
        disabled?: boolean;
    }
    const emit = defineEmits(['update:modelValue']);
    const props = defineProps<Props>();
    const text = ref(props.modelValue || '');
    const id = 'preview-only';
    watch(props, (val) => {
        text.value = val.modelValue;
    });
    watch(text, () => {
        emit('update:modelValue', text.value);
    });
    const scrollElement = document.documentElement;
</script>

<style lang="less">
    svg.md-editor-icon {
        width: 22px !important;
        height: 22px !important;
    }
</style>
<!-- <script lang="ts" setup>
    import E from 'wangeditor';
    import 'prismjs/themes/prism.min.css';
    import { onMounted, ref, watch } from 'vue';
    import Prism from 'prismjs'; // 导入代码高亮插件的core（里面提供了其他官方插件及代码高亮样式主题，你只需要引入即可）
    // 引入代码高亮主题（这个去node_modules的安装prismjs中找到想使用的主题即可）
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
    const replaceStyle = (str: string) => {
        return str
            .replace('class="JavaScript"', 'class="language-js"')
            .replace('class="Bash"', 'class="language-bash"');
    };
    watch(props, (val: any) => {
        editor.txt.html(replaceStyle(val.content));
        Prism.highlightAll();
    });
    onMounted(async () => {
        editor = new E(editorElem.value);
        // 此处解决光标始终置于尾部问题，需要再使用富文本的页面，再保存的时间上加上一个setTimeout
        editor.config.onchange = async (html: string) => {
            if (props.catchData) {
                await props.catchData(replaceStyle(html));
                // Prism.highlightAll();
            } // 把这个html通过catchData的方法传入父组件
        };
        // 配置 server 接口地址
        editor.config.uploadFileName = 'file';
        // editor.config.uploadImgServer = this.upimgurl + '/yzh/file/upload'
        // editor.config.height = 500;
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
            await editor.txt.html(replaceStyle(props.content));
            Prism.highlightAll();
        }
        if (props.disabled) {
            editor.disable();
        }
    });
</script> -->

<!-- <style lang="less" scoped rel="stylesheet/less">
    :deep(.w-e-text),
    #wangeditor {
        height: 100% !important;
        min-height: 200px !important;
        z-index: 0;
    }
    .w-e-text {
        overflow-y: auto;
        code {
            background: none !important;
        }
    }
    .wangEditors {
        :deep(.w-e-toolbar),
        :deep(.w-e-text-container),
        :deep(.w-e-menu-panel) {
            background-color: var(--color-fill-2) !important;
        }
    }
    :deep(.w-e-text-container) {
        height: 85% !important;
        min-height: 85% !important;
    }
</style> -->
