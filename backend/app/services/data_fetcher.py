from app.strategies.ma_strategy import apply_ma_signal

import akshare as ak
import pandas as pd
import os

DATA_FILE = "data/sh000001.parquet"


def download_and_save_index():
    """
    下载上证指数数据并保存为Parquet文件
    """
    print("正在下载上证指数数据...")
    df = ak.stock_zh_index_daily(symbol="sh000001")
    df["date"] = pd.to_datetime(df["date"])
    df.to_parquet(DATA_FILE)
    print(f"数据已保存到 {DATA_FILE}")


def get_index_data(days: int = 365) -> dict:
    """
    获取上证指数数据，如果本地文件不存在则下载
    """
    if not os.path.exists(DATA_FILE):
        download_and_save_index()

    df = pd.read_parquet(DATA_FILE)
    df = df.tail(days)  # 获取最近days天的数据

    df = apply_ma_signal(df, 5, 20)

    ma5_list = [None if pd.isna(x) else round(float(x), 2) for x in df["ma5"]]
    ma20_list = [None if pd.isna(x) else round(float(x), 2) for x in df["ma20"]]
    signal_list = df["signal"].astype(int).tolist()

    latest_signal = 0
    latest_signal_text = "观望"
    for s in reversed(signal_list):
        if s == 1:
            latest_signal = 1
            latest_signal_text = "买入"
            break
        if s == -1:
            latest_signal = -1
            latest_signal_text = "卖出"
            break

    return {
        "dates": df["date"].dt.strftime("%Y-%m-%d").tolist(),
        "closes": df["close"].tolist(),
        "ma5": ma5_list,
        "ma20": ma20_list,
        "signals": signal_list,
        "latestSignal": latest_signal,
        "latestSignalText": latest_signal_text,
    }
