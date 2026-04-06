import { Toast } from '@douyinfe/semi-ui';

const BASE_URL = import.meta.env.VITE_BASE_URL ?? 'http://192.168.10.80:18000';

export const request = async (endpoint, options = {}) => {
    try {
        const response = await fetch(`${BASE_URL}${endpoint}`, {
            ...options,
            headers: {
                'Content-Type': 'application/json',
                ...(options.headers ?? {}),
            },
        });

        if (!response.ok) {
            throw new Error(`HTTP 异常! 状态码: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error('API Request Error:', error);
        Toast.error({ content: '引擎连接失败，请检查后端服务运行状态' });
        return Promise.reject(error);
    }
};