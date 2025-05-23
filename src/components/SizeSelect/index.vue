<template>
    <el-tooltip :content="$t('sizeSelect.tooltip')" effect="dark" placement="bottom">
        <el-dropdown trigger="click" @command="handleSizeChange">
            <div>
                <div class="i-svg:size"></div>
            </div>
            <template #dropdown>
                <el-dropdown-menu>
                    <el-dropdown-item
                        v-for="(item, index) in sizeOptions"
                        :key="item.value"
                        :command="item.value"
                        :disabled="appStore.size == item.value"
                    >
                        {{ item.label }}
                    </el-dropdown-item>
                </el-dropdown-menu>
            </template>
        </el-dropdown>
    </el-tooltip>
</template>
<script setup>
const { t } = useI18n();
import { ComponentSize } from "@/enums/settings/layout.enum";
import { useAppStore } from "@/store/modules/app.store";
const appStore = useAppStore();

const sizeOptions = computed(() => {
    return [
        { label: t("sizeSelect.default"), value: ComponentSize.DEFAULT },
        { label: t("sizeSelect.large"), value: ComponentSize.LARGE },
        { label: t("sizeSelect.small"), value: ComponentSize.SMALL },
    ];
});

function handleSizeChange(size) {
    appStore.changeSize(size);
    ElMessage.success(t("sizeSelect.message.success"));
}
</script>
<style lang="scss" scoped></style>
