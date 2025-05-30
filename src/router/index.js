import { createRouter, createWebHashHistory } from "vue-router";
export const Layout = () => import("@/layout/index.vue");
export const constantRoutes = [
    {
        path: "/direct",
        component: Layout,
        meta: { hidden: true },
        children: [
            {
                path: "/direct/:path(.*)",
                component: () => import("@/views/redirect/index.vue"),
            },
        ],
    },
    {
        path: "/login",
        component: () => import("@/views/login/index.vue"),
        meta: { hidden: true },
    },
    {
        path: "/",
        name: "/",
        component: Layout,
        redirect: "/dashboard",
        children: [
            {
                path: "dashboard",
                name: "Dashboard",
                component: () => import("@/views/dashboard/index.vue"),
                meta: {
                    //这里的title为什么写成英文
                    title: "dashboard",
                    icon: "homepage",
                    affix: true,
                    keepAlive: true,
                },
            },
            {
                path: "401",
                component: () => import("@/views/error/401.vue"),
                meta: { hidden: true },
            },
            {
                path: "404",
                component: () => import("@/views/error/404.vue"),
                meta: { hidden: true },
            },
        ],
    },
];
const router = createRouter({
    history: createWebHashHistory(),
    routes: constantRoutes,
    //刷新时滚动条位置还原
    scrollBehavior: () => ({ left: 0, top: 0 }),
});
// 全局注册 router
export function setupRouter(app) {
    app.use(router);
}

export default router;
