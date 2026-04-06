from operator import ge

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

    df["ma5"] = df["close"].rolling(window=5).mean()  # 计算5日均线
    df["ma20"] = df["close"].rolling(window=20).mean()  # 计算20日均线

    # 信号：1=买入，-1=卖出，0=无信号
    df["signal"] = 0

    buy_mask = (df["ma5"] > df["ma20"]) & (df["ma5"].shift(1) <= df["ma20"].shift(1))
    sell_mask = (df["ma5"] < df["ma20"]) & (df["ma5"].shift(1) >= df["ma20"].shift(1))

    df.loc[buy_mask, "signal"] = 1
    df.loc[sell_mask, "signal"] = -1

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
