import React, { useEffect, useState } from 'react';
import { Layout, Card, Spin, Typography, Toast } from '@douyinfe/semi-ui';
import ReactECharts from 'echarts-for-react';
import { getIndexData, type StockData } from './api/stock';

const { Header, Content } = Layout;
const { Title } = Typography;

const App: React.FC = () => {
    const [theme, _] = useState("dark")
    useEffect(() => {
        const body = document.body;
        theme === 'dark'
            ? body.setAttribute('theme-mode', 'dark')
            : body.removeAttribute('theme-mode');
    }, [theme])

    // 定义状态，用于存储大盘数据
    const [chartData, setChartData] = useState<StockData | null>(null);
    // 定义加载状态
    const [loading, setLoading] = useState<boolean>(true);

    // 🏆 核心：在组件加载时请求数据
    useEffect(() => {
        // 如果后端接口 `/api/stocks/index` 已经可用
        getIndexData()
            .then((data: StockData) => {
                // 成功：更新数据状态
                setChartData(data);
                Toast.success({ content: '大盘数据加载完成' });
            })
            // 原生 request 拦截器会自动 Toast 报错，这里只需要确保加载动画停止
            .finally(() => {
                setLoading(false);
            });
    }, []); // 依赖项数组为空，表示仅在组件初次挂载时执行

    // 动态生成 ECharts 配置项
    const getOption = () => {
        // 如果数据还没回来，返回空配置
        if (!chartData) return {};

        return {
            tooltip: {
                trigger: 'axis',
                axisPointer: { type: 'cross' } // 专业的十字光标
            },
            // 添加底部和内部缩放滑块，方便查看历史细节
            dataZoom: [
                { type: 'inside', start: 50, end: 100 },
                { type: 'slider', start: 50, end: 100 }
            ],
            xAxis: {
                type: 'category',
                data: chartData.dates,
                boundaryGap: false // 金融图表 X 轴通常顶格
            },
            yAxis: {
                type: 'value',
                scale: true, // 保证 Y 轴不从 0 开始，真实反映波动
                splitLine: { lineStyle: { type: 'dashed', color: '#eee' } } // 极细的虚线网格
            },
            series: [
                {
                    name: '上证指数',
                    type: 'line',
                    data: chartData.closes,
                    smooth: false, // K 线图通常不需要平滑曲线
                    showSymbol: false, // 隐藏数据点的小圆圈，更清爽
                    itemStyle: { color: '#E91E63' }, // Semi UI 风格的玫瑰红
                    areaStyle: {
                        color: 'rgba(233, 30, 99, 0.1)' // 底部浅色阴影
                    },
                    lineStyle: { width: 2 }
                }
            ]
        };
    };

    return (
        <Layout style={{ minHeight: '100vh' }}>
            {/* 标准顶部导航 */}
            <Header style={{ padding: '16px 24px', borderBottom: '1px solid' }}>
                <Title heading={3} >
                    Quant Engine
                </Title>
            </Header>
            {/* 主体内容区 */}
            <Content style={{ padding: '24px' }}>
                {/* 使用 Semi UI 的 Card 容器 */}
                <Card
                    title="📈 大盘走势 (上证指数)"
                    style={{ maxWidth: 1200, margin: '0 auto', borderRadius: 8 }}
                    headerStyle={{ borderBottom: 'none', paddingBottom: 0 }}
                >
                    {/* 使用 Spin 组件包裹图表，实现数据加载时的动画 */}
                    <Spin spinning={loading} tip="引擎数据加载中，请稍候...">
                        <ReactECharts
                            option={getOption()}
                            style={{ height: 500, width: '100%' }}
                            notMerge={true}
                            theme={theme}
                        />
                    </Spin>
                </Card>
            </Content>
        </Layout>
    );
};

export default App;