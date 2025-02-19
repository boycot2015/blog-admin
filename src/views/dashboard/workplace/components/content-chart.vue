<template>
    <a-spin :loading="loading" style="width: 100%">
        <a-card
            class="general-card"
            :header-style="{ paddingBottom: 0 }"
            :body-style="{
                paddingTop: '20px',
            }"
            :title="$t('workplace.contentData')"
        >
            <template #extra>
                <!-- <a-link>{{ $t('workplace.viewMore') }}</a-link> -->
            </template>
            <Chart height="289px" :option="chartOption" />
        </a-card>
    </a-spin>
</template>

<script lang="ts" setup>
    import { ref } from 'vue';
    import { graphic } from 'echarts';
    import useLoading from '@/hooks/loading';
    import { queryStaticsData } from '@/api/dashboard';
    import useChartOption from '@/hooks/chart-option';
    import { ToolTipFormatterParams } from '@/types/echarts';
    import { AnyObject } from '@/types/global';

    function graphicFactory(side: AnyObject) {
        return {
            type: 'text',
            bottom: '8',
            ...side,
            style: {
                text: '',
                textAlign: 'center',
                fill: '#4E5969',
                fontSize: 12,
            },
        };
    }
    const { loading, setLoading } = useLoading(true);
    const xAxis = ref<string[]>([]);
    const chartsTotalData = ref<number[]>([]);
    const chartsVisitorData = ref<number[]>([]);
    const graphicElements = ref([
        graphicFactory({ left: 0 }),
        graphicFactory({ right: 0 }),
    ]);
    const { chartOption } = useChartOption(() => {
        return {
            grid: {
                left: '5%',
                right: '2%',
                top: '10',
                bottom: '30',
            },
            xAxis: {
                type: 'category',
                offset: 2,
                data: xAxis.value,
                boundaryGap: false,
                axisLabel: {
                    color: '#4E5969',
                    formatter(value: number, idx: number) {
                        if (idx === 0) return '';
                        if (idx === xAxis.value.length - 1) return '';
                        return `${value}`;
                    },
                },
                axisLine: {
                    show: false,
                },
                axisTick: {
                    show: false,
                },
                splitLine: {
                    show: false,
                    interval: (idx: number) => {
                        if (idx === 0) return false;
                        if (idx === xAxis.value.length - 1) return false;
                        return true;
                    },
                    lineStyle: {
                        type: 'dashed',
                        color: '#E5E8EF',
                    },
                },
                axisPointer: {
                    show: true,
                    lineStyle: {
                        color: '#23ADFF',
                        width: 2,
                    },
                },
            },
            yAxis: {
                type: 'value',
                axisLine: {
                    show: false,
                },
                axisTick: {
                    show: false,
                },
                axisLabel: {
                    formatter(value: any, idx: number) {
                        if (idx === 0) return value;
                        return `${value}`;
                    },
                },
                splitLine: {
                    show: true,
                    lineStyle: {
                        type: 'dashed',
                        color: '#E5E8EF',
                    },
                },
            },
            tooltip: {
                trigger: 'axis',
                formatter(params) {
                    const [firstElement, secondElement] =
                        params as ToolTipFormatterParams[];
                    return `<div>
            <p class="tooltip-title">${firstElement.axisValueLabel}</p>
            <div class="content-panel"><span style="color:rgba(255, 66, 251, 1);">——</span><span>发布数量</span><span class="tooltip-value">${Number(
                firstElement.value
            ).toLocaleString()}</span></div>
            <div class="content-panel"><span style="color:rgba(111, 66, 251, 1);">——</span><span>浏览数量</span><span class="tooltip-value">${Number(
                secondElement.value
            ).toLocaleString()}</span></div>
          </div>`;
                },
                className: 'echarts-tooltip-diy',
            },
            graphic: {
                elements: graphicElements.value,
            },
            series: [
                {
                    data: chartsTotalData.value,
                    type: 'line',
                    smooth: true,
                    // symbol: 'circle',
                    symbolSize: 12,
                    emphasis: {
                        focus: 'series',
                        itemStyle: {
                            borderWidth: 2,
                        },
                    },
                    lineStyle: {
                        width: 3,
                        color: new graphic.LinearGradient(0, 0, 1, 0, [
                            {
                                offset: 0,
                                color: 'rgba(30, 231, 255, 1)',
                            },
                            {
                                offset: 0.5,
                                color: 'rgba(36, 154, 255, 1)',
                            },
                            {
                                offset: 1,
                                color: 'rgba(255, 66, 251, 1)',
                            },
                        ]),
                    },
                    showSymbol: false,
                    areaStyle: {
                        opacity: 0.8,
                        color: new graphic.LinearGradient(0, 0, 0, 1, [
                            {
                                offset: 0,
                                color: 'rgba(17, 126, 255, 0.16)',
                            },
                            {
                                offset: 1,
                                color: 'rgba(17, 128, 255, 0)',
                            },
                        ]),
                    },
                },
                {
                    data: chartsVisitorData.value,
                    type: 'line',
                    smooth: true,
                    // symbol: 'circle',
                    symbolSize: 12,
                    emphasis: {
                        focus: 'series',
                        itemStyle: {
                            borderWidth: 2,
                        },
                    },
                    lineStyle: {
                        width: 3,
                        color: new graphic.LinearGradient(0, 0, 1, 0, [
                            {
                                offset: 0,
                                color: 'rgba(30, 231, 255, 1)',
                            },
                            {
                                offset: 0.5,
                                color: 'rgba(36, 154, 255, 1)',
                            },
                            {
                                offset: 1,
                                color: 'rgba(111, 66, 251, 1)',
                            },
                        ]),
                    },
                    showSymbol: false,
                    areaStyle: {
                        opacity: 0.8,
                        color: new graphic.LinearGradient(0, 0, 0, 1, [
                            {
                                offset: 0,
                                color: 'rgba(17, 126, 255, 0.16)',
                            },
                            {
                                offset: 1,
                                color: 'rgba(17, 128, 255, 0)',
                            },
                        ]),
                    },
                },
            ],
        };
    });
    const fetchData = async () => {
        setLoading(true);
        try {
            const { data } = (await queryStaticsData()) as any;
            console.log(data, 'chartData');
            // chartsVisitorData
            data.visitorData?.data?.forEach((el: any, idx: number) => {
                xAxis.value.push(el.time);
                chartsVisitorData.value.push(el.value);
                if (idx === 0) {
                    graphicElements.value[0].style.text = el.time;
                }
                if (idx === data.visitorData.data.length - 1) {
                    graphicElements.value[1].style.text = el.time;
                }
            });
            data.publicData?.data?.forEach((el: any, idx: number) => {
                chartsTotalData.value.push(el.value);
                // if (idx === 0) {
                //     graphicElements.value[0].style.text = el.time;
                // }
                if (idx === data.visitorData.data.length - 1) {
                    graphicElements.value[1].style.text = '时间轴';
                }
            });
        } catch (err) {
            // you can report use errorHandler or other
        } finally {
            setLoading(false);
        }
    };
    fetchData();
</script>

<style scoped lang="less"></style>
