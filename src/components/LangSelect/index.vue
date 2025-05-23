<template>
    <el-dropdown trigger="click" @command="handleLanguageChange">
        <div class="i-svg:language" />
        <template #dropdown>
            <el-dropdown-menu>
                <el-dropdown-item
                    v-for="item in langOptions"
                    :key="item.value"
                    :disabled="appStore.language === item.value"
                    :command="item.value"
                >
                    {{ item.label }}
                </el-dropdown-item>
            </el-dropdown-menu>
        </template>
    </el-dropdown>
</template>
<script setup>
import { useAppStore } from "@/store/modules/app.store";
import { LanguageEnum } from "@/enums/settings/locale.enum";
const appStore = useAppStore();
const { locale, t } = useI18n();
const langOptions = [
    {
        label: "中文",
        value: LanguageEnum.ZH_CN,
    },
    {
        label: "英文",
        value: LanguageEnum.EN,
    },
];
/**
 * 处理语言切换
 *
 * @param lang  语言（zh-cn、en）
 */
function handleLanguageChange(lang) {
    locale.value = lang;
    appStore.changeLanguage(lang);
    ElMessage.success(t("langSelect.message.success"));
}
</script>
