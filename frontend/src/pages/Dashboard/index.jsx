import { useEffect, useState } from 'react';
import { Card, Spin, Toast } from '@douyinfe/semi-ui';
import StockChart from '@/components/StockChart';
import { getIndexData, getMAStrategyData } from '@/api/stock';
import TradeTable from '@/components/TradeTable';

function Dashboard() {
    const [chartData, setChartData] = useState(null);
    const [strategyData, setStrategyData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        Promise.all([getIndexData(), getMAStrategyData()])
            .then(([chartRes, strategyRes]) => {
                setChartData(chartRes);
                setStrategyData(strategyRes);
                Toast.success({ content: '数据加载完成' });
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
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
            <div
                style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(3, 1fr)',
                    gap: 16,
                    marginBottom: 16,
                }}
            >
                <Card>
                    <div>总收益率</div>
                    <div style={{ fontSize: 24, fontWeight: 700 }}>
                        {strategyData ? `${strategyData.totalReturn}%` : '--'}
                    </div>
                </Card>

                <Card>
                    <div>最终资产</div>
                    <div style={{ fontSize: 24, fontWeight: 700 }}>
                        {strategyData ? strategyData.finalEquity : '--'}
                    </div>
                </Card>

                <Card>
                    <div>交易次数</div>
                    <div style={{ fontSize: 24, fontWeight: 700 }}>
                        {strategyData ? strategyData.tradeCount : '--'}
                    </div>
                </Card>

            </div>

            <Card
                title={`上证大盘(${latestSignalText})`}
                style={{ borderRadius: 8 }}
                headerStyle={{ borderBottom: 'none', paddingBottom: 0 }}
            >

                <Spin spinning={loading} tip="引擎数据加载中，请稍候...">
                    <StockChart chartData={chartData} loading={loading} />
                </Spin>
            </Card>

            <Card
                title="交易记录"
                style={{ marginTop: 16, borderRadius: 8 }}
            >
                <TradeTable trades={strategyData?.trades || []} />
            </Card>
        </div>
    );
}

export default Dashboard;