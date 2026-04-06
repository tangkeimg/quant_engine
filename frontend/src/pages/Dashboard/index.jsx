import { useEffect, useState } from 'react';
import { Card, Spin, Toast } from '@douyinfe/semi-ui';
import StockChart from '@/components/StockChart';
import { getIndexData } from '@/api/stock';

function Dashboard() {
    const [chartData, setChartData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getIndexData()
            .then((data) => {
                setChartData(data);
                Toast.success({ content: '大盘数据加载完成' });
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    const latestSignalText = chartData?.latestSignalText || '观望';
    const latestSignalColor =
        latestSignalText === '买入'
            ? '#16a34a'
            : latestSignalText === '卖出'
                ? '#dc2626'
                : '#6b7280';

    return (
        <Card
            title="大盘走势（上证指数）"
            style={{ maxWidth: 1200, margin: '0 auto', borderRadius: 8 }}
            headerStyle={{ borderBottom: 'none', paddingBottom: 0 }}
        >
            <div
                style={{
                    marginBottom: 16,
                    padding: '10px 14px',
                    borderRadius: 8,
                    display: 'inline-block',
                    color: latestSignalColor,
                    fontWeight: 600,
                }}
            >
                当前信号：{latestSignalText}
            </div>

            <Spin spinning={loading} tip="引擎数据加载中，请稍候...">
                <StockChart chartData={chartData} loading={loading} />
            </Spin>
        </Card>
    );
}

export default Dashboard;