<template>
    <div ref="chartRef" :style="{ width, height }"></div>
</template>
<script setup>
//引入echarts核心模块，核心模块提供了echarts使用必须要的接口
import * as echarts from "echarts/core";
import { BarChart, LineChart, PieChart } from "echarts/charts";
import { GridComponent, TooltipComponent, LegendComponent } from "echarts/components";
// 引入 Canvas 渲染器，注意引入 CanvasRenderer 或者 SVGRenderer 是必须的一步
import { CanvasRenderer } from "echarts/renderers";
import { useResizeObserver } from "@vueuse/core";

//按需注册组件
echarts.use([
    CanvasRenderer,
    BarChart,
    LineChart,
    PieChart,
    GridComponent,
    TooltipComponent,
    LegendComponent,
]);
const props = defineProps({
    options: {
        type: Object,
        required: true,
    },
    width: {
        type: String,
        default: "100%",
    },
    height: {
        type: String,
        default: "300px",
    },
});
const chartRef = ref(null);
let chartInstance = null;
const initChart = () => {
    if (chartRef.value) {
        chartInstance = echarts.init(chartRef.value);
        if (props.options) {
            chartInstance.setOption(props.options);
        }
    }
};

//监听尺寸变化，自动调整
useResizeObserver(chartRef, () => {
    chartInstance?.resize();
});

//监听options变化，更新图表
watch(
    () => props.options,
    newOptions => {
        if (chartInstance && newOptions) {
            chartInstance.setOption(newOptions);
        }
    },
    {
        deep: true,
    }
);

onMounted(() => {
    nextTick(() => initChart());
});
onBeforeUnmount(() => {
    chartInstance?.dispose();
});
</script>
<style lang="scss" scoped></style>
