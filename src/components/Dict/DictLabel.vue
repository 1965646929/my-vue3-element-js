<template>
    <template v-if="tagType">
        <el-tag :type="tagType" :size="tagSize">{{ label }}</el-tag>
    </template>
    <template v-else>
        <span>{{ label }}</span>
    </template>
</template>

<script setup>
import { useDictStore } from "@/store";

const props = defineProps({
    code: String, // 字典编码
    modelValue: [String, Number], // 字典项的值
    size: {
        type: String,
        default: "default", // 标签大小
    },
});
const label = ref("");
const tagType = ref(); // 标签类型
const tagSize = ref(); // 标签大小

const dictStore = useDictStore();
/**
 * 根据字典项的值获取对应的 label 和 tagType
 * @param dictCode 字典编码
 * @param value 字典项的值
 * @returns 包含 label 和 tagType 的对象
 */
const getLabelAndTagByValue = async (dictCode, value) => {
    // 按需加载字典数据
    await dictStore.loadDictItems(dictCode);
    // 从缓存中获取字典数据
    const dictItems = dictStore.getDictItems(dictCode);
    // 查找对应的字典项
    const dictItem = dictItems.find(item => item.value == value);
    return {
        label: dictItem?.label || "",
        tagType: dictItem?.tagType,
    };
};
/**
 * 更新 label 和 tagType
 */
const updateLabelAndTag = async () => {
    if (!props.code || props.modelValue === undefined) return;
    const { label: newLabel, tagType: newTagType } = await getLabelAndTagByValue(
        props.code,
        props.modelValue
    );
    label.value = newLabel;
    tagType.value = newTagType;
};

watch([() => props.code, () => props.modelValue], updateLabelAndTag);

onMounted(updateLabelAndTag);
</script>
