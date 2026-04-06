from fastapi import APIRouter
from app.services.data_fetcher import get_index_data
from app.services.backtest_service import run_ma_backtest

router = APIRouter()

@router.get("/index")
def api_get_sh000001():
    """
    获取上证指数数据,默认返回最近365天的数据
    """
    return get_index_data()

@router.get("/strategy/ma")
def api_get_ma_strategy():
    return run_ma_backtest()