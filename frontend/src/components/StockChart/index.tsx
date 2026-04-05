import React from 'react';
import ReactECharts from 'echarts-for-react';
import { type StockData } from '../../api/stock';

// 定义组件接收的属性 (Props)
interface StockChartProps {
    chartData: StockData | null;
    loading: boolean;
    theme: string;
}

const StockChart: React.FC<StockChartProps> = ({ chartData, loading, theme }) => {
    const getOption = () => {
        if (!chartData) return {};
        return {
            tooltip: { trigger: 'axis', axisPointer: { type: 'cross' } },
            dataZoom: [
                { type: 'inside', start: 50, end: 100 },
                { type: 'slider', start: 50, end: 100 }
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
                    lineStyle: { width: 2 }
                }
            ]
        };
    };

    return (
        <ReactECharts
            option={getOption()}
            style={{ height: 500, width: '100%' }}
            notMerge={true}
            theme={theme}
            showLoading={loading} // 可以直接利用 ECharts 自带的 loading
        />
    );
};

export default StockChart;