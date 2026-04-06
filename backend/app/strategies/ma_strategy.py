import pandas as pd


def apply_ma_signal(df: pd.DataFrame, short_window: int = 5, long_window: int = 20) -> pd.DataFrame:
    df = df.copy()

    short_col = f"ma{short_window}"
    long_col = f"ma{long_window}"

    df[short_col] = df["close"].rolling(short_window).mean()
    df[long_col] = df["close"].rolling(long_window).mean()

    df["signal"] = 0

    buy_mask = (
        (df[short_col] > df[long_col]) &
        (df[short_col].shift(1) <= df[long_col].shift(1))
    )
    sell_mask = (
        (df[short_col] < df[long_col]) &
        (df[short_col].shift(1) >= df[long_col].shift(1))
    )

    df.loc[buy_mask, "signal"] = 1
    df.loc[sell_mask, "signal"] = -1

    return df