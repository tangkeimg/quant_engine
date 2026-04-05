import { Toast } from '@douyinfe/semi-ui';

const BASE_URL = 'http://192.168.10.67:18000';


export const request = async <T>(endpoint: string, options?: RequestInit): Promise<T> => {
    try {
        const response = await fetch(`${BASE_URL}${endpoint}`, {
            ...options,
            headers: {
                'Content-Type': 'application/json',
                ...options?.headers,
            },
        });

        if (!response.ok) {
            throw new Error(`HTTP 异常! 状态码: ${response.status}`);
        }

        // 直接解析并返回我们需要的数据载荷
        return (await response.json()) as T;
    } catch (error) {
        console.error('API Request Error:', error);
        // 全局统一报错
        Toast.error({ content: '引擎连接失败，请检查后端服务运行状态' });
        return Promise.reject(error);
    }
};