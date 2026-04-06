import { useEffect } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { Layout, Typography } from '@douyinfe/semi-ui';
import Dashboard from './pages/Dashboard';
import useThemeStore from '@/store/useThemeStore';

const { Header, Content } = Layout;
const { Title } = Typography;

function App() {
    const theme = useThemeStore((state) => state.theme);

    useEffect(() => {
        const body = document.body;

        if (theme === 'dark') {
            body.setAttribute('theme-mode', 'dark');
            return;
        }

        body.removeAttribute('theme-mode');
    }, [theme]);

    return (
        <BrowserRouter>
            <Layout style={{ minHeight: '100vh' }}>
                <Header style={{ padding: '16px 24px', borderBottom: '1px solid var(--semi-color-border)' }}>
                    <Title heading={3}>Quant Engine</Title>
                    {/* 未来可以在这里加一个 Nav 导航栏，切换看板、策略、回测等路由 */}
                </Header>
                <Content style={{ padding: '24px' }}>
                    <Routes>
                        <Route path="/" element={<Navigate to="/dashboard" replace />} />
                        <Route path="/dashboard" element={<Dashboard />} />
                        {/* 未来新增路由 */}
                        {/* <Route path="/strategy" element={<StrategyConfig />} /> */}
                        {/* <Route path="/backtest" element={<BacktestReport />} /> */}
                    </Routes>
                </Content>
            </Layout>
        </BrowserRouter>
    );
}

export default App;