import pandas as pd
from app.services.data_fetcher import DATA_FILE, download_and_save_index
from app.strategies.ma_strategy import apply_ma_signal
import os

def run_ma_backtest(days: int = 365, initial_cash: float = 100000) -> dict:
    """使用简单移动平均线(MA5 和 MA20)策略执行回测。

    策略规则：
    - 当 MA5 上穿 MA20 时触发买入信号（全仓买入）。
    - 当 MA5 下穿 MA20 时触发卖出信号（全部卖出）。

    参数：
        days (int): 使用的最近交易日数量，默认 365。
        initial_cash (float): 初始资金，默认 100000。

    返回：
        dict: 包含日期、收盘价、移动平均线、信号、权益曲线、交易记录等用于前端显示的结果。
    """

    # 如果数据文件不存在，则下载并保存
    if not os.path.exists(DATA_FILE):
        download_and_save_index()

    # 读取本地数据并取最近 `days` 条记录的副本，避免修改原始数据
    df = pd.read_parquet(DATA_FILE).tail(days).copy()

    df = apply_ma_signal(df, 5, 20)

    # 回测初始状态
    cash = initial_cash  # 当前现金
    position = 0.0       # 当前持仓（股数）
    equity_curve = []    # 每日权益（用于绘图）
    trades = []          # 交易记录（按时间顺序）

    # 遍历每日数据，按信号执行交易（使用收盘价成交）
    for _, row in df.iterrows():
        date = row["date"].strftime("%Y-%m-%d")
        close = float(row["close"])
        signal = int(row["signal"])

        # 买入：全部资金买入（简单示例，不考虑滑点与手续费）
        if signal == 1 and cash > 0:
            position = cash / close
            trades.append({
                "date": date,
                "action": "buy",
                "price": round(close, 2),
                "shares": round(position, 4),
            })
            cash = 0

        # 卖出：全部持仓卖出
        elif signal == -1 and position > 0:
            cash = position * close
            trades.append({
                "date": date,
                "action": "sell",
                "price": round(close, 2),
                "shares": round(position, 4),
            })
            position = 0

        # 记录当日权益（现金 + 持仓市值）
        equity = cash + position * close
        equity_curve.append(round(equity, 2))

    # 计算最终权益与百分比收益
    final_equity = equity_curve[-1] if equity_curve else initial_cash
    total_return = round((final_equity / initial_cash - 1) * 100, 2)

    # 返回统一格式，便于前端直接消费
    return {
        "dates": df["date"].dt.strftime("%Y-%m-%d").tolist(),
        "closes": df["close"].round(2).tolist(),
        "ma5": [None if pd.isna(x) else round(float(x), 2) for x in df["ma5"]],
        "ma20": [None if pd.isna(x) else round(float(x), 2) for x in df["ma20"]],
        "signals": df["signal"].astype(int).tolist(),
        "equityCurve": equity_curve,
        "initialCash": initial_cash,
        "finalEquity": round(final_equity, 2),
        "totalReturn": total_return,
        "tradeCount": len(trades),
        "trades": trades,
    }