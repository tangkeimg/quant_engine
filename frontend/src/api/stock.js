import { request } from './request';

/**
 * 获取大盘指数数据
 * @returns {Promise<{dates: string[], closes: number[]}>}
 */
export const getIndexData = () => {
    return request('/api/stocks/index');
};

export const getMAStrategyData = () => {
  return request('/api/stocks/strategy/ma');
};