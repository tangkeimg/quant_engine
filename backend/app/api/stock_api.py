from fastapi import APIRouter
from app.services.data_fetcher import get_index_data

router = APIRouter()

@router.get("/index")
def api_get_sh000001():
    """
    获取上证指数数据,默认返回最近365天的数据
    """
    return get_index_data()