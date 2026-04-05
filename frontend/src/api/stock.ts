import { request } from './request';

export interface StockData {
    dates: string[];
    closes: number[];
}

/**
 * 获取大盘指数数据
 */
export const getIndexData = () => {
    // 调用封装好的原生 request
    return request<StockData>('/api/stocks/index');
};