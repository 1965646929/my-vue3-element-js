<template>
    <el-card
        v-show="visible"
        v-hasPerm="[`${searchConfig.pageName}:query`]"
        shadow="never"
        class="mb-2.5"
    >
        <el-form ref="queryFormRef" :model="queryParams" :inline="true">
            <template v-for="(item, index) in formItems" :key="item.prop">
                <el-form-item
                    v-show="isExpand ? true : index < showNumber"
                    :label="item.label"
                    :prop="item.prop"
                >
                    <!-- label -->
                    <template v-if="item.tips" #label>
                        <span class="flex-y-center">
                            {{ item.label }}
                            <el-tooltip v-bind="getTooltipProps(item.tips)">
                                <QuestionFiled class="w-4 h-4 mx-1"></QuestionFiled>
                            </el-tooltip>
                            {{ searchConfig.colon == false ? "" : ":" }}
                        </span>
                    </template>
                    <template v-else #label>
                        {{ item.label }}{{ searchConfig.colon == false ? "" : ":" }}
                    </template>

                    <component
                        :is="componentMap[item?.type ? item?.type : 'input']"
                        v-model.trim="queryParams[item.prop]"
                        v-bind="item.attrs"
                        :config="item.attrs"
                        v-on="item.events || {}"
                    >
                        <template v-if="item.type == 'select'">
                            <template v-for="opt in item.options">
                                <el-option :label="opt.label" :value="opt.value"></el-option>
                            </template>
                        </template>
                    </component>
                </el-form-item>
            </template>
            <el-form-item>
                <el-button icon="search" type="primary" @click="handleQuery">搜索</el-button>
                <el-button icon="refresh" @click="handleReset">重置</el-button>
            </el-form-item>
        </el-form>
    </el-card>
</template>
<script setup>
import { ElInput, ElInputNumber, ElInputTag, ElSelect, ElCascader } from "element-plus";
import { ElTimePicker, ElTimeSelect, ElOption, ElDatePicker, ElTreeSelect } from "element-plus";
import InputTag from "@/components/InputTag/index.vue";

const props = defineProps({
    searchConfig: {
        type: Object,
        required: true,
    },
});
const componentMap = {
    input: markRaw(ElInput),
    select: markRaw(ElSelect),
    cascader: markRaw(ElCascader),
    "input-number": markRaw(ElInputNumber),
    "date-picker": markRaw(ElDatePicker),
    "time-picker": markRaw(ElTimePicker),
    "time-select": markRaw(ElTimeSelect),
    "tree-select": markRaw(ElTreeSelect),
    "input-tag": markRaw(ElInputTag),
    "custom-tag": markRaw(InputTag),
};
const queryFormRef = ref();
const visible = ref(true);
const queryParams = reactive({});
const formItems = reactive(props.searchConfig.formItems);
//是否可展开收缩
const isExpandable = ref(props.searchConfig.isExpandable ?? true);
//是否已展开
const isExpand = ref(false);
//表单项展示数量，若可展开，超出展示数量的表单项隐藏
const showNumber = computed(() => {
    isExpandable.value ? props.searchConfig.showNumber ?? 3 : formItems.length;
});
//获取tooltip的属性
const getTooltipProps = tips => {
    return typeof tips == "string" ? { content: tips } : tips;
};
//自定义事件
const emit = defineEmits(["queryClick", "resetClick"]);
//查询、重置操作
const handleQuery = () => emit("queryClick", queryParams);
const handleReset = () => {
    queryFormRef.value?.resetFields();
    emit("resetClick", queryParams);
};
//暴露的属性和方法
defineExpose({
    getQueryParams: () => queryParams,
    toggleVisible: () => (visible.value = !visible.value),
});
onMounted(() => {
    formItems.map(item => {
        item.initFn && item.initFn(item);
        if (item.type == "input-tag" || item.type == "custom-tag") {
            queryParams[item.prop] = item.initialValue ?? [];
        } else if (item.type == "input-number") {
            queryParams[item.prop] = item.initialValue ?? null;
        } else {
            queryParams[item.prop] = item.initialValue ?? "";
        }
    });
});
</script>
<style lang="scss" scoped>
:deep(.el-input-number .el-input__inner) {
    text-align: left;
}
.el-form {
    display: flex;
    flex-wrap: wrap;
    row-gap: 1rem;
    column-gap: 2rem;
}
.el-form-item {
    margin-right: 0;
    margin-bottom: 0;
}
</style>
