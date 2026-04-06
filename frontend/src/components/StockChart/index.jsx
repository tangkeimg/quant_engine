import ReactECharts from 'echarts-for-react';
import useThemeStore from '@/store/useThemeStore';

function StockChart({ chartData, loading }) {
    const theme = useThemeStore((state) => state.theme);

    const getOption = () => {
        if (!chartData) {
            return {};
        }

        return {
            tooltip: { trigger: 'axis', axisPointer: { type: 'cross' } },
            dataZoom: [
                { type: 'inside', start: 50, end: 100 },
                { type: 'slider', start: 50, end: 100 },
            ],
            xAxis: { type: 'category', data: chartData.dates, boundaryGap: false },
            yAxis: { type: 'value', scale: true, splitLine: { lineStyle: { type: 'dashed', color: '#eee' } } },
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
                    smooth: true,  // MA5 一般是平滑线
                    showSymbol: false,
                    lineStyle: { width: 2, color: '#FF9800' },  // 设置 MA5 线的颜色
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