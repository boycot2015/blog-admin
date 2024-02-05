<template>
    <a-input-number
        v-if="type === 'number'"
        :style="{ width: '80px' }"
        size="small"
        :default-value="(defaultValue as number)"
        @change="handleChange"
    />
    <pick-colors
        v-else-if="type === 'color-picker'"
        :value="(defaultValue as string)"
        format="hex"
        :style="{ cursor: 'pointer' }"
        @change="handleChange"
    />
    <a-switch
        v-else
        :default-checked="(defaultValue as boolean)"
        size="small"
        @change="handleChange"
    />
</template>

<script lang="ts" setup>
    import PickColors from 'vue-pick-colors';

    const props = defineProps({
        type: {
            type: String,
            default: '',
        },
        name: {
            type: String,
            default: '',
        },
        defaultValue: {
            type: [String, Boolean, Number],
            default: '',
        },
    });
    const emit = defineEmits(['inputChange']);
    const handleChange = (value: unknown) => {
        emit('inputChange', {
            value,
            key: props.name,
        });
    };
</script>
