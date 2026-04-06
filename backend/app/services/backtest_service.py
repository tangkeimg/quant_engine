import pandas as pd
from app.services.data_fetcher import DATA_FILE, download_and_save_index
import os

def run_ma_backtest(days: int = 365, initial_cash: float = 100000) -> dict:
    if not os.path.exists(DATA_FILE):
        download_and_save_index()

    df = pd.read_parquet(DATA_FILE).tail(days).copy()

    df["ma5"] = df["close"].rolling(5).mean()
    df["ma20"] = df["close"].rolling(20).mean()

    df["signal"] = 0
    buy_mask = (df["ma5"] > df["ma20"]) & (df["ma5"].shift(1) <= df["ma20"].shift(1))
    sell_mask = (df["ma5"] < df["ma20"]) & (df["ma5"].shift(1) >= df["ma20"].shift(1))

    df.loc[buy_mask, "signal"] = 1
    df.loc[sell_mask, "signal"] = -1

    cash = initial_cash
    position = 0.0
    equity_curve = []
    trades = []

    for _, row in df.iterrows():
        date = row["date"].strftime("%Y-%m-%d")
        close = float(row["close"])
        signal = int(row["signal"])

        if signal == 1 and cash > 0:
            position = cash / close
            trades.append({
                "date": date,
                "action": "buy",
                "price": round(close, 2),
                "shares": round(position, 4),
            })
            cash = 0

        elif signal == -1 and position > 0:
            cash = position * close
            trades.append({
                "date": date,
                "action": "sell",
                "price": round(close, 2),
                "shares": round(position, 4),
            })
            position = 0

        equity = cash + position * close
        equity_curve.append(round(equity, 2))

    final_equity = equity_curve[-1] if equity_curve else initial_cash
    total_return = round((final_equity / initial_cash - 1) * 100, 2)

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