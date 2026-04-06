import { useRoutes } from 'react-router-dom';
import { Layout, Typography } from '@douyinfe/semi-ui';
import routes from './router';

const { Header, Content } = Layout;
const { Title } = Typography;

function App() {
    return (
        <Layout style={{ minHeight: '100vh' }}>
            <Header style={{ padding: '16px 24px', borderBottom: '1px solid var(--semi-color-border)' }}>
                <Title heading={3}>Quant Engine</Title>
                {/* 未来可以在这里加一个 Nav 导航栏，切换看板、策略、回测等路由 */}
            </Header>
            <Content style={{ padding: '24px' }}>
                {useRoutes(routes)}
            </Content>
        </Layout>
    );
}

export default App;