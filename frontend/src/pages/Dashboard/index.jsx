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

    return (
        <Card
            title="📈 大盘走势 (上证指数)"
            style={{ maxWidth: 1200, margin: '0 auto', borderRadius: 8 }}
            headerStyle={{ borderBottom: 'none', paddingBottom: 0 }}
        >
            <Spin spinning={loading} tip="引擎数据加载中，请稍候...">
                <StockChart chartData={chartData} loading={loading} />
            </Spin>
        </Card>
    );
}

export default Dashboard;