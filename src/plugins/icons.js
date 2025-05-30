import * as ElementPlusIconsVue from "@element-plus/icons-vue";

// 注册所有图标
export function setupElIcons(app) {
    for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
        app.component(key, component);
    }
}
