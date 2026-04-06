import ReactECharts from 'echarts-for-react';

import useThemeStore from '@/store/useThemeStore';

function StockChart({ chartData, loading }) {
    const theme = useThemeStore((state) => state.theme);

    const getOption = () => {
        if (!chartData) {
            return {};
        }

        const signals = chartData.signals || [];

        const buyPoints = chartData.dates
            .map((date, index) => {
                if (signals[index] !== 1) return null;
                return {
                    name: '买入',
                    value: [date, Number(chartData.closes[index]) * 0.995],
                };
            })
            .filter(Boolean);

        const sellPoints = chartData.dates
            .map((date, index) => {
                if (signals[index] !== -1) return null;
                return {
                    name: '卖出',
                    value: [date, Number(chartData.closes[index]) * 1.005],
                };
            })
            .filter(Boolean);

        return {
            tooltip: {
                trigger: 'axis',
                axisPointer: { type: 'cross' },
            },
            legend: {
                top: 10,
            },
            dataZoom: [
                { type: 'inside', start: 50, end: 100 },
                { type: 'slider', start: 50, end: 100 },
            ],
            xAxis: {
                type: 'category',
                data: chartData.dates,
                boundaryGap: false,
            },
            yAxis: {
                type: 'value',
                scale: true,
                splitLine: {
                    lineStyle: { type: 'dashed', color: '#eee' },
                },
            },
            series: [
                {
                    name: '上证指数',
                    type: 'line',
                    data: chartData.closes,
                    smooth: false,
                    showSymbol: false,
                    itemStyle: { color: '#E91E63' },
                    areaStyle: { color: 'rgba(233, 30, 99, 0.1)' },
                    lineStyle: { width: 2 },
                },
                {
                    name: 'MA5',
                    type: 'line',
                    data: chartData.ma5,
                    smooth: true,
                    showSymbol: false,
                    lineStyle: { width: 2, color: '#FF9800' },
                    itemStyle: { color: '#FF9800' },
                },
                {
                    name: 'MA20',
                    type: 'line',
                    data: chartData.ma20,
                    smooth: true,
                    showSymbol: false,
                    lineStyle: { width: 2, color: '#2196F3' },
                    itemStyle: { color: '#2196F3' },
                },
                {
                    name: '买入点',
                    type: 'scatter',
                    data: buyPoints,
                    symbol: 'triangle',
                    symbolSize: 14,
                    itemStyle: { color: '#16a34a' },
                    label: {
                        show: true,
                        formatter: '买',
                        position: 'bottom',
                        color: '#16a34a',
                        fontWeight: 'bold',
                    },
                    tooltip: {
                        trigger: 'item',
                        formatter(params) {
                            return `买入信号<br/>日期：${params.value[0]}<br/>点位：${chartData.closes[chartData.dates.indexOf(params.value[0])]}`;
                        },
                    },
                },
                {
                    name: '卖出点',
                    type: 'scatter',
                    data: sellPoints,
                    symbol: 'triangle',
                    symbolRotate: 180,
                    symbolSize: 14,
                    itemStyle: { color: '#dc2626' },
                    label: {
                        show: true,
                        formatter: '卖',
                        position: 'top',
                        color: '#dc2626',
                        fontWeight: 'bold',
                    },
                    tooltip: {
                        trigger: 'item',
                        formatter(params) {
                            return `卖出信号<br/>日期：${params.value[0]}<br/>点位：${chartData.closes[chartData.dates.indexOf(params.value[0])]}`;
                        },
                    },
                },
            ],
        };
    };

    return (
        <ReactECharts
            option={getOption()}
            style={{ height: 500, width: '100%' }}
            notMerge={true}
            theme={theme}
            showLoading={loading}
        />
    );
}

export default StockChart;