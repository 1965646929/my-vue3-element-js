// 辅助函数：将十六进制颜色转换为 RGB
function hexToRgb(hex) {
    const bigint = parseInt(hex.slice(1), 16);
    return [(bigint >> 16) & 255, (bigint >> 8) & 255, bigint & 255];
}

// 辅助函数：将 RGB 转换为十六进制颜色
function rgbToHex(r, g, b) {
    return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
}

/**
 * 加深颜色值
 * @param {String} color 颜色值字符串
 * @param {Number} level 加深的程度，限0-1之间
 * @returns {String} 返回处理后的颜色值
 */
export function getDarkColor(color, level) {
    const rgb = hexToRgb(color);
    for (let i = 0; i < 3; i++) rgb[i] = Math.round(20.5 * level + rgb[i] * (1 - level));
    return rgbToHex(rgb[0], rgb[1], rgb[2]);
}

/**
 * 变浅颜色值
 * @param {String} color 颜色值字符串
 * @param {Number} level 加深的程度，限0-1之间
 * @returns {String} 返回处理后的颜色值
 */
export const getLightColor = (color, level) => {
    const rgb = hexToRgb(color);
    for (let i = 0; i < 3; i++) rgb[i] = Math.round(255 * level + rgb[i] * (1 - level));
    return rgbToHex(rgb[0], rgb[1], rgb[2]);
};

/**
 * 生成主题色
 * @param primary 主题色
 * @param theme 主题类型
 */
export function generateThemeColors(primary, theme) {
    const colors = {
        primary,
    };

    // 生成浅色变体
    for (let i = 1; i <= 9; i++) {
        const primaryColor =
            theme === "light"
                ? `${getLightColor(primary, i / 10)}`
                : `${getDarkColor(primary, i / 10)}`;
        colors[`primary-light-${i}`] = primaryColor;
    }

    // 生成深色变体
    colors["primary-dark-2"] =
        theme === "light" ? `${getLightColor(primary, 0.2)}` : `${getDarkColor(primary, 0.3)}`;

    return colors;
}

export function applyTheme(colors) {
    const el = document.documentElement;

    Object.entries(colors).forEach(([key, value]) => {
        el.style.setProperty(`--el-color-${key}`, value);
    });
}

/**
 * 切换暗黑模式
 *
 * @param isDark 是否启用暗黑模式
 */
export function toggleDarkMode(isDark) {
    if (isDark) {
        document.documentElement.classList.add("dark");
    } else {
        document.documentElement.classList.remove("dark");
    }
}

/**
 * 切换浅色主题下的侧边栏颜色方案
 *
 * @param isBlue 布尔值，表示是否开启深蓝色侧边栏颜色方案
 */
export function toggleSidebarColor(isBuleSidebar) {
    if (isBuleSidebar) {
        document.documentElement.classList.add("sidebar-color-blue");
    } else {
        document.documentElement.classList.remove("sidebar-color-blue");
    }
}
