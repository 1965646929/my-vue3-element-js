<template>
    <div class="login wh-full flex-center relative">
        <!-- 登录的头部 -->
        <div class="flex-x-end absolute top-0 p-4 w-full">
            <el-switch
                v-model="isDark"
                inline-prompt
                active-icon="Moon"
                inactive-icon="Sunny"
                @change="toggleTheme"
            >
            </el-switch>
            <LangSelect class="ml-2 cursor-pointer" />
        </div>
        <!-- 登录内容区 -->
        <div
            class="w-full m-5 p-5 sm:p-10 min-w-[335px] max-w-[460px] shadow-[var(--el-box-shadow-light)]"
            :class="[isDark ? 'bg-transparent' : 'bg-white']"
        >
            <div class="flex-center relative pb-5">
                <h2>{{ defaultSettings.title }}</h2>
                <el-dropdown class="absolute! right-0">
                    <div class="cursor-pointer">
                        <el-icon><arrow-down /></el-icon>
                    </div>
                    <template #dropdown>
                        <el-dropdown-menu>
                            <el-dropdown-item>
                                <el-tag>{{ defaultSettings.version }}</el-tag>
                            </el-dropdown-item>
                            <el-dropdown-item @click="setLoginCredentials('root', '123456')">
                                超级管理员: root/123456
                            </el-dropdown-item>
                            <el-dropdown-item @click="setLoginCredentials('admin', '123456')">
                                系统管理员: admin/123456
                            </el-dropdown-item>
                            <el-dropdown-item @click="setLoginCredentials('test', '123456')">
                                测试小游客: test/123456
                            </el-dropdown-item>
                        </el-dropdown-menu>
                    </template>
                </el-dropdown>
            </div>
            <el-form ref="loginFormRef" :model="loginFormData" :rules="loginRules" size="large">
                <!-- 用户名 -->
                <el-form-item prop="username">
                    <el-input
                        v-model.trim="loginFormData.username"
                        :placeholder="t('login.username')"
                    >
                        <template #prefix>
                            <el-icon :color="isDark ? 'white' : 'black'"><User /></el-icon>
                        </template>
                    </el-input>
                </el-form-item>

                <!-- 密码 -->
                <el-tooltip :visible="isCapsLock" :content="t('login.capsLock')" placement="right">
                    <el-form-item prop="password">
                        <el-input
                            v-model.trim="loginFormData.password"
                            :placeholder="t('login.password')"
                            type="password"
                            show-password
                            @keyup="checkCapsLock"
                            @keyup.enter="handleLoginSubmit"
                        >
                            <template #prefix>
                                <el-icon :color="isDark ? 'white' : 'black'"><Lock /></el-icon>
                            </template>
                        </el-input>
                    </el-form-item>
                </el-tooltip>

                <!-- 验证码 -->
                <el-form-item prop="captchaCode">
                    <el-input
                        v-model.trim="loginFormData.captchaCode"
                        :placeholder="t('login.captchaCode')"
                        @keyup.enter="handleLoginSubmit"
                    >
                        <template #prefix>
                            <div :class="['i-svg:captcha', isDark ? 'text-white' : 'text-black']" />
                        </template>
                        <template #suffix>
                            <el-image
                                :src="captchaBase64"
                                class="w-[138px] cursor-pointer"
                                @click="getCaptcha"
                            />
                        </template>
                    </el-input>
                </el-form-item>
                <!-- 登录底部 -->
                <!-- 记住我/忘记密码 -->
                <div class="w-full flex-x-between">
                    <el-checkbox v-model="loginFormData.rememberMe">{{
                        t("login.rememberMe")
                    }}</el-checkbox>
                    <el-link type="primary" @click="unfinished">{{
                        t("login.forgetPassword")
                    }}</el-link>
                </div>
                <!-- 登录按钮 -->
                <el-button
                    :loading="loading"
                    type="primary"
                    class="w-full"
                    @click="handleLoginSubmit"
                >
                    {{ t("login.login") }}
                </el-button>
                <!-- 第三方登录 -->
                <el-divider>
                    <el-text size="small">{{ t("login.otherLoginMethods") }}</el-text>
                </el-divider>
                <div class="flex-center gap-x-5 text-[var(--el-text-color-secondary)]">
                    <div class="i-svg:wechat" />
                    <div class="i-svg:qq" />
                    <div class="i-svg:github" />
                    <div class="i-svg:gitee" />
                </div>
            </el-form>
        </div>
    </div>
</template>
<script setup>
import { useRoute } from "vue-router";
import { ThemeMode } from "@/enums/settings/theme.enum";
import { useSettingsStore, useUserStore } from "@/store";
import defaultSettings from "@/settings";
import AuthAPI from "@/api/auth.api";
import router from "@/router";

const { t } = useI18n();
const settingStore = useSettingsStore();
const userStore = useUserStore();
const isDark = ref(settingStore.theme == ThemeMode.DARK);
const route = useRoute();
const isCapsLock = ref(false); //是否大写锁定
const captchaBase64 = ref(); // 验证码图片Base64字符串
const loading = ref(false);
const loginFormRef = ref();
const loginFormData = ref({
    username: "admin",
    password: "123456",
    captchaKey: "",
    captchaCode: "",
    rememberMe: false,
});
const loginRules = computed(() => {
    return {
        username: [
            {
                required: true,
                trigger: "change",
                message: t("login.message.username.required"),
            },
        ],
        password: [
            {
                required: true,
                trigger: "change",
                message: t("login.message.password.required"),
            },
            {
                min: 6,
                message: t("login.message.password.min"),
                trigger: "blur",
            },
        ],
        captchaCode: [
            {
                required: true,
                trigger: "change",
                message: t("login.message.captchaCode.required"),
            },
        ],
    };
});

//主题切换
const toggleTheme = () => {
    const newTheme = settingStore.theme == ThemeMode.DARK ? ThemeMode.LIGHT : ThemeMode.DARK;
    return settingStore.changeTheme(newTheme);
};

//设置登录凭证
function setLoginCredentials(username, password) {
    loginFormData.value.username = username;
    loginFormData.value.password = password;
}
//获取验证码
function getCaptcha() {
    AuthAPI.getCaptcha().then(data => {
        loginFormData.value.captchaKey = data.captchaKey;
        captchaBase64.value = data.captchaBase64;
    });
}

//登录提交
async function handleLoginSubmit() {
    try {
        //1.表单验证
        const valid = await loginFormRef.value?.validate();
        console.log("form", loginFormRef);
        if (!valid) return;
        //2.执行登录
        console.log("loginFormData", loginFormData);
        await userStore.login(loginFormData.value);
        //3.获取用户信息
        await userStore.getUserInfo();
        // 4. 解析并跳转目标地址
        const redirect = resolveRedirectTarget(route.query);
        await router.push(redirect);
    } catch (error) {
        // 5. 统一错误处理
        getCaptcha(); // 刷新验证码
        console.log("登录失败", error);
    } finally {
        loading.value = false;
    }
}

/**
 * 解析重定向目标
 * @param query 路由查询参数
 * @returns 标准化后的路由地址对象
 */
function resolveRedirectTarget(query) {
    // 默认跳转路径
    const defaultPath = "/";

    // 获取原始重定向路径
    const rawRedirect = query.redirect || defaultPath;

    try {
        // 6. 使用Vue Router解析路径
        const resolved = router.resolve(rawRedirect);
        return {
            path: resolved.path,
            query: resolved.query,
        };
    } catch {
        // 7. 异常处理：返回安全路径
        return { path: defaultPath };
    }
}

//忘记密码
function unfinished() {
    ElMessage.warning("功能开发中，敬请期待！");
}
// 初始化验证码
getCaptcha();
</script>
<style lang="scss" scoped>
.login {
    background: url("@/assets/images/login-bg.jpg") no-repeat center right;
}
</style>
