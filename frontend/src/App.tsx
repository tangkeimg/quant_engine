import React, { useEffect, useState } from 'react';
import { Layout, Card, Spin, Typography, Toast } from '@douyinfe/semi-ui';
import ReactECharts from 'echarts-for-react';

const { Header, Content } = Layout;
const { Title } = Typography;

// 定义接口返回的数据结构
interface StockData {
    dates: string[];
    closes: number[];
}

const App: React.FC = () => {
    const [chartData, setChartData] = useState<StockData | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        // 请求你的后端接口
        fetch('http://192.168.10.67:18000/api/stocks/index')
            .then(res => {
                if (!res.ok) throw new Error('网络响应异常');
                return res.json();
            })
            .then((data: StockData) => {
                setChartData(data);
                setLoading(false);
            })
            .catch(err => {
                console.error("引擎连接失败:", err);
                Toast.error({ content: '后端数据获取失败，请检查 FastAPI 是否启动' });
                setLoading(false);
            });
    }, []);

    // 动态生成 ECharts 配置项
    const getOption = () => {
        if (!chartData) return {};
        
        return {
            tooltip: { 
                trigger: 'axis',
                axisPointer: { type: 'cross' }
            },
            // 添加底部缩放滑块，方便查看历史细节
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
                splitLine: { lineStyle: { type: 'dashed', color: '#eee' } }
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
        <Layout style={{ minHeight: '100vh', backgroundColor: '#f4f5f5' }}>
            <Header style={{ padding: '16px 24px', backgroundColor: '#fff', borderBottom: '1px solid #e1e3e5' }}>
                <Title heading={3} style={{ margin: 0, color: '#1c1f23' }}>
                    Quant Engine
                </Title>
            </Header>
            <Content style={{ padding: '24px' }}>
                <Card 
                    title="📈 大盘走势 (上证指数)" 
                    style={{ maxWidth: 1200, margin: '0 auto', borderRadius: 8 }}
                    headerStyle={{ borderBottom: 'none', paddingBottom: 0 }}
                >
                    <Spin spinning={loading} tip="引擎数据加载中，请稍候...">
                        <ReactECharts 
                            option={getOption()} 
                            style={{ height: 500, width: '100%' }} 
                            notMerge={true}
                        />
                    </Spin>
                </Card>
            </Content>
        </Layout>
    );
};

export default App;